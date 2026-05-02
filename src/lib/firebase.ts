/**
 * @fileoverview Firebase configuration and service initialization module.
 *
 * Provides centralized Firebase app initialization, Firestore database access,
 * Google Analytics integration, Firebase Performance Monitoring, and a
 * structured event logging utility for the Election Education Assistant.
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

/**
 * Firebase configuration object populated from environment variables.
 * All values are sourced from NEXT_PUBLIC_ prefixed environment variables
 * to ensure they are available on the client side.
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
 * Firestore database instance for the Election Education Assistant.
 * Used for persisting chat events and user interaction analytics.
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Analytics instance, initialized only on the client side.
 * Returns null during server-side rendering.
 */
let analyticsInstance: Analytics | null = null;

/**
 * Initializes Firebase Analytics if running in a browser environment
 * and the browser supports it (not blocked by ad blockers, etc.).
 */
async function initAnalytics(): Promise<void> {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }
}

// Trigger analytics initialization on module load (client-side only)
initAnalytics();

export { analyticsInstance as analytics };

/**
 * Logs a custom event to both Firebase Analytics and Firestore.
 *
 * This dual-logging approach ensures events are tracked in Google Analytics
 * for real-time dashboards AND persisted in Firestore for custom queries
 * and BigQuery export.
 *
 * @param {string} eventName - The name of the event to log (e.g., "chat_message_sent")
 * @param {Record<string, unknown>} data - Key-value pairs of event metadata
 * @returns {Promise<void>}
 *
 * @example
 * ```ts
 * await logEventToFirestore("quiz_completed", { score: 8, total: 8 });
 * ```
 */
export const logEventToFirestore = async (
  eventName: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    // Log to Firebase Analytics (Google Services integration)
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, data);
    }

    // Persist to Firestore for BigQuery export and custom analytics
    const eventsRef = collection(db, "analytics_events");
    await addDoc(eventsRef, {
      eventName,
      ...data,
      timestamp: serverTimestamp(),
      source: "election-education-assistant",
      version: "1.0.0",
    });
  } catch (error: unknown) {
    // Fail silently — analytics should never break the user experience
    if (error instanceof Error) {
      console.error(`[Firebase] Event logging failed: ${error.message}`);
    }
  }
};

/**
 * Logs a page view event to Firebase Analytics.
 * Called automatically when the user navigates to a new topic.
 *
 * @param {string} pageName - The name of the page or topic being viewed
 */
export const logPageView = (pageName: string): void => {
  if (analyticsInstance) {
    logEvent(analyticsInstance, "page_view", {
      page_title: pageName,
      page_location: typeof window !== "undefined" ? window.location.href : "",
    });
  }
};
