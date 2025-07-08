import webAuth from "@adorsys-gis/web-auth";
import { LogLevel } from "@adorsys-gis/web-auth-logger";
import { toast } from "sonner";
import { getProjectEnvVariables } from "../../shared/projectEnvVariables";

const { VITE_WEBANK_WEBAUTH_RP_ID, VITE_WEBANK_WEBAUTH_RP_NAME } =
  getProjectEnvVariables().envVariables;

export class PasswordManager {
  private static isRegistering = false;
  private static isAuthenticating = false;

  private static readonly webAuthInstance = webAuth({
    credentialOptions: {
      rp: {
        id: VITE_WEBANK_WEBAUTH_RP_ID || "localhost",
        name: VITE_WEBANK_WEBAUTH_RP_NAME || "WeBank",
      },
      creationOptions: {
        authenticatorSelection: {
          residentKey: "required",
          requireResidentKey: true,
          userVerification: "required",
        },
      },
    },
    encryptionOptions: {
      tagLength: 128,
    },
    logLevel: LogLevel.debug,
  });

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
      toast.error("Failed to retrieve password");
      return undefined;
    }
  }

  private static async attemptAuthentication(): Promise<string | undefined> {
    if (this.isAuthenticating) return undefined;
    this.isAuthenticating = true;

    try {
      await this.cancelPendingRequests();
      const { credential } = this.webAuthInstance;

      // Get the credential
      const result = await credential.authenticate();
      if (!result?.userHandle) {
        toast.error("Authentication failed");
        return undefined;
      }

      // Get the stored password
      const storedPassword = await this.webAuthInstance.storage.get("password");
      if (!storedPassword?.data) {
        toast.error("Password not found");
        return undefined;
      }

      // Convert ArrayBuffer to string
      const decoder = new TextDecoder();
      const passwordArray = new Uint8Array(storedPassword.data as ArrayBuffer);
      return decoder.decode(passwordArray);
    } catch (error) {
      console.error("Authentication failed:", error);
      toast.error("Failed to authenticate with password manager");
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
      const { credential } = this.webAuthInstance;

      // Generate a new password
      const newPassword = this.generateSecurePassword();

      // Register new credential
      const result = await credential.register({
        user: {
          name: "webank-user",
          displayName: "WeBank",
        },
      });

      if (!result) {
        throw new Error("Registration failed");
      }

      // Convert password to ArrayBuffer and store it
      const encoder = new TextEncoder();
      const passwordArray = encoder.encode(newPassword);
      await this.webAuthInstance.storage.save("password", {
        data: passwordArray.buffer as ArrayBuffer,
      });

      toast.success("Password saved to password manager");
      return newPassword;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Failed to register with password manager");
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
