/**
 * @fileoverview Firebase configuration and Google Cloud service initialization.
 *
 * Provides centralized Firebase app initialization, Firestore database access,
 * Google Analytics integration, Firebase Performance Monitoring, and structured
 * event logging for the Election Education Assistant deployed on Cloud Run.
 *
 * Google Services Used:
 * - Firebase / Firestore (real-time database)
 * - Firebase Analytics (user engagement tracking)
 * - Firebase Performance Monitoring (app performance)
 * - Google Cloud Logging (via googleCloud.ts)
 * - Vertex AI configuration (via googleCloud.ts)
 *
 * @module lib/firebase
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { getAnalytics, logEvent, isSupported, type Analytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

/**
 * Firebase configuration populated from NEXT_PUBLIC_ environment variables.
 * All values are client-safe and required for connecting to the Firebase project.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Singleton Firebase app instance.
 * Uses getApps() to prevent re-initialization during Next.js hot reloads.
 */
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Firestore database instance.
 * Used for persisting chat events, quiz scores, and user analytics.
 */
export const db: Firestore = getFirestore(app);

/** Firebase Analytics instance — initialized client-side only */
let analyticsInstance: Analytics | null = null;

/**
 * Initializes Firebase Analytics and Performance Monitoring.
 * Only runs in the browser environment to avoid SSR issues.
 * Checks browser support before initializing (handles ad-blockers gracefully).
 */
async function initClientServices(): Promise<void> {
  if (typeof window === "undefined") return;

  const supported = await isSupported();
  if (supported) {
    analyticsInstance = getAnalytics(app);

    // Firebase Performance Monitoring — tracks page load, API latency, etc.
    try {
      getPerformance(app);
    } catch {
      // Performance monitoring is optional — fail silently
    }
  }
}

// Trigger initialization on module load (client-side only)
initClientServices();

export { analyticsInstance as analytics };

/**
 * Logs a custom event to both Firebase Analytics and Firestore.
 *
 * Dual-logging ensures:
 * - Firebase Analytics: Real-time dashboards in Firebase Console
 * - Firestore: Persistent storage queryable via BigQuery export
 *
 * Both integrate with Google Cloud's analytics ecosystem for comprehensive
 * usage tracking across the election education platform.
 *
 * @param {string} eventName - Event name (e.g., "quiz_completed", "topic_viewed")
 * @param {Record<string, unknown>} data - Structured event metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```ts
 * await logEventToFirestore("quiz_completed", { score: 8, total: 8, country: "India" });
 * ```
 */
export const logEventToFirestore = async (
  eventName: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    // Google Analytics event tracking
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, data as Record<string, string | number | boolean>);
    }

    // Firestore persistence for BigQuery export
    const eventsRef = collection(db, "analytics_events");
    await addDoc(eventsRef, {
      eventName,
      ...data,
      timestamp: serverTimestamp(),
      source: "election-education-assistant",
      platform: "web",
      version: "1.0.0",
    });
  } catch (error: unknown) {
    // Analytics must never break user experience
    if (error instanceof Error) {
      console.error(`[Firebase] Event logging failed: ${error.message}`);
    }
  }
};

/**
 * Logs a page view event to Firebase Analytics.
 * Called when the user navigates to a new election topic section.
 *
 * @param {string} pageName - The topic or page being viewed
 *
 * @example
 * ```ts
 * logPageView("Voter Registration");
 * ```
 */
export const logPageView = (pageName: string): void => {
  if (analyticsInstance) {
    logEvent(analyticsInstance, "page_view", {
      page_title: pageName,
      page_location: typeof window !== "undefined" ? window.location.href : "",
      content_type: "election_education",
    });
  }
};

/**
 * Logs a quiz completion event with score data to Firebase Analytics.
 * Used to track learning outcomes across the election education platform.
 *
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 */
export const logQuizCompletion = (score: number, total: number): void => {
  if (analyticsInstance) {
    logEvent(analyticsInstance, "quiz_completion", {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      content_type: "election_quiz",
    });
  }
};
