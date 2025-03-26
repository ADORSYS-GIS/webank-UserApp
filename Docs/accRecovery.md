# Account Recovery Process for Webank

## Overview
The Webank account recovery process enables users who have lost their devices to reclaim their old accounts. The recovery process is embedded within the standard registration flow and leverages KYC verification.

## Step-by-Step Process

### 1. Initiating the Recovery
- Users who have lost access to their accounts must begin a **new registration** process as if they were signing up for a new account.
- There is no explicit "Recover My Account" button on the sign-up page.
- The option to recover an account appears during the **KYC verification step**.

### 2. Redirect to WhatsApp for Verification
- On the KYC page, users see a **"Recover Account"** button.
- Clicking this button redirects the user to WhatsApp using a **wa.link**, opening a chat with a Webank agent.
- A **predefined message** is automatically generated:  
  _"I want to recover a lost account via KYC."_
- The agent or bot, configured to expect this message, responds with detailed recovery instructions.

### 3. Required Information for Recovery
Users must provide the following via WhatsApp:
1. **Unique Document Identifier** linked to their previous account’s KYC documents.
2. **All necessary KYC documents**, ensuring they match the ones used in the previous KYC verification.
3. **The accountQR** of the newly created account.

### 4. Agent Verification
- The agent enters the **unique document identifier** into a dedicated UI.
- The backend queries the associated **documents and personal information**.
- The agent is redirected to a **comparison page** to match the retrieved records with the ones received via WhatsApp.
- If a match is confirmed, the agent proceeds to approve the recovery.

### 5. Approval & Token Generation
1. The agent clicks the **"Approve"** button.
2. They are prompted to upload the **accountQR** of the new account (sent by the user).
3. Upon uploading, a **"Generate Recovery Token"** button appears.
4. Clicking this button instructs the backend to create an **auth token** containing:
   - `OldAccountID`: The original account’s ID.
   - `NewAccountID`: The new account’s ID (ensuring only this account can reclaim the old one).
   - `Backend Signature`: A signature certifying the token's authenticity.
   - `Timestamp`: Ensuring token validity is time-bound.
5. The backend returns this auth token to the agent.
6. The agent copies and transmits the token to the user via WhatsApp.

### 6. User Validation of the Recovery Token
1. The user copies the **auth token** received from WhatsApp.
2. On the KYC page, clicking "Recover Account" again now reveals a **"Validate Recovery via Token"** button.
3. Clicking this button opens an input field to enter the **auth token**.
4. Upon submitting, the frontend sends the token to the backend.

### 7. Backend Response & Final Recovery Steps
- If the token is valid, the backend responds with:
  - `OldAccountID`: The recovered account’s ID.
  - `AccountCert`: A new account certificate bound to the old account ID and the user’s new public key.
  - `KYCCert`: A KYC certificate similarly updated with the new public key.
- The frontend updates the user’s session:
  - The **new account ID is replaced** with the old one.
  - The **new account cert and KYC cert** are overwritten with the ones returned.
- The user sees a **success message**: _"Account recovery successful! Redirecting to your old account’s dashboard... ENJOY!"_
- The system redirects the user to the recovered account's dashboard.

## Conclusion
This account recovery process ensures secure and seamless restoration of lost accounts while maintaining strict KYC compliance.
