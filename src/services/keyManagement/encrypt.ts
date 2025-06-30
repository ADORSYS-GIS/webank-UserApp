// encrypt.ts
import * as jose from "jose";
import { PasswordManager } from "./passwordManager";
import { toast } from "sonner";

export async function encryptPrivateKey(privateJwk: JsonWebKey) {
  const password = await PasswordManager.getPassword();
  if (!password) {
    toast.error("Password retrieval failed. please try again");
    throw new Error("Password retrieval failed.");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"],
  );

  const plaintext = new TextEncoder().encode(JSON.stringify(privateJwk));
  const encryptor = new jose.CompactEncrypt(plaintext);
  encryptor.setProtectedHeader({ alg: "dir", enc: "A256GCM" });

  // Ensure JWE is a string
  const jwe = await encryptor.encrypt(derivedKey);
  console.log("Generated JWE:", jwe); // Verify output

  return { jwe, salt: Array.from(salt) };
}

export async function decryptPrivateKey(encryptedPriv: {
  jwe: string;
  salt: number[];
}) {
  const password = await PasswordManager.getPassword();
  if (!password) {
    toast.error("Password retrieval failed. please try again");
    throw new Error("Password retrieval failed.");
  }

  const salt = new Uint8Array(encryptedPriv.salt);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"],
  );

  try {
    // Validate JWE format
    if (typeof encryptedPriv.jwe !== "string") {
      throw new Error("Invalid JWE format");
    }

    const { plaintext } = await jose.compactDecrypt(
      encryptedPriv.jwe,
      derivedKey,
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch (e) {
    console.error("Decryption failed:", e);
    throw e;
  }
}
