# Analytics & Monitoring Setup Guide

**Project:** StellarGoal  
**Purpose:** Enable production monitoring and analytics for Level 4 submission

---

## 🎯 Overview

This guide walks through setting up analytics and monitoring for StellarGoal to meet Level 4 requirements.

**Required**:
- ✅ Vercel Analytics (Basic - Free)

**Optional but Recommended**:
- Sentry Error Tracking (Free tier)
- Google Analytics 4 (Free)

---

## 📊 Vercel Analytics (REQUIRED)

### Why Vercel Analytics?
- **Free**: Included with Vercel deployment
- **Easy**: One-click enable, no code changes
- **Privacy-focused**: GDPR compliant
- **Real-time**: Instant visitor tracking
- **Performance**: Web Vitals monitoring

### Setup Steps

#### Step 1: Enable Analytics
1. Go to: https://vercel.com/vedang24-hashs-projects/stellargoal
2. Click on **"Analytics"** tab in the top navigation
3. Click **"Enable Analytics"** button
4. Confirm the selection
5. Done! ✅

#### Step 2: Wait for Data Collection
- **Initial Wait**: 24-48 hours for meaningful data
- **Minimum**: At least a few visits before screenshot
- **Best**: Wait until you have 10+ users testing

#### Step 3: Take Screenshot
After data collection:
1. Return to Analytics tab
2. Capture screenshot showing:
   - **Visitors**: Total unique visitors
   - **Page Views**: Total page views
   - **Top Pages**: Most visited pages
   - **Devices**: Desktop vs Mobile breakdown
   - **Countries**: Visitor locations (optional)
   - **Web Vitals**: Performance scores

#### Step 4: Save Screenshot
- **Filename**: `vercel-analytics-dashboard.png`
- **Location**: `/screenshots/monitoring/`
- **Format**: PNG, high quality
- **Annotation**: Add date/time if desired

### What to Show in Screenshot

**Minimum Requirements**:
- Total visitors count
- Total page views
- Top 3-5 pages
- Date range visible

**Nice to Have**:
- Device breakdown (mobile vs desktop)
- Geographic distribution
- Performance metrics
- Realtime visitors

---

## 🐛 Sentry Error Tracking (OPTIONAL)

### Why Sentry?
- **Error Monitoring**: Track JavaScript errors
- **Performance**: Monitor slow transactions
- **Release Tracking**: Track errors by version
- **Alerts**: Get notified of issues
- **Free Tier**: 5,000 events/month

### Setup Steps

#### Step 1: Sign Up
1. Go to: https://sentry.io/signup/
2. Create free account
3. Select **"React"** as platform

#### Step 2: Install SDK
```bash
cd frontend
npm install --save @sentry/react
```

#### Step 3: Initialize Sentry

Add to `frontend/src/main.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import './App.css';

// Initialize Sentry
Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE", // Get from Sentry dashboard
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% on errors
  
  // Environment
  environment: import.meta.env.MODE, // 'development' or 'production'
  
  // Release tracking
  release: "stellargoal@1.0.0",
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### Step 4: Add Error Boundary (Optional)

Wrap App with Sentry ErrorBoundary:

```javascript
import { ErrorBoundary } from "@sentry/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<p>An error occurred. Please refresh the page.</p>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
```

#### Step 5: Test Error Tracking

Add a test button somewhere:

```javascript
<button onClick={() => {
  throw new Error("Test Sentry Error");
}}>
  Test Error
