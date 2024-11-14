
# Grafana Faro Integration Guide

This guide will help you set up monitoring and logging for your systems using Grafana Faro. This documentation is divided into four main sections: 
1. [**SET UP**](#1-setup)

2. [**ARCHITECTURE OF LOGGING AND MONITORING**](#2-architecture-of-logging-and-monitoring) 

3. [**PACKAGES USED**](#3-packages-used)

4. [**FURTHER CUSTOMIZATIONS**](#4-further-customizations)
---

## 1. SETUP

Follow these steps to set up Grafana Alloy and Grafana Cloud for monitoring.

### Step 1: Access Grafana
1. Visit [Grafana's website](https://grafana.com/).
2. Sign up using your preferred method (Email, Google, or GitHub).

### Step 2: Create a Grafana Cloud Account
1. Upon logging in, create a Grafana Cloud account and name the Grafana stack offered in the free trial.
2. Accept the default URL or customize it. This URL will serve as your monitoring domain.

### Step 3: Configure Monitoring Platform
1. Select the platform you want to monitor (e.g., Linux for Ubuntu).

### Step 4: Run Grafana Alloy
1. Install the Grafana Alloy agent on your machine by following Grafana’s installation instructions.

### Step 5: Generate an API Token
1. Create a new API token to authenticate data from the Alloy agent.
2. Name your token for easy reference.

### Step 6: Install and Verify Connection
1. Run the provided installation commands in your terminal.
2. Verify the connection in Grafana to ensure the agent is successfully sending data.

For a step-by-step walkthrough of this setup, visit the [Scribe Guide](https://scribehow.com/shared/Creating_an_Account_and_Setting_Up_Grafana_Alloy__9EpUweIMRDyyjbSSgOKYCw).

---

## 2. ARCHITECTURE OF LOGGING AND MONITORING

The architecture of logging and monitoring involves the interaction between Grafana Faro, Grafana Alloy, and Grafana Cloud. Grafana Faro collects logs and metrics directly from your application using embedded JavaScript functions, then pushes this data to Grafana Cloud via the Grafana Alloy agent.

### Diagram of Architecture
                    +---------------+                     +-----------------+
                    |  Your App     |                     | Grafana Cloud   |
                    |  (Frontend)   | ------------------> | (Monitoring &   |
                    |  Logs & Events|      Push Data      | Logging Platform|
                    +---------------+                     +-----------------+
                       |
                       |
                    +-------------+
                    | Grafana Faro|
                    | Plugin      |
                    +-------------+
                        |
                        |
                    +-------------+
                    | Grafana Alloy|
                    | Agent        |
                    +-------------+


1. **Application Logging**: The Faro plugin within your application captures logs and events (e.g., `pushLog`, `pushEvent`).
2. **Data Transfer**: Grafana Alloy agent acts as a bridge to securely transfer logs and events from your app to Grafana Cloud.
3. **Cloud Monitoring**: In Grafana Cloud, you can view and analyze the logs and events, set alerts, and generate insights.

---

## 3. PACKAGES USED

Grafana Faro uses the following npm packages for integration into your application:

- **@grafana/faro-web-sdk**: Provides the Faro API for logging, metrics collection, and sending monitoring data.
- **@grafana/faro-react**: faro addon to react providing more versatility when dealing with react frontend applications.
- **@grafana/faro-rollup-plugin**: faro plugin for initialization libraries for frontend applications such as vite and rollup, used to view source maps of your code on grafana cloud.

The use of these packages is covered in the [Scribe Guide](https://scribehow.com/shared/Creating_an_Account_and_Setting_Up_Grafana_Alloy__9EpUweIMRDyyjbSSgOKYCw), which shows you a guide to how Grafana provides instructions on how to use them in your code base.

Install these packages via npm:
```bash
npm install --save-dev @grafana/faro-web-sdk @grafana/faro-react @grafana/faro-rollup-plugin
```

These packages together enable comprehensive monitoring, data transfer, and analysis capabilities for frontend applications using Grafana Cloud.

---

## 4. FURTHER CUSTOMIZATIONS

Grafana Faro’s API provides functions to log specific events or push customized logs as your application runs. Below are some code snippets for using these functions.

### Custom Log Example
```javascript
faro.api.pushLog(`Search result for ${searchTerm} found ${response.data.length} games.`, {
  level: LogLevel.INFO,
  context: {
    searchTerm: "searchTerm",
    results: "Result",
    userId: "userID"
  }
});
```

### Custom Event Example
```javascript
faro.api.pushEvent({
  name: 'UserSignIn',
  details: {
    userId: 'userID',
    timestamp: new Date().toISOString(),
  },
});
```

### Custom Error Forwarding
Usually used in try-catch blocks when the result is important and should be pushed to grafana.
```javascript
catch(error) {
faro.api.pushError(error as Error);
}
```
---
These functions allow you to control the granularity and frequency of logging, making it easy to capture significant actions and specific errors or warnings in real-time.

---
---