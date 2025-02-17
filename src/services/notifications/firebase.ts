import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Request permission to send notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await Notification.requestPermission();
    console.log(`Notification permission: ${permission}`);
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

/**
 * Get the FCM token for this device
 */
export const getFirebaseToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    console.warn("No FCM token available. Request permission.");
    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Listen for foreground push notifications
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);
      resolve(payload);
    });
  });
