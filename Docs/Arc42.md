**Webank UserApp - Frontend Architecture (arc42)**

**1. Introduction and Goals**

* **1.1 Scope** 
    * This document describes the architecture of the Webank UserApp frontend, a mobile-first React-based web application that allows users to manage their bank accounts. 
    * The scope is limited to the client-side components, their interactions, and communication with the backend API.
    * It explicitly excludes the backend architecture, database design, and server-side infrastructure.

* **1.2 Goals and Constraints**
    * **Goals:**
        * Provide a secure and user-friendly interface for Webank customers on various devices.
        * Implement efficient state management for a smooth user experience.
        * Ensure a maintainable and scalable codebase.
    * **Constraints:**
        * Compatibility with modern web browsers (Chrome, Firefox, Safari, Edge).
        * Target page load time of under 3 seconds.
        * Reliance on a well-defined backend API for data and functionality.

* **1.3 Stakeholders**
    * **Frontend Developers:** Responsible for designing, implementing, and maintaining the user interface.
    * **UX/UI Designers:**  Contribute to the visual design and user experience.
    * **Testers:** Ensure the quality, functionality, and cross-browser compatibility of the frontend.
    * **Users:** Webank customers who will use the application.

**2. Architecture Constraints**

* **2.1 Technology Stack**
    * ReactJS (v18.x): Component-based UI framework for building a dynamic and interactive interface.
    * TypeScript:  Static typing for enhanced code quality, maintainability, and early error detection.
    * Tailwind CSS:  Utility-first CSS framework for rapid UI development and responsive design.
    * React Router (v6.x): Declarative routing for navigation within the single-page application.
    * Axios: Promise-based HTTP client for making API requests to the backend.
    * Redux:  State management library for predictable state updates and a single source of truth.


**3. Context and Scope**

* **3.1 Business Context**
    * The Webank UserApp frontend provides customers with a convenient way to access and manage their bank accounts online.  
    *  (Include specific features: e.g., view balances, transaction history, transfers, bill pay, etc.)

* **3.2 Technical Context**
    * **Frontend Responsibilities:**
        *  Rendering the user interface based on data received from the backend API.
        *  Handling user interactions (clicks, form submissions, etc.).
        *  Managing application state and data flow.
        *  Making API requests to the backend to retrieve and update data.
        *  Ensuring a secure and responsive user experience.
    * **Backend API (brief overview):**
        * The frontend relies on a RESTful API provided by the backend.
        *  The API provides endpoints for user authentication, account information, transactions, and other banking operations.
    * **Security Context (brief overview):**
        * The application relies on verifiable credentials to authenticate and authorize the device.
        * The user identity is secure with a bearer constrained JWT signed by the server and returned to the client application (verifiable credential).
        * Request authorization is performed by the mean of the client signing a proof of possesion (verifiable presentation) sent to the server with the request.

**4. Solution Strategy**

* **4.1 Architectural Decisions**
    * **Component-Based Architecture (ReactJS):** React's component model allows breaking down the UI into reusable and independent units. This promotes code organization, maintainability, and testability.
    * **Mobile-First Design:**  The UI is designed with a mobile-first approach to prioritize the user experience on smaller screens and ensure responsiveness across devices.
    * **Centralized State Management (Redux):** Redux provides a single source of truth for application state, making it easier to manage data flow, handle updates, and debug the application.
    * **Clear Separation of Concerns:** Components are designed with distinct responsibilities (presentation, data fetching, user interaction) to improve code organization and maintainability.
    * **Layered Design:** The application separates between a UI-Layer and a Service-Layer in the front-end. There is no static binding between the UI layer and the service layer. An event bus allow the Service-Layer to propagate responses back to the UI-Layer. 

**5. Building Block View**

* **5.1 Whitebox Overall System**

    (Include a diagram here showing the major frontend components and their interactions. Example: Authentication component, API service layer, UI components (Dashboard, Transactions, Profile), Redux store.)

* **5.2 Blackbox Building Blocks**
    * **Authentication Component:**
        * Handle storage of account credentials
        * Is fully stateless, no user session
        * Interacts with the backend authentication API endpoints (obtaining nonces)
        * Handles signature of requests to backend
    * **Dashboard Component:**
        * Displays the user's account overview (balance, recent transactions).
        * Provides navigation to other sections of the app.
        * Fetches account data from the backend API.
    * **Transactions Component:**
        * Allows users to view balanes, view transaction history, make transfers.
        * Interacts with the backend transaction API endpoints.
    * **Profile Component:**
        * Enables device to manage their profile information and settings.
        * Communicates with the backend device profile API.

**6. Runtime View**

