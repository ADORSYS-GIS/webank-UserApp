# WeBank App User Workflow Documentation

This document provides a comprehensive overview of the key user flows in the WeBank online banking application. Each section explains the steps from the user’s perspective and includes designated spaces for Screenshots to visually guide the user through the process.

---

## Table of Contents

- [WeBank App User Workflow Documentation](#webank-app-user-workflow-documentation)
  - [Table of Contents](#table-of-contents)
  - [User Registration](#user-registration)
    - [Workflow Steps](#workflow-steps)
  - [View Account Balance](#view-account-balance)
    - [Workflow Steps](#workflow-steps-1)
  - [Bank Transfer](#bank-transfer)
    - [Bank Transfer Flow](#bank-transfer-flow)
  - [Payment Process](#payment-process)
    - [Workflow Steps](#workflow-steps-2)
  - [View Transaction History](#view-transaction-history)
    - [Workflow Steps](#workflow-steps-3)
  - [Top-Up Process](#top-up-process)
    - [For Users](#for-users)
    - [For Agents](#for-agents)
  - [Withdrawal Process](#withdrawal-process)
    - [Workflow Steps](#workflow-steps-4)
  - [Withdrawal Process – Offline Mode](#withdrawal-process--offline-mode)

---

## User Registration

**User Story:**  
_As a user, I want to register for a bank account._

### Workflow Steps

1. **Download & Launch the App**  
   - Download the WeBank app from your app store.  
   - Launch the app.  
   ![Download & Launch App Screen](<../public/Screenshot from 2025-03-07 16-47-10.png>)

2. **Enter Registration Details**  
   - Enter your phone number to initiate the registration process.  
   ![Registration - Phone Number Entry Screen](<../public/Screenshot from 2025-03-07 16-47-32.png>)

3. **OTP Verification**  
   - Enter the OTP sent to your phone and click "Verify".  
   ![OTP Verification Screen](<../public/Screenshot from 2025-03-07 16-48-23.png>)

4. **Access Dashboard**  
   - After successful verification, you are redirected to the dashboard, confirming your registration.  
   ![Dashboard After Registration](<../public/Screenshot from 2025-03-07 16-48-51.png>)

---

## View Account Balance

**User Story:**  
_As a user, I want to see my account balance._

### Workflow Steps

1. **Navigate to Dashboard**  
   - Open the WeBank app to access your dashboard.  
   ![Dashboard Screen](<../public/Screenshot from 2025-03-07 16-48-51.png>)

2. **View Balance**  
   - Click the “View Balance” icon (Eye icon) to display your current balance.  

3. **Balance Display**  
   - Your account balance is shown on the screen.  
   ![Account Balance Display Screen](../public/image.png)

---

## Bank Transfer

**User Story:**  
_As a user, I want to make a bank transfer from one account to another._

### Bank Transfer Flow

0. **The Recipient Navigates to Dashboard**  
   - Open the WeBank app to access your dashboard.  
   ![Recipient Dashboard Screen](<../public/Screenshot from 2025-03-07 16-48-51.png>)

1. **Recipient Generates QR Code**  
   - The recipient creates a QR code containing their bank ID and shares it via messaging or displays it for scanning.  
   ![QR Code Generation by Recipient](../public/image-1.png)

2. **Scanning the QR Code**  
   - The sender scans the QR code, which redirects them to the transfer page.  
   ![QR Code Scanning by Sender](../public/image-6.png)

3. **Entering Transfer Amount**  
   - The sender inputs the amount to transfer and clicks "Continue".  
   ![Enter Transfer Amount Screen](../public/image-7.png)

4. **Confirming Transfer Details**  
   - A confirmation page appears showing the recipient’s account ID and the transfer amount.  
   - The sender reviews the details.  
   ![Transfer Details Confirmation Screen](../public/image-8.png)

5. **Completing the Transfer**  
   - The sender clicks "Confirm" to finalize the transaction.  
   - A success page displays the transferred amount, transaction ID, time, and payment method.  
   ![Transfer Success Screen](../public/image-9.png)

---

## Payment Process

**User Story:**  
_As a user, I want to pay money to a seller or vendor._

### Workflow Steps

0. **The Seller Navigates to Dashboard**  
   - Open the WeBank app to access your dashboard.  
   ![Seller Dashboard Screen](<../public/Screenshot from 2025-03-07 16-48-51.png>)

1. **Seller Displays QR Code**  
   - The seller taps “QR Code” to display their unique payment QR code (to be printed and displayed in their shop).  
   ![Seller QR Code Display Screen](<../public/Screenshot from 2025-03-07 16-48-51.png>)

2. **Initiate Payment**  
   - From the dashboard, the payer selects the "Pay" feature.  
   ![Payer Dashboard - Pay Feature](<../public/Screenshot from 2025-03-07 16-48-51.png>)

3. **Scan Seller’s QR Code**  
   - The app opens a scanner page for the payer to scan the seller's QR code.  
   ![Scan Seller QR Code Screen](../public/image-2.png)

4. **Enter Payment Amount**  
   - The payer inputs the amount and clicks "Confirm".  
   ![Enter Payment Amount Screen](../public/image-3.png)

5. **Payment Confirmation**  
   - A confirmation page appears showing the seller’s account ID and the transfer amount.  
   - The payer reviews the details.  
   ![Payment Confirmation Screen](../public/image-4.png)

6. **Completing the Payment**  
   - The payer clicks "Confirm" to finalize the transaction.  
   - A success page displays the transferred amount, transaction ID, time, and payment method.  
   ![Payment Success Screen](../public/image-5.png)

---

## View Transaction History

**User Story:**  
_As a user, I want to view my transaction history._

### Workflow Steps

1. **Access Transaction History**  
   - From your dashboard, click on the "View Transaction History" button.  
   ![Dashboard - Transaction History Button](<../public/Screenshot from 2025-03-07 16-48-51.png>)

2. **Display History**  
   - Your past transactions are listed on the screen.  
   ![Transaction History List Screen](../public/image-10.png)

---

## Top-Up Process

**User Guide:** *How to Add Money to Your WeBank Account*

### For Users

1. **Find an Agent**  
   - Locate a WeBank agent near you.  
   ![WeBank Agent Finder Screen](../public/image-13.png)

2. **Navigate to Top-Up**  
   - Open the WeBank app and tap the "Top-Up" button on your dashboard (as a client).  
   ![Client Dashboard with Top-Up Button](<../public/Screenshot from 2025-03-07 16-48-51.png>)

3. **Enter Top-Up Amount**  
   - Input the amount you wish to add to your account.  
   ![Top-Up Amount Entry Screen](../public/image-11.png)

4. **Proceed with Transaction**  
   - Tap "Continue" (or "Cancel" if you change your mind).  

5. **Display QR Code**  
   - The app generates a QR code that you can show to the agent or download for later use.  
   ![Top-Up QR Code Display Screen](../public/image-12.png)

6. **Confirmation & Balance Check**  
   - Hand over the cash to the agent.  
   - Once confirmed, return to the dashboard to verify your updated balance.

### For Agents

1. **Access Agent Services**  
   - Log in to the WeBank app and tap "Agent Services" from the side menu.  
   ![Agent Services Dashboard](../public/image-13.png)

2. **Select Cash In**  
   - Tap on the "Cash In" button.  
   ![Agent - Cash In Option](../public/image-14.png)

3. **Scan User’s QR Code**  
   - Use your device’s scanner or choose "Upload QR Code" to scan the user's QR code.  
   ![Agent - Scan User QR Code Screen](../public/image-15.png)

4. **Confirm Transaction Details**  
   - Verify the user’s account details and the top-up amount.  
   ![Agent - Confirm Top-Up Details Screen](../public/image-17.png)

5. **Finalize the Transaction**  
   - Click "Confirm" to complete the process, or "Cancel" if necessary.  
   - A success message is displayed and the updated balance is visible.  
   ![Agent - Transaction Success Screen](../public/image-16.png)

---

## Withdrawal Process

**User Story:**  
_As a user, I want to withdraw money from my account._

### Workflow Steps

1. **Initiate Withdrawal**  
   - The user meets a WeBank agent (in person or remotely via a communication channel that supports QR code ../public/images).  
   - Inform the agent of the withdrawal amount.  
   ![Client and Agent Interaction for Withdrawal](../public/image-13.png)

2. **Agent Accesses Payout Option**  
   - The agent logs into the WeBank portal and selects the "Payout" option from the sidebar.  
   ![Agent Payout Option Selection Screen](../public/image-14.png)

3. **Enter Withdrawal Amount**  
   - The agent enters the requested withdrawal amount on the amount page.  
   ![Enter Withdrawal Amount Screen (Online)](../public/image-23.png)

4. **Generate QR Code for Confirmation**  
   - A QR code is generated for the user to scan as authorization for the withdrawal.  
   ![Generated Withdrawal QR Code for Confirmation](../public/image-21.png)

5. **User Scans the QR Code**  
   - From the dashboard, the user taps the "Withdraw" button.  
   - The app displays a scanner awaiting the QR code.  
   ![User Scanning Withdrawal QR Code](../public/image-18.png)

6. **Review Transaction Details**  
   - After scanning, a summary of the transaction appears for the user to review.  
   ![Review Withdrawal Transaction Details Screen](../public/image-19.png)

7. **Confirm the Transaction**  
   - With an active internet connection, the user clicks "Confirm" to process the withdrawal.  
   - A success page confirms that the withdrawal was processed successfully.  
   ![Withdrawal Success Screen](../public/image-20.png)

---

## Withdrawal Process – Offline Mode

When the client is offline, the withdrawal process adapts to ensure that the transaction can still be securely authorized by an online agent. The following steps detail the offline withdrawal workflow:

0. **Handling Offline Withdrawals**  
   - If the user is offline, a pop-up notification appears explaining the connectivity issue and redirects the user to manually enter the withdrawal amount, generating an alternate QR code for authorization.  
   ![Offline Mode Notification Screen](../public/image-22.png)

1. **Redirect to Amount Page**  
   - Since the client is offline, they are redirected to an amount entry page.  
   - The client manually enters the amount they wish to withdraw and clicks "Confirm."  
   ![Offline Mode: Withdrawal Amount Entry Screen](../public/image-23.png)

2. **QR Code Generation for Offline Authorization**  
   - After confirming the amount, the app generates a QR code containing the necessary authorization details for the withdrawal.  
   ![Offline Mode: Generated QR Code for Authorization](../public/image-24.png)

3. **Handoff to the Online Agent**  
   - The client presents the generated QR code to the online agent.  
   - The agent then selects the "Scan instead" option within the WeBank portal.  
   ![Offline Mode: Handoff QR Code to Agent](../public/image-21.png)

4. **Agent Scanning Process**  
   - The agent is navigated to a dedicated "Scan QR Code" page.  
   - Here, they can either capture a live scan or upload the QR code ../public/image provided by the client.  
   - Once the QR code is captured, the agent clicks "Continue."  
   ![Agent Offline Mode: Scanning Client QR Code](../public/image-25.png)

5. **Transaction Confirmation**  
   - A confirmation page is displayed where the agent reviews the withdrawal details (amount, client information, etc.).  
   - If the details are correct, the agent clicks "Confirm" to authorize the transaction.  
   ![Agent Offline Mode: Confirm Transaction Details](../public/image-26.png)

6. **Completion and Success Notification**  
   - After the transaction is processed successfully, a success page is displayed.  
   - This page provides the transaction information, including the withdrawn amount, transaction ID, and time of the transaction.  
   ![Offline Mode: Transaction Success Screen](../public/image-28.png)
