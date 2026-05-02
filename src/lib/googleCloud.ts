/**
 * @fileoverview Google Cloud Platform integration utilities.
 *
 * Provides helper functions for interacting with Google Cloud services
 * including Cloud Logging, Vertex AI, and BigQuery integration patterns.
 * These utilities support the Election Education Assistant's analytics
 * and AI capabilities when deployed on Google Cloud Run.
 *
 * @module lib/googleCloud
 */

/**
 * Structured log entry for Google Cloud Logging.
 * When running on Cloud Run, console output in this format is automatically
 * parsed by Cloud Logging and indexed for querying.
 *
 * @see https://cloud.google.com/run/docs/logging
 */
export interface CloudLogEntry {
  /** Log severity level */
  severity: "INFO" | "WARNING" | "ERROR" | "DEBUG";
  /** Human-readable log message */
  message: string;
  /** Additional structured data for the log entry */
  metadata?: Record<string, unknown>;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Service identifier */
  serviceContext: {
    service: string;
    version: string;
  };
}

/**
 * Writes a structured log entry to stdout in a format that Google Cloud
 * Logging automatically parses when deployed on Cloud Run.
 *
 * In local development, this simply logs to the console.
 * In production on Cloud Run, these logs appear in the Google Cloud Console
 * under Logging > Logs Explorer with full filtering and alerting support.
 *
 * @param {string} severity - Log level: INFO, WARNING, ERROR, or DEBUG
 * @param {string} message - The log message
 * @param {Record<string, unknown>} [metadata] - Optional structured metadata
 *
 * @example
 * ```ts
 * cloudLog("INFO", "User started quiz", { userId: "anon-123", topic: "voting" });
 * ```
 */
export function cloudLog(
  severity: CloudLogEntry["severity"],
  message: string,
  metadata?: Record<string, unknown>
): void {
  const entry: CloudLogEntry = {
    severity,
    message,
    metadata,
    timestamp: new Date().toISOString(),
    serviceContext: {
      service: "election-education-assistant",
      version: process.env.K_REVISION || "local-dev",
    },
  };

  // Cloud Run automatically parses structured JSON from stdout
  if (process.env.K_SERVICE) {
    // Running on Cloud Run — use structured logging
    process.stdout.write(JSON.stringify(entry) + "\n");
  } else {
    // Local development — use readable console output
    const prefix = `[${severity}]`;
    if (severity === "ERROR") {
      console.error(prefix, message, metadata || "");
    } else if (severity === "WARNING") {
      console.warn(prefix, message, metadata || "");
    }
    // Skip INFO/DEBUG in local to reduce noise
  }
}

/**
 * Configuration for Google Cloud Vertex AI integration.
 * Used when the application needs to leverage Google's AI/ML APIs
 * for enhanced natural language understanding.
 *
 * @see https://cloud.google.com/vertex-ai/docs
 */
export const VERTEX_AI_CONFIG = {
  /** Google Cloud project ID from environment */
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  /** Deployment region for Vertex AI endpoints */
  location: "us-central1",
  /** Model endpoint for election-specific content generation */
  model: "gemini-1.5-flash",
  /** Safety settings for educational content */
  safetySettings: {
    blockNone: false,
    maxOutputTokens: 600,
    temperature: 0.7,
  },
} as const;

/**
 * Generates a BigQuery-compatible event schema for analytics export.
 * This format allows Firestore events to be seamlessly exported to
 * BigQuery for advanced analytics and reporting dashboards.
 *
 * @param {string} eventName - The event name
 * @param {Record<string, unknown>} data - Event data
 * @returns {Record<string, unknown>} BigQuery-formatted event record
 *
 * @example
 * ```ts
 * const record = toBigQueryRecord("quiz_completed", { score: 8 });
 * // { event_name: "quiz_completed", event_timestamp: "...", score: 8, ... }
 * ```
 */
export function toBigQueryRecord(
  eventName: string,
  data: Record<string, unknown>
): Record<string, unknown> {
  return {
    event_name: eventName,
    event_timestamp: new Date().toISOString(),
    event_date: new Date().toISOString().split("T")[0],
    platform: "web",
    app_version: "1.0.0",
    ...data,
  };
}
