# 📨 CleverTap React Native – Unified Inbox API Integration

## 📖 Use Case

Many apps today use an App Inbox to send persistent in-app messages — promotions, reminders, alerts, or updates that don’t disappear after being seen. However, standard App Inbox has limitations:

* ❌ Messages do NOT persist if the app is uninstalled
* ❌ No cross-device message syncing

# 📨 Introducing Unified Inbox

With CleverTap’s Unified Inbox, the answer is **YES** ✅: — messages persist across sessions, devices, and even after app reinstall. Unlike the traditional App Inbox, Unified Inbox:

* Stores messages on CleverTap servers
* Associates messages with the user’s identity
* Allows complete UI control via APIs

This repository demonstrates how to implement Unified Inbox in React Native using:

* ✅ CleverTap Unified Inbox & APIs
* ✅ Custom React Native FlatList UI
* ✅ Event tracking for Viewed and Clicked states

---

## 🔁 APIs Used

* getMessages API: https://developer.clevertap.com/docs/getmessages-api
* markMessagesAsRead API: https://developer.clevertap.com/docs/markmessagesasread-api
* markMessagesAsClicked API: https://developer.clevertap.com/docs/markmessagesasclicked-api

---

## 🚀 What This Project Implements

* CleverTap SDK integration
  * `User login`
  * `Event trackingt`
* App Inbox message retrieval using:
  * `(https://sk1.api.clevertap.com/1/inbox/getMessages API via Axios)`
* Storing messages client-side using state
* Custom rendering using FlatList
* Handling:
  * `Inbox message viewed`
  * `Inbox message clicked`
  * `Inbox message as read`
* Support of re-delivery of app-inbox messages across uninstall/reinstall by logging in with the same identity.

---

## 🧠 How Does the Message Persist After Reinstall?

CleverTap stores App Inbox messages **on their servers**, tied to a user’s unique identity.

When the user logs in with the same `identity` again after reinstalling the app:

* The SDK automatically re-associates the device with that identity.
* The app makes a REST API call to CleverTap to fetch inbox messages for that identity.
* No backend or server-to-server API integration is needed — this logic is purely SDK-driven.

---

## 📱 How to Use / Test This Project

### Step 1: Clone and Run

```bash
git clone https://github.com/rohkode/CTReactNative-RK.git
cd CTReactNative-RK
git checkout app-inbox-api-version
npm install
npx pod-install ios
npx react-native run-ios # or run-android
```

---

### Step 2: Set CleverTap Credentials

Update your credentials in:

* `App.tsx` → Initialization
* `index.js` → CleverTap config if required

Make sure your CleverTap dashboard is setup to send App Inbox messages to the relevant App ID.

---

### Step 3: Send App Inbox Message

Use the CleverTap dashboard:

1. Go to **Campaigns** → **+ Campaign** → **App Inbox**.
2. Create a campaign for a test user (with a specific `identity`).
3. Choose a category, title, content, etc.
4. Send the campaign.

---

### Step 4: Open Inbox in the App

Login with the same `identity` in the app (hardcoded or UI-based). Then navigate to the App Inbox screen.

You’ll see:

* Messages retrieved from the API
* Custom UI rendering messages
* Message title and content rendered in a FlatList
* Logs on view/click handlers

---

## 🔁 Reinstall & Verify Persistence

1. Uninstall the app.
2. Reinstall the app.
3. Login again with the same `identity`.
4. Inbox messages reappear ✅

---

## 📦 Code Highlights

### Initialize App Inbox

```tsx
useEffect(() => {
  CleverTap.initializeInbox();
}, []);
```

### Fetch Messages

```tsx
const response = await axios.post(
  'https://sk1.api.clevertap.com/1/inbox/getMessages',
  { userId: userIdentity },
  {
    headers: {
      'X-CleverTap-Account-Id': CT_ACCOUNT_ID,
      'X-CleverTap-Passcode': CT_PASSCODE,
      'Content-Type': 'application/json',
    },
  }
);
```

### Handle Message Click / View

```tsx
CleverTap.markReadInboxMessageForId(messageId);
CleverTap.pushInboxNotificationViewedEventForId(messageId);
CleverTap.pushInboxNotificationClickedEventForId(messageId);
```

---

## ❗ Notes

* App Inbox *won’t* show messages for anonymous users (i.e., before login).
* Make sure you call onUserLogin and use a valid identity before accessing the inbox.
* This project does not use SDK methods like getAllInboxMessages, getInboxMessageCount, or getInboxMessageUnreadCount.
* All inbox retrieval is done via API — giving you complete UI control.
