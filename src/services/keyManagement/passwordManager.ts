import {
  handleRegister,
  handleAuthenticate,
  saveMessage,
} from "@adorsys-gis/web-auth-prf";

export class PasswordManager {
  private static isRegistering = false;
  private static isAuthenticating = false;

  static async initializeDOMElements() {
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
  }

  static async getPassword(): Promise<string | undefined> {
    // Check sessionStorage for password
    const storedPassword = sessionStorage.getItem("password");
    if (storedPassword) {
      return storedPassword;
    }

    await this.initializeDOMElements();

    try {
      const messages = JSON.parse(localStorage.getItem("messages") ?? "[]");
      let password: string | undefined;
      if (messages.length > 0) {
        password = await this.attemptAuthentication();
      } else {
        password = await this.handleNewUserRegistration();
      }
      // Store password in sessionStorage if retrieved or generated
      if (password) {
        sessionStorage.setItem("password", password);
      }
      return password;
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
    if (this.isRegistering) return undefined;
    this.isRegistering = true;

    try {
      await this.cancelPendingRequests();
      await handleRegister();

      const newPassword = this.generateSecurePassword();
      const input = document.querySelector<HTMLInputElement>("#messageInput")!;
      input.value = newPassword;
      await saveMessage();

      return newPassword;
    } catch (error) {
      console.error("Registration failed:", error);
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