</button>
```

Click it, then check Sentry dashboard for the error!

#### Step 6: Deploy

```bash
git add .
git commit -m "feat: add Sentry error tracking"
git push origin master
```

#### Step 7: Screenshot

After deployment and some usage:
1. Go to Sentry dashboard
2. Navigate to **"Issues"** page
3. Take screenshot showing:
   - Issue list (or "No issues" if clean!)
   - Project setup confirmation
   - Performance metrics
4. Save as: `screenshots/monitoring/sentry-dashboard.png`

---

## 📈 Google Analytics 4 (OPTIONAL)

### Why GA4?
- **Detailed Analytics**: User behavior tracking
- **Free**: Forever free tier
- **Industry Standard**: Widely recognized
- **Custom Events**: Track specific actions

### Setup Steps

#### Step 1: Create GA4 Property
1. Go to: https://analytics.google.com
2. Create account (if needed)
3. Create GA4 property
4. Get Measurement ID (G-XXXXXXXXXX)

#### Step 2: Install gtag

Add to `frontend/index.html` in `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Step 3: Track Custom Events

In components, track user actions:

```javascript
// Track goal creation
gtag('event', 'create_goal', {
  'event_category': 'engagement',
  'event_label': goalTitle,
  'value': targetAmount
});

// Track deposit
gtag('event', 'make_deposit', {
  'event_category': 'transaction',
  'event_label': goalId,
  'value': depositAmount
});
```

#### Step 4: Deploy & Wait
- Deploy changes
- Wait 24-48 hours
- Check GA4 dashboard

---

## 📸 Screenshot Requirements for Submission

### Must Have
1. **Vercel Analytics Dashboard** ✅ REQUIRED
   - Shows visitor count
   - Shows page views
   - Shows top pages
   - Clearly labeled and dated

### Nice to Have
2. **Sentry Dashboard** (if implemented)
3. **Google Analytics** (if implemented)
4. **Vercel Deployment Logs** (showing successful deployments)
5. **Performance Metrics** (Lighthouse scores)

---

## 🔍 Verification Checklist

Before taking screenshot:

Analytics Tab:
- [ ] Vercel Analytics enabled
- [ ] Data showing (10+ visitors ideal)
- [ ] Multiple pages tracked
- [ ] Date range visible
- [ ] Device breakdown available

Screenshot Quality:
- [ ] High resolution (1080p minimum)
- [ ] All important metrics visible
- [ ] Project name visible
- [ ] Date/time visible
- [ ] No sensitive data exposed

Documentation:
- [ ] Screenshot saved in correct folder
- [ ] Filename follows convention
- [ ] Added to submission checklist
- [ ] Mentioned in README if needed

---

## 📝 Analytics Interpretation

### Good Metrics (for submission):
- **Visitors**: 10+ unique visitors
- **Page Views**: 50+ page views
- **Engagement**: Multiple pages per visit
- **Performance**: Good Web Vitals scores

### What Judges Look For:
- ✅ Real usage data (not just developer testing)
- ✅ Analytics properly configured
- ✅ Multiple users interacting with app
- ✅ Production monitoring in place

---

## 🚀 Quick Start (Minimum for Submission)

**If short on time, do this:**

1. **Enable Vercel Analytics** (5 minutes)
   - One click in Vercel dashboard
   - No code changes needed

2. **Get Users to Test** (1-2 hours)
   - Share link with 10+ people
   - Ask them to browse the app
   - Wait for data to populate

3. **Take Screenshot** (2 minutes)
   - Open Analytics tab
   - Screenshot the dashboard
   - Save in `/screenshots/monitoring/`

4. **Done!** ✅

**Total Time**: ~2 hours (mostly waiting for users)

---

## 📚 Additional Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)
- [Web Vitals Guide](https://web.dev/vitals/)

---

## ✅ Completion Checklist

Before considering analytics setup complete:

- [ ] Vercel Analytics enabled
- [ ] At least 24 hours of data collected
- [ ] 10+ unique visitors recorded
- [ ] Screenshot taken and saved
- [ ] Screenshot shows meaningful data
- [ ] Screenshot added to submission folder
- [ ] Optional: Sentry setup (if time permits)
- [ ] Documentation updated

---

**Status**: Ready to enable - Vercel Analytics is the priority!

**Next Steps**:
1. Enable Vercel Analytics NOW
2. Share app with users to generate traffic
3. Wait 24-48 hours
4. Screenshot and submit
