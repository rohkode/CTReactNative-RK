# 📨 CleverTap React Native – Unified Inbox API Integration

🚨⚠️ **Note**: This project was an internal POC to explore implementation options and build knowledge. It is not intended to be shared with customers. Our current Unified Inbox APIs are not designed to handle the scale of multiple millions of user devices unless fully productized, and the cost implications at such scale would be prohibitively high.

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

## 🧩 What This Project Implements

* Fetch messages using CleverTap's Inbox APIs:
  * `(getMessages)`
* Track Viewed & Clicked events:
  * `(markMessagesAsRead)`
  * `(markMessagesAsClicked)`
* Custom React Native UI using FlatList
* Full control over UI (no native SDK inbox UI)
* Works across uninstall/reinstall and device changes when same identity is used

---

## 🧠 How Does Message Persistence Work?

CleverTap stores Unified Inbox messages **on the servers**, tied to a user’s unique identity.

When the user logs in with the same `identity` again after reinstalling the app:

* The SDK automatically re-associates the device with that identity.
   * The app makes an API call to CleverTap (getMessages) to fetch inbox messages for that identity.
   * Messages are fetched & displayed
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
* `InboxScreen.js` → API headers

---

### Step 3: Send a Unified Inbox Message

On the CleverTap dashboard:

1. Go to **Campaigns** → **+ Campaign** → **Unified Inbox**.
2. Create a campaign for a test user (with a specific `identity`).
3. Choose a title, message, etc.
4. Launch the campaign.

---

### Step 4: Open Inbox in the App

Login with the same `identity` in the app. Then navigate to the Inbox screen.

You’ll see:

* Messages retrieved from the API
* Custom UI rendering messages
* Message title and message rendered in a FlatList
* Logs on view/click handlers

---

## 🔁 Reinstall & Verify Persistence

1. Uninstall the app.
2. Reinstall the app.
3. Login again with the same `identity`.
4. Inbox messages reappear ✅

---

## 📦 Code Highlights

### Fetch Messages

```js
const response = await axios.post(
  'https://sk1.api.clevertap.com/1/inbox/getMessages',
  { userId: userIdentity },
  { headers: { 'X-CleverTap-Account-Id': CT_ACCOUNT_ID, 'X-CleverTap-Passcode': CT_PASSCODE } }
);
```

### Handle Message Click / View

```js
await axios.post(`${BASE_URL}/markMessagesAsRead`, {
  userId: userIdentity,
  messages: [{ messageId: message.messageId, wzrk_id: message.wzrk_id }]
});
await axios.post(`${BASE_URL}/markMessagesAsClicked`, {
  userId: userIdentity,
  messages: [{ messageId: message.messageId, wzrk_id: message.wzrk_id }]
});
```

---

## ❗ Notes

* Kindly enable Unified Inbox feature in your CleverTap dashboard.
* Unified Inbox messages won’t show for anonymous users (i.e., before login).
* Make sure you call onUserLogin and use a valid identity before accessing the inbox.
* This project does not use SDK methods like getAllInboxMessages.
* All inbox retrieval is done via API — giving you complete UI control.
