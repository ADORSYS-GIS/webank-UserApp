import { useEffect } from "react";
import { requestNotificationPermission, getFirebaseToken, onMessageListener } from "./firebase";

const sendTokenToBackend = async (token: string, userId: string) => {
  try {
    await fetch("http://localhost:8081/api/notifications/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    });
    console.log("Token successfully sent to backend.");
  } catch (error) {
    console.error("Error sending token to backend:", error);
  }
};

const NotificationHandler = (userId: string) => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (await requestNotificationPermission()) {
        const token = await getFirebaseToken();
        if (token) await sendTokenToBackend(token, userId);
      }
    };

    setupNotifications();

    // Listen for foreground notifications
    // eslint-disable-next-line
    onMessageListener().then((payload: any) => {
      alert(`New notification: ${payload.notification?.title}`);
    });
  }, [userId]);

  return null; // This component does not render anything
};

export default NotificationHandler;
