import {
  handleRegister,
  handleAuthenticate,
  saveMessage,
} from "@adorsys-gis/web-auth-prf";

export class PasswordManager {
  private static isRegistering = false;
  private static isAuthenticating = false;

  static async initializeDOMElements() {
    console.log("🛠 Initializing required DOM elements...");

    if (!document.querySelector("#messageInput")) {
      console.log("ℹ️ Creating message input field...");
      const input = document.createElement("input");
      input.type = "hidden";
      input.id = "messageInput";
      document.body.appendChild(input);
    }

    if (!document.querySelector("#messageList")) {
      console.log("ℹ️ Creating message list...");
      const list = document.createElement("ul");
      list.id = "messageList";
      list.style.display = "none";
      document.body.appendChild(list);
    }

    if (!document.querySelector("#error")) {
      console.log("ℹ️ Creating error display...");
      const errorDiv = document.createElement("div");
      errorDiv.id = "error";
      errorDiv.style.color = "red";
      errorDiv.style.display = "none";
      document.body.appendChild(errorDiv);
    }
  }

  static async getPassword(): Promise<string | undefined> {
    console.log("🔍 Retrieving password...");
    await this.initializeDOMElements();

    try {
      const messages = JSON.parse(localStorage.getItem("messages") ?? "[]");
      console.log("📦 Stored messages found:", messages);

      if (messages.length > 0) {
        console.log("🔑 Attempting authentication...");
        return await this.attemptAuthentication();
      }
      console.log("🚀 No stored messages. Initiating registration...");
      return await this.handleNewUserRegistration();
    } catch (error) {
      console.error("❌ Password retrieval error:", error);
      return undefined;
    }
  }

  private static async attemptAuthentication(): Promise<string | undefined> {
    console.log("🔐 Attempting authentication...");
    if (this.isAuthenticating) {
      console.warn("⚠️ Authentication already in progress");
      return undefined;
    }
    this.isAuthenticating = true;

    try {
      await this.cancelPendingRequests();
      const decryptedPassword = await handleAuthenticate();
      console.log(
        "✅ Authentication successful. Decrypted password:",
        decryptedPassword?.[0],
      );
      return decryptedPassword?.[0];
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      return undefined;
    } finally {
      this.isAuthenticating = false;
    }
  }

  private static async handleNewUserRegistration(): Promise<
    string | undefined
  > {
    console.log("👤 Registering new user...");

    if (this.isRegistering) {
      console.warn("⚠️ Registration already in progress");
      return undefined;
    }

    this.isRegistering = true;
    try {
      console.log("📝 Starting WebAuthn registration...");
      await this.cancelPendingRequests();
      await handleRegister();
      console.log("✅ User successfully registered");

      console.log("🔄 Attempting post-registration authentication...");
      const newPassword = this.generateSecurePassword();
      console.log("🔑 Generated password (unencrypted):", newPassword);

      console.log("💾 Storing password securely...");
      const input = document.querySelector<HTMLInputElement>("#messageInput")!;
      input.value = newPassword;
      console.log("✅ Password stored successfully", newPassword);
      await saveMessage();

      return this.attemptAuthentication();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      localStorage.removeItem("messages");
      return undefined;
    } finally {
      this.isRegistering = false;
    }
  }

  private static async cancelPendingRequests(): Promise<void> {
    console.log("⏳ Cancelling pending authentication requests...");
    try {
      const abortController = new AbortController();
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      setTimeout(() => abortController.abort(), 100);
      await navigator.credentials.get({
        signal: abortController.signal,
        publicKey: { challenge, allowCredentials: [] },
      });
      console.log("✅ Pending requests cancelled");
    } catch (error) {
      console.warn(
        "⚠️ Expected abort error during request cancellation",
        error,
      );
    }
  }

  private static generateSecurePassword(): string {
    console.log("🔐 Generating a secure password...");
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const password = btoa(String.fromCharCode(...array)).slice(0, 32);
    console.log("🔑 Secure password generated:", password);
    return password;
  }
}