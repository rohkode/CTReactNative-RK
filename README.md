# 📨 CleverTap React Native - App Inbox API Integration (`app-inbox-api-version`)

## 📖 Use Case

Many apps today use an **App Inbox** to send persistent in-app messages to users — promotions, reminders, alerts, or updates that don’t disappear after being seen. But here’s a challenge:

**What happens when a user uninstalls and reinstalls the app? Do the messages stay?**

This repository answers that question with a **YES** ✅ — using CleverTap's App Inbox APIs *directly* on the client side via the React Native SDK, we’ve implemented a version where:

* Messages persist across uninstall and reinstall if the same `identity` is used to log in.
* No server-side API calls are required to fetch the inbox messages.
* Everything is handled within the React Native app using the official CleverTap SDK methods.

---

## 🚀 What This Project Implements

* CleverTap SDK integration
* App Inbox message retrieval using:

  * `getAllInboxMessages`
  * `getInboxMessageUnreadCount`
  * `getInboxMessageCount`
* Storing messages client-side using state
* Handling:

  * Message view
  * Message click
* Testing of re-delivery of inbox messages across uninstall/reinstall by logging in with the same identity.

---

## 🧠 How Does the Message Persist After Reinstall?

CleverTap stores App Inbox messages **on their servers**, tied to a user’s unique identity.

When the user logs in with the same `identity` again after reinstalling the app:

* The SDK automatically re-associates the device with that identity.
* Inbox messages for that user are retrieved from CleverTap's backend when `initializeInbox()` is called.
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

* Messages retrieved via `getAllInboxMessages`
* Total and unread counts displayed
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
  CleverTapReact.initializeInbox();
}, []);
```

### Fetch Messages

```tsx
const fetchInboxMessages = async () => {
  try {
    const messages = await CleverTapReact.getAllInboxMessages((messages) => {
      console.log("Inbox Messages:", messages);
      setInboxMessages(messages);
    });
  } catch (err) {
    console.error("Inbox fetch error", err);
  }
};
```

### Get Message Counts

```tsx
const getCounts = async () => {
  const totalCount = await CleverTapReact.getInboxMessageCount();
  const unreadCount = await CleverTapReact.getInboxMessageUnreadCount();
  console.log("Total:", totalCount, "Unread:", unreadCount);
};
```

### Mark Message as Viewed or Clicked

```tsx
CleverTapReact.recordInboxNotificationViewedEvent(message);
CleverTapReact.recordInboxNotificationClickedEvent(message);
```

---

## ❗ Notes

* App Inbox *won’t* show messages for anonymous users (i.e., before login).
* You must call `initializeInbox()` *after* the user logs in and identity is set.
* No server-side API setup is required — all logic lives inside the React Native app.
