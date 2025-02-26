# Offline Withdrawal Architecture

## Overview

This document outlines the architecture and flow for the **Offline Withdrawal Functionality** involving the **Client**, **Agent**, **Online Banking Serviice (OBS)**,  and the **Webank BankAccount(DAS)**. The architecture facilitates secure transaction verification using digital signatures, ensuring both client and agent authenticity via the use of **Account Certificates** (accountCert).


## Components

### 1. **Client (Offline)**
   - The client initiates the process by entering the withdrawal amount and generating a QR code containing:
     - Client's Account ID
     - Withdrawal Amount
     - Client's Account Certificate 
  - This  data structure is then used to generate the QR code containing:
    -  The signed data structure with the Account ID, Amount, and Certificate.

### 2. **Agent**
   - The agent scans the client's QR code to extract:
     - Account ID
     - Withdrawal Amount
     - Client's Account Certificate
   - Sends a request to the OBS system, including:
     - Agent's Account ID
     - Agent Account Certificate 
     - Client's Account ID
     - Withdrawal Amount
     - Signed Data Structure(JWT)

### 3. **Online Banking System (OBS)**
   - Verifies the JWT and Agent Account Certificate:
     - Validates the JWT signature and integrity.
     - Verifies the Agent Account Certificate's validity and signature.
   - Extracts and verifies the Client's Account Certificate:
     - Ensures the integrity and authenticity of the signed data structure.
   - If the verification succeeds, the request is forwarded to the Digital Account System (DAS).

### 4. **Digital Account System (DAS)**
   - Verifies the Client's Account Certificate and Account ID:
     - Checks the authenticity and validity of the Client's Account Certificate.
     - Extracts and hashes the Client's Account ID from the signed data structure and certificate.
   - Compares the hashed Account ID:
     - If they match, the withdrawal transaction is executed.
     - If they don’t match, the transaction is rejected.

## Flow Diagram

| Step                          | Action                                                                                                                                         | Systems Involved   |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| **1. Client Initiates Withdrawal** | Client enters withdrawal amount and generates QR code containing Account ID, Amount, and Account Certificate.                                      | Client              |
| **2. Agent Scans QR Code**       | Agent scans QR code to extract Account ID, Amount, and Client's Account Certificate.                                                             | Agent               |
| **3. Agent Sends Request**       | Agent sends request to OBS, including Agent Account ID , Client AccountID , Amount,  Agent's Account Certificate, and signed data structure.                   | Agent, OBS          |
| **4. OBS Verifies JWT and Certificates** | OBS verifies the JWT, checks the integrity of the Agent's Account Certificate, and validates the Client's Account Certificate.                      | OBS                 |
| **5. Request Forwarded to DAS**  | If verification is successful, OBS forwards the request along with signed data to DAS.                                                            | OBS, DAS            |
| **6. DAS Verifies Client Data**  | DAS extracts and verifies the Client's Account Certificate and compares the hashed Account ID.                                                    | DAS                 |
| **7. Transaction Execution**     | If hash verification matches, DAS executes the withdrawal. Otherwise, the transaction is rejected.                                                | DAS                 |
| **8. Confirmation**              | DAS confirms transaction execution success or rejection based on hash validation.                                                                | DAS, Agent          |




## Conclusion

- The Offline Withdrawal functionality ensures a secure and reliable transaction process by incorporating digital certificates and JWTs for authentication and verification. The architecture leverages multiple systems—Client, Agent, **Online Banking System (OBS)**, and **Digital Account System (DAS)**—to authenticate both the client and agent, verify transaction integrity, and process withdrawals securely. The flow is designed to prevent fraud and unauthorized access by validating the signed data structures at each step, ensuring the transaction is legitimate and executed only when all conditions are met.

This architecture is scalable, allowing for future integration with other transaction types and systems, enhancing the security and extensibility of the platform.


The approach is designed to be scalable and extensible, allowing future enhancements to support additional transaction types and integration with other systems.

## High-Level Sequence Diagram

Below is the sequence diagram illustrating the flow of the offline withdrawal functionality:


```mermaid
sequenceDiagram
    participant C as Client (Offline)
    participant A as Agent
    participant OBS as OBS (Online Banking System)
    participant DAS as DAS (Digital Account System)

    %% Client Step: Generating QR Code
    C->>C: Enter Withdrawal Amount
    C->>C: Generate QR Code with (Account ID, Amount, Account Cert)
    Note over C: QR Code Contains:
    Note over C: - Client Account ID
    Note over C: - Withdrawal Amount
    Note over C: - Client's Account Cert (Signed Data Structure)

    %% Agent Step: Scanning the QR Code
    A->>C: Scan QR Code
    Note over A: Extracts:
    Note over A: - Account ID
    Note over A: - Withdrawal Amount
    Note over A: - Account Cert (Client's Account Cert)

    %% Agent Sends Request to OBS
    A->>OBS: Send Request to OBS
    Note over A: Request Contains:
    Note over A: - Agent Account ID
    Note over A: - JWT with Agent Account Cert in Header
    Note over A: - Signed Data Structure (Client's Account Cert) in Header

    %% OBS: Verifying JWT and Agent Account Cert
    OBS->>OBS: Verify JWT (Request Authentication)
    OBS->>OBS: Verify JWT Signature (Check Integrity)
    OBS->>OBS: Extract Agent Account Cert from JWT Header
    OBS->>OBS: Verify Agent Account Cert (Check Validity and Signature)

    %% OBS: Verifying Signed Data Structure
    OBS->>OBS: Extract Signed Data Structure from JWT Header
    OBS->>OBS: Verify Signed Data Structure (Check Integrity and Authenticity)
    OBS->>OBS: Verify Client Account Cert in Signed Data Structure

    alt JWT and Agent Cert Verification Success
        OBS->>OBS: Forward Request to DAS
        OBS->>DAS: Forward Request with:
        OBS->>DAS: - Signed Data Structure (Client's Account Cert)
        OBS->>DAS: - Agent Account ID
        Note over OBS: Forwards Signed Data Structure and Agent Account ID to DAS
    else JWT or Agent Cert Verification Fail
        OBS->>A: Reject Request (Invalid JWT or Agent Cert)
        Note over OBS: Invalid JWT or Agent Cert - Reject the request
    end

    %% DAS: Verifying Client Account Cert and Hash
    DAS->>DAS: Extract Client Account Cert from Signed Data Structure
    DAS->>DAS: Verify Client Account Cert (Check Authenticity and Validity)
    DAS->>DAS: Extract Client Account ID from Signed Data Structure

    %% DAS: Hashing Client Account ID and Verifying Hash Match
    DAS->>DAS: Hash Client Account ID (Extracted from Signed Data Structure)
    DAS->>DAS: Hash Client Account ID (Extracted from Client Account Cert)
    DAS->>DAS: Compare Hashed Client Account ID (Extracted vs. Hashed from Cert)

    alt Hashes Match
        DAS->>DAS: Execute Withdrawal Transaction
        DAS->>A: Confirm Transaction Execution (Success)
        Note over DAS: Transaction Executed - Amount Withdrawn from Client Account
    else Hashes Don't Match
        DAS->>A: Reject Transaction (Hash Mismatch)
        Note over DAS: Hash Mismatch - Transaction Rejected
    end
  ```