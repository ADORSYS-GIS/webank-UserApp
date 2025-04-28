export class PasswordManager {
  private static readonly STORAGE_KEY = "encryption-password";

  static getPassword(): string {
    let password = localStorage.getItem(this.STORAGE_KEY);

    if (!password) {
      // Generate 32-character password with 256-bit entropy
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      password = btoa(String.fromCharCode(...array)).slice(0, 32);
      localStorage.setItem(this.STORAGE_KEY, password);
      console.warn("⚠️ New password generated and stored in localStorage");
    }

    return password;
  }

  static resetPassword(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log("Password reset - new password will be generated on next use");
  }
}
