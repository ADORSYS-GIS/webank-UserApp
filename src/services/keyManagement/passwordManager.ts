import { handleRegister, handleAuthenticate, saveMessage } from "@adorsys-gis/web-auth-prf";

export class PasswordManager {
  private static readonly MESSAGE_ID = "password-storage";
  private static isRegistering = false;
  private static isAuthenticating = false;

  static async initializeDOMElements() {
    console.log("🛠 Initializing required DOM elements...");
    if (!document.querySelector("#messageInput")) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.id = "messageInput";
      document.body.appendChild(input);
    }
    
    if (!document.querySelector("#messageList")) {
      const list = document.createElement("ul");
      list.id = "messageList";
      list.style.display = "none";
      document.body.appendChild(list);
    }
    
    if (!document.querySelector("#error")) {
      const errorDiv = document.createElement("div");
      errorDiv.id = "error";
      errorDiv.style.color = "red";
      document.body.appendChild(errorDiv);
    }
  }

  static async getPassword(): Promise<string> {
    console.log("🔍 Starting password retrieval process...");
    await this.initializeDOMElements();

    try {
      // Check for existing password
      const messages = JSON.parse(localStorage.getItem("messages") || "[]");
      if (messages.length > 0) {
        const storedPassword = await this.attemptAuthentication();
        if (storedPassword) return storedPassword;
      }
      // Proceed to registration if no password is found
      return await this.handleNewUserRegistration();
    } catch (error) {
      console.error("❌ Critical error in password retrieval:", error);
      return "";
    }
  }

  private static async attemptAuthentication(): Promise<string | null> {
    if (this.isAuthenticating) {
      console.warn("⚠️ Authentication already in progress");
      return null;
    }

    this.isAuthenticating = true;
    try {
      console.log("🔑 Starting authentication process...");
      await this.cancelPendingRequests();
      const decyptedPassword = await handleAuthenticate();
      console.log("✅ Authentication successful");

      return "decyptedPassword";
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      return null;
    } finally {
      this.isAuthenticating = false;
    }
  }

  private static async handleNewUserRegistration(): Promise<string> {
    console.log("👤 No existing user found. Starting registration...");
  
    if (this.isRegistering) {
      console.warn("⚠️ Registration already in progress");
      return "";
    }
  
    this.isRegistering = true;
    try {
      console.log("📝 Starting WebAuthn registration...");
      await this.cancelPendingRequests();
      await handleRegister();
      console.log("✅ User successfully registered");
  
      console.log("✅ Post-registration authentication successful");
  
      // Generate and store password only if authentication is successful
      const newPassword = this.generateSecurePassword();
      console.log("Generated non-encrypted password:", newPassword);
  
      console.log("💾 Storing encrypted password...");
      const input = document.querySelector<HTMLInputElement>("#messageInput")!;
      input.value = newPassword;
      await saveMessage();
      return this.attemptAuthentication();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      return "";
    } finally {
      this.isRegistering = false;
    }
  }

  private static async cancelPendingRequests(): Promise<void> {
    console.log("🔄 Cleaning up pending WebAuthn requests...");
    try {
      await navigator.credentials.get({ publicKey: { allowCredentials: [] } });
      console.log("✅ Pending requests cleared");
    } catch (error) {
      console.warn("⚠️ Error cleaning pending requests:");
    }
  }

  private static generateSecurePassword(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).slice(0, 32);
  }

}
