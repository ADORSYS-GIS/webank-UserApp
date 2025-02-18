
# Device Messaging Concept

Here we shall talk about the messaging concept for our webank application ecosystem. We will first delve into a more general overview of messaging between components and the paradigms through which it is possible, and then we will look at the particular paradigm and messaging architecture we deem fit for webank.

## Overview

In modern distributed systems and mobile applications, efficient communication between devices and servers is a critical aspect. There are different paradigms for how devices can retrieve messages or notifications from a server: **pull**, **push**, and **poll**. Understanding the differences between these paradigms and selecting the right one for the application can significantly impact performance, resource consumption, and user experience.

## Comparison of Messaging Paradigms

### 1. Pull Paradigm

**Explanation**:
In the **pull** paradigm, the device explicitly requests messages from the server. The device controls when it wants to fetch new messages by sending a request to a designated endpoint. The request can include information such as the date or identifier of the last message received, enabling the server to send only the new messages that the device has not yet seen.

**Analogy**:
Imagine you're checking your inbox. You open your email application and manually refresh it to see if you have any new messages. You control when to fetch new information, and you only get new emails, not the ones you already read.

**Examples**:
- A messaging app where the client requests new messages by sending a request with the timestamp of the last message it fetched.
- A news feed where the app retrieves the latest articles based on the last read article.

**Typical Applications**:
- **Email Clients**: Email clients like Gmail or Outlook might use a pull model, where the client periodically checks for new messages.
- **Social Media Feeds**: In some social networks, the client fetches new posts when a user manually refreshes the feed.

---

### 2. Push Paradigm

**Explanation**:
In the **push** paradigm, the server sends messages to the device without the device having to request them. The server pushes notifications or updates to the device, typically in real-time, using a mechanism like Web Push or Firebase Cloud Messaging (FCM). The device needs to have an active connection and be subscribed to receive updates.

**Analogy**:
Think of this like a doorbell. Instead of checking if someone is at the door, the bell rings, and you are instantly notified when someone arrives.

**Examples**:
- Mobile apps sending push notifications about new messages or alerts.
- Social media apps notifying users about likes, comments, or messages without them checking manually.

**Typical Applications**:
- **Push Notifications**: Used for real-time alerts such as news updates, weather notifications, or chat messages.
- **Real-time Messaging Apps**: Apps like WhatsApp and Telegram use push notifications to alert users of new messages.

---

### 3. Poll Paradigm

**Explanation**:
In the **poll** paradigm, the device repeatedly requests new messages at a fixed interval. It periodically checks the server to see if there are any updates, even if no new messages have been generated. The polling interval can be short (real-time) or long (low-frequency), depending on the use case.

**Analogy**:
Imagine checking for updates on your favorite website by manually refreshing the page every minute, regardless of whether there’s new content or not.

**Examples**:
- A client querying the server every minute to check for updates.
- Periodic status checks from a monitoring system, where the client continuously polls to retrieve information.

**Typical Applications**:
- **Monitoring Systems**: Systems that check the status of a service or resource at regular intervals (e.g., server health checks).
- **Online Gaming**: Where a game client checks the server periodically for new events or updates.

---

## Key Differences Between Pull, Push, and Poll Paradigms

| **Feature**             | **Pull**                            | **Push**                          | **Poll**                             |
|-------------------------|-------------------------------------|-----------------------------------|--------------------------------------|
| **Initiator**           | Device requests messages.          | Server sends messages to device. | Device checks for messages at intervals. |
| **Control**             | Device controls when to fetch messages. | Server decides when to send messages. | Device controls the frequency of checks. |
| **Real-time**           | Not inherently real-time (depends on request frequency). | Real-time notifications.         | Not inherently real-time, depends on polling frequency. |
| **Efficiency**          | More efficient, as data is fetched only when needed. | Less efficient, as the device remains idle until the message arrives. | Can be inefficient, as the server might be queried for updates even if there are none. |
| **Use Cases**           | Email clients, social media feeds. | Messaging apps, alert systems.    | Monitoring systems, periodic checks. |
| **Scalability**         | Scalable, as clients fetch messages on demand. | Can overwhelm server resources if many clients receive notifications simultaneously. | Can overwhelm server if polling frequency is too high. |
| **User Experience**     | Offers control to users.           | Provides immediate notifications, even when the app is closed. | Delayed notifications if polling interval is long. |

---

## Webank messaging architecture

### Proposed Paradigm: Pull

#### Rationale for Pull Paradigm

Given the need for devices to explicitly request messages and the importance of controlling when the device receives updates, the **pull** paradigm is the most suitable approach for our product. The pull model offers several benefits:

- **Control**: Devices have more control over when they fetch messages, making it easier to manage load and network traffic.
- **Efficiency**: The server will only send data when requested, reducing unnecessary server-side computations and bandwidth usage.
- **Scalability**: Pull allows the system to scale better by enabling devices to independently request messages instead of pushing updates to many devices simultaneously.

#### Implementation Considerations

1. **Message Storage**:
   Messages should be stored in a database, linked to the `deviceId` of the associated device, to ensure that only relevant messages are returned. A well-structured database schema will help optimize the retrieval of messages for specific devices.

2. **Endpoints**:
   Secure and protected endpoints will be required for each device to fetch new messages. These endpoints will use the `deviceId` to ensure that only the relevant messages for that device are sent in the response.

3. **Efficient Message Fetching**:
   Devices will send requests including the timestamp or ID of the last message they fetched. The server will then return only messages that were sent after the specified timestamp, reducing unnecessary data transfer.

4. **Rate Limiting**:
   To avoid overwhelming the server, rate limiting should be implemented to control how often a device can request messages. A sensible rate limit ensures that devices can fetch messages without causing strain on the server.

5. **Security**:
   Authentication and authorization mechanisms should be in place to ensure that each device can only access messages associated with its own `deviceId`. This will involve token-based authentication (e.g., JWT) to verify that the device is authorized to fetch messages.

### Messaging architecture

#### Defining the deviceId and the message holder
1. The perfect data to act as our `deviceId` in webank is the **`devicePublicKey`** which is generated at a very early stage in the registration process. It fits this bill perfectly because
it is unique to a particular device.
2. The module that is best suited for message handling is the **`OBS`**, the **`webank Online Banking Service`**. It fits this bill awesomely because it is, the central backend module, so to speak, as request destined to most modules have to pass through it first and it is the one in direct contact with the frontend outisde of initial the registration process.

#### Proposed flow of messages
1. At the end of every device registration, when a user device's public key is successfully registered in our backend, the **`OBS`** stores an initial message for the account associated with this particular public key that says something generic like "Thank you for registering." This is the table where it will be storing messages pertaining to the account associated to this particular public key henceforth.

2. The **`OBS`** also exposes an end point where it will deliver these messages to whichever requester comes with the necessary credentials to request them (possibly **`accountId`** or maybe even the **`devicePublicKey`** itself).

3. At every key event of our choosing that the account associated with this public key performs at the frontend (un/successfully registering his phone number, un/successfully completing his account registration, and un/successfully carrying out a transaction), we store messages for this account and we progrma the client to fetch these messages with appropritely authenticated requests

4. To get these messages the account(client) sends a request to the server to fetch new messages, including the **`devicePublicKey`** or **`accountId`** and the **`timestamp`** of the last message it received.

5. The server queries the database for messages with timestamps later than the provided timestamp.

6. The server responds with the new messages, if any, which are then displayed to the device.