* **6.1 Runtime Scenarios**

    * **Registration of New Account:**
        1. The device sent the phone number to the backend API
        2. The Registration component sends a signed creation request (including the phone number) to the backend API.
        3. The backend validate the phone number for uniqueness (anti spam component)
        4. The backend creates the bank account, signs a verifiable credential and sends it back to the device 
        5. The Registration component stores the credential and sends the user to the dashboard.

    * **Authentication:**
        1. The online banking application does not handle user login in the classical way
        2. The Authentication component sends a signed intent request to the backend API.
        3. The backend authenticates the intent request and return a nonce for liveness. For read operations, the backend might just return request information, depending on the configuered security policy.
        4. The Authentication component signs the intent request and sends it back to the backend.
        5. The backend validates and execute the request.

    * **Viewing Ballance:**
        1. The device navigates to the dashboard.
        2. The Balance component sends a request to the backend API to fetch the balance.
        3. The backend retrieves the balance from the database and return to the device.
        4. The Balance component renders the balance in the UI.

    * **Viewing Transactions:**
        1. The device navigates to the Transactions section.
        2. The Transactions component sends a request to the backend API to fetch the transaction history.
        3. The backend retrieves the transactions from the database.
        4. The Transactions component renders the transaction list in the UI.

    * **Updating Profile Information:**
        1. The device edits it's profile details.
        2. The Profile component sends an update request to the backend API.
        3. The backend updates the user's information in the database.
        4. The Profile component updates the UI to reflect the changes.

**7. Deployment View**

* **7.1 Deployment Model:**  
    * The frontend application is built and bundled into static assets (HTML, CSS, JavaScript).
    * These assets are deployed to a content delivery network (CDN) like AWS CloudFront or Azure CDN to ensure fast loading times for users.
    * The device loads the frontend application and installs it on the user machine as a Progressive Web Application.
* **7.1 Securing Device Cedentials:**
    * The device encrypt and store the generated cryptographic key material and associated verifiable credentials in trusted preferences of the device. Only this instance of the PWA shall ne able to read these information.
    * Further, the device will us passkey to authenticate the user locally on the devices, and use authenticated credential to retrieve a user seceret from the backen.  

**8. Cross-Cutting Concepts**

* **8.1 Error Handling**
    * **Frontend:**
        * React error boundaries are used to gracefully handle errors within components and prevent the entire application from crashing.
        * Axios interceptors are used to catch API errors and display user-friendly error messages.
        * Network errors are handled by displaying appropriate messages and providing options to retry requests.
    * **API Error Handling:**
        * The frontend handles errors returned by the backend API (e.g., 400 Bad Request, 404 Not Found) by displaying informative messages to the user.

* **8.2 State Management:**
    *  Redux is used as the central state management library.
    *  Components dispatch actions to update the Redux store, which triggers re-renders of the necessary parts of the UI.
    *  (Optional: Describe any patterns used with Redux, such as thunks or sagas, for handling asynchronous actions.)

* **8.3 Security**
    * The application relies on verifiable credentials to authenticate and authorize the device.
    * The user identity is secure with a bearer constrained JWT signed by the server and returned to the client application (verifiable credential).
    * Request authorization is performed by the mean of the client signing a proof of possesion (verifiable presentation) sent to the server with the request.
    *  Input validation is performed on forms to prevent malicious input.
    *  Sensitive data is stored encrypted in local storage.

**9. Design Decisions**

* **Choice of ReactJS:** React was chosen for its component-based architecture, virtual DOM for efficient updates, large community support, and strong ecosystem of libraries and tools.
* **TypeScript for Type Safety:** TypeScript helps improve code quality, maintainability, and reduces runtime errors by providing static typing.
* **Tailwind CSS for Styling:** Tailwind CSS provides a utility-first approach to styling, enabling rapid development and consistent design.
* **Verifiable Credentials (SD-JWT):** IS chosen for it ability to decentralized distribution of authnticated account information.

**10. Quality Requirements**

* **Performance:** Page load times, responsiveness, and efficient rendering are critical.
* **Usability:** The user interface should be intuitive, easy to navigate, and accessible.
* **Security:** Protecting user data and preventing security vulnerabilities is a top priority.
* **Maintainability:** The codebase should be well-structured, documented, and easy for developers to understand and modify.
* **Testability:**  Components and modules should be designed for easy unit and integration testing.

**11. Risks and Technical Debt**

* **State Management Complexity:** As the application grows, managing state with Redux can become complex. Consider strategies to mitigate this (e.g., careful planning of the store structure, using Redux Toolkit).
* **Keeping Dependencies Up-to-Date:**  Regularly updating dependencies is important for security and performance but can introduce breaking changes. A clear update strategy is needed.

**12. Glossary**

* **CDN:** Content Delivery Network.
* **JWT:** JSON Web Token.
* **SD-JWT:** Selective Disclosure JSON Web Token
* **Redux:** A predictable state container for JavaScript apps.
* **SPA:** Single-Page Application.
* **XSS:** Cross-Site Scripting.

