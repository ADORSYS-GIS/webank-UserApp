## Webank Digital-Wallet Analytics Documentation

This document defines all key metrics, events, and use-case scenarios to track in the Webank digital-wallet app using Google Analytics 4 (GA4). It is organized into major categories, detailing **what** to track, **why** it matters, and **how** to implement each metric.

---

### Table of Contents

1. [Overview of GA4 Tracking](#overview)
2. [Engagement & Page Metrics](#engagement)
3. [Feature Usage Metrics](#features)
4. [Transaction & Financial Metrics](#transactions)
5. [Funnel & Onboarding Metrics](#onboarding)
6. [Retention & Cohort Analysis](#retention)
7. [Performance & Error Tracking](#performance)
9. [Real-Time Monitoring](#realtime)
10. [Use-Case Scenarios](#use-cases)

---

<a id="overview"></a>

## 1. Overview of GA4 Tracking

GA4 provides a fully managed analytics backend. You implement tracking by installing the `gtag.js` snippet or Firebase SDK and defining events (built-in, recommended, or custom). No self-hosting required.

**Implementation**:

* Add `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>` in `<head>`
* Initialize with `gtag('config', 'G-XXXXXXX');`
* Send custom events via `gtag('event', 'event_name', { ...params });`

---

<a id="engagement"></a>

## 2. Engagement & Page Metrics

### What to Track

* **Page/Screens Viewed** (`page_view`, `screen_view`)
* **Average Time on Page** (`engagement_time_msec`)
* **Sessions & Session Duration**
* **Engagement Rate** (based on ≥10s, ≥2 screen views)

### Why It Matters

Measures overall stickiness and content engagement. Identifies popular screens and pages needing optimization.

### How to Implement

GA4 auto-tracks `page_view`/`screen_view`. For timing, no extra code needed; GA4 captures `engagement_time_msec` automatically.

---

<a id="features"></a>

## 3. Feature Usage Metrics

### What to Track

* **Top-Up Initiated** (`add_payment_info`)
* **Top-Up Completed** (`purchase` with param `value`)
* **Peer-to-Peer Transfer** (`wallet_transfer` - custom)
* **Bill Payment** (`begin_checkout`)
* **Balance Check** (`view_item` with param `item_id = 'balance'`)

### Why It Matters

Reveals adoption and frequency of core wallet features. Guides prioritization and UX improvements.

### How to Implement

* Use GA4 recommended ecommerce events (e.g., `add_payment_info`, `begin_checkout`).
* Create custom events for wallet-specific actions:

  ```js
  gtag('event', 'wallet_transfer', {
    transfer_amount: 100,
    currency: 'XAF'
  });
  ```

---

<a id="transactions"></a>

## 4. Transaction & Financial Metrics

### What to Track

* **Transaction Count** (`purchase`)
* **Transaction Value** (`value` parameter)
* **Success vs. Failure** (`transaction_success`, `transaction_failed`)
* **Abandonment Rate** (compare `begin_checkout` to `purchase`)

### Why It Matters

Captures core revenue metrics and reliability. Indicates payment system health.

### How to Implement

* Use `purchase` event with `transaction_id`, `value`, `currency`.
* Fire `transaction_failed` custom event on error:

  ```js
  gtag('event', 'transaction_failed', {
    error_code: 'TIMEOUT',
    flow: 'top_up'
  });
  ```

---

<a id="onboarding"></a>

## 5. Funnel & Onboarding Metrics

### What to Track

* **Sign-Up Start & Complete** (`sign_up`)
* **Tutorial Begin & Complete** (`tutorial_begin`, `tutorial_complete`)
* **KYC Steps** (`kyc_document_uploaded`, `kyc_verified`)
* **Form Engagement** (auto via enhanced measurement)

### Why It Matters

Identifies drop-offs in critical user-activation flows. Optimizes conversion rates.

### How to Implement

* Track `sign_up` event at form submission.
* Use enhanced measurement for form interactions.
* Send custom KYC step events:

  ```js
  gtag('event', 'kyc_document_uploaded', {});
  gtag('event', 'kyc_verified', {});
  ```

---

<a id="retention"></a>

## 6. Retention & Cohort Analysis

### What to Track

* **Cohort Retention Rates** (Day 1, 7, 30)
* **Churn Rate** (users inactive after N days)
* **Repeat Transaction Rate**

### Why It Matters

Measures long-term engagement and product-market fit. Cohorts expose impact of changes/releases.

### How to Implement

Use GA4’s Retention report and Cohort Analysis in Explorations. Define cohorts by first event (e.g., `first_open`).

---

<a id="performance"></a>

## 7. Performance & Error Tracking

### What to Track

* **Failed-Transaction Events** (`transaction_failed`)
* **App Crashes** (via Firebase Crashlytics integration)
* **Screen Load Times** (`screen_load_time_msec` parameter)

### Why It Matters

Ensures reliability and performance. Tracks regressions after releases.

### How to Implement

* Fire custom events for failures.
* Integrate Crashlytics for crash reporting.
* GA4 auto-captures basic timing metrics; supplement with user timings if needed.

---

<a id="custom"></a>


<a id="realtime"></a>

## 9. Real-Time Monitoring

### What to Track

* **Active Users Right Now**
* **Real-Time Events** (`page_view`, `purchase`)

### Why It Matters

Monitors live campaigns or incidents. Validates deployments immediately.

### How to Implement

View the Realtime report in GA4—no extra code needed.

---

<a id="use-cases"></a>

## 10. Use-Case Scenarios

### A. New Campaign Launch

* **Goal**: Acquire 1,000 new users.
* **Track**: `sign_up`, `tutorial_complete`, `add_payment_info`, `purchase`.
* **Insight**: If 80% complete tutorial but only 50% top-up, optimize funding flow.

### B. Feature Adoption Push

* **Goal**: Increase P2P transfers by 30%.
* **Track**: `wallet_transfer`, `transfer_amount`, `transaction_success`.
* **Insight**: If success rate drops below 90%, investigate API reliability.

### C. Performance Regression

* **Goal**: Ensure new UI doesn’t degrade speed.
* **Track**: `screen_load_time_msec`, `transaction_failed`, Crashlytics.
* **Insight**: Identify screens with >2s load times; optimize assets.

---

*All events can be viewed and analyzed in the GA4 interface under Realtime, Reports, and Explorations. Use BigQuery export for advanced analysis and integration with internal BI tools.*
