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

  static async getPassword(): Promise<string | undefined> {
    await this.initializeDOMElements();

    try {
      const messages = JSON.parse(localStorage.getItem("messages") ?? "[]");
      if (messages.length > 0) {
        return await this.attemptAuthentication();
      }
      return await this.handleNewUserRegistration();
    } catch (error) {
      console.error("Password retrieval error:", error);
      return undefined;
    }
  }

  private static async attemptAuthentication(): Promise<string | undefined> {
    if (this.isAuthenticating) return undefined;
    this.isAuthenticating = true;

    try {
      await this.cancelPendingRequests();
      const decryptedPassword = await handleAuthenticate();
      return decryptedPassword?.[0];
    } catch (error) {
      console.error("Authentication failed:", error);
      return undefined;
    } finally {
      this.isAuthenticating = false;
    }
  }

  private static async handleNewUserRegistration(): Promise<
    string | undefined
  > {
    console.log("👤 No existing user found. Starting registration...");

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
      return undefined;
    } finally {
      this.isRegistering = false;
    }
  }

  private static async cancelPendingRequests(): Promise<void> {
    try {
      const abortController = new AbortController();
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      setTimeout(() => abortController.abort(), 100);
      await navigator.credentials.get({
        signal: abortController.signal,
        publicKey: { challenge, allowCredentials: [] },
      });
    } catch (error) {
      // Expected abort error
    }
  }

  private static generateSecurePassword(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).slice(0, 32);
  }
}
