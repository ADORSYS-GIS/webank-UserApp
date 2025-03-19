# WebAuthn PRF Example

A lightweight TypeScript library that implements WebAuthn with PRF (Pseudo-Random Function) for secure authentication and encryption. This package allows users to register, authenticate, and encrypt/decrypt messages using derived keys.

## Installation

Install the package using npm:

```bash
npm install @adorsys-gis/web-auth-prf
```

## Usage

### Register a User

To register a new user, call the `handleRegister` function:

```javascript
import { handleRegister } from "@adorsys-gis/web-auth-prf";

document.getElementById("registerBtn").addEventListener("click", async () => {
  await handleRegister();
});
```

### Authenticate a User

To authenticate an existing user, call the `handleAuthenticate` function:

```javascript
import { handleAuthenticate } from "@adorsys-gis/web-auth-prf";

document
  .getElementById("authenticateBtn")
  .addEventListener("click", async () => {
    await handleAuthenticate();
  });
```

### Save and Load Messages

To save and retrieve encrypted messages, use the `saveMessage` and `loadMessages` functions:

```javascript
import { saveMessage } from "@adorsys-gis/web-auth-prf";

document
  .getElementById("saveMessageBtn")
  .addEventListener("click", async () => {
    await saveMessage();
  });
```

### Logout

To log out and clear stored credentials and messages, use the `handleLogout` function:

```javascript
import { handleLogout } from "@adorsys-gis/web-auth-prf";

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await handleLogout();
});
```

## API

### `handleRegister()`

Registers a new user with WebAuthn and securely stores authentication credentials.

### `handleAuthenticate()`

Authenticates a registered user using WebAuthn credentials.

### `saveMessage()`

Encrypts and saves a message using the derived encryption key.

### `loadMessages()`

Loads and decrypts saved messages.

### `handleLogout()`

Clears stored credentials and messages, effectively logging out the user.

For more details, check out the official WebAuthn documentation: [MDN WebAuthn Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API).
