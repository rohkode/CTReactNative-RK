### 📥 App Inbox Integration using CleverTap API in React Native

This guide explains how to implement App Inbox using CleverTap React Native SDK with the `getAllInboxMessages()` API and dynamically fetch & display messages.

---

#### ✅ Prerequisites

1. **CleverTap React Native SDK integrated**
   [Official Setup Guide](https://developer.clevertap.com/docs/react-native)

2. **App Inbox Enabled** on your CleverTap dashboard.
   (Reach out to CleverTap Support if not visible.)

3. **Push an App Inbox Campaign** from the dashboard under *Campaigns → App Inbox*.

---

#### 🛠️ Implementation Steps

##### 1. **Initialize CleverTap SDK**

Ensure the SDK is initialized correctly in your `App.js` or root file:

```js
import CleverTap from 'clevertap-react-native';

CleverTap.setDebugLevel(3);
CleverTap.initializeInbox();
```

---

##### 2. **Fetch Inbox Messages Using API**

In your `InboxScreen.js` or wherever needed, use:

```js
import CleverTap from 'clevertap-react-native';
import { useEffect, useState } from 'react';

const InboxScreen = () => {
  const [inboxMessages, setInboxMessages] = useState([]);

  useEffect(() => {
    CleverTap.getAllInboxMessages((messages) => {
      console.log('Inbox Messages:', messages);
      setInboxMessages(messages);
    });
  }, []);
```

---

##### 3. **Display Messages in UI**

Example UI rendering (customizable):

```js
  return (
    <ScrollView>
      {inboxMessages.map((msg, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            CleverTap.recordInboxNotificationClicked(msg);
          }}
        >
          <View style={{ margin: 10, padding: 10, backgroundColor: '#fff' }}>
            <Text>{msg.msg.content.title}</Text>
            <Text>{msg.msg.content.message}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
```

---

##### 4. **Mark as Viewed (Optional)**

To record a message as **viewed** (on scroll or load):

```js
CleverTap.recordInboxNotificationViewed(message);
```

---

##### 5. **Persistent Message After Reinstall**

Messages are stored on the CleverTap server and retrieved on re-login (with same Identity). To support this:

```js
CleverTap.onUserLogin({
  Identity: 'rohit123', // Or dynamic user ID
  Email: 'rohit@example.com',
});
```

---

##### 6. **Ensure Identity is Set**

Inbox requires a valid user profile (Identity or Email) to retrieve messages.

If you’re testing as an anonymous user, the inbox will only populate **after login**.

---

### 📌 Notes

* Messages are pulled from the backend via API after `CleverTap.initializeInbox()` is called.
* Ensure your device is registered and your credentials (`Account ID`, `Region`) are correct and point to the right dashboard (e.g., `sk1.api.clevertap.com`).
* The `getAllInboxMessages()` API returns all messages including unread/read.

---

### 🔗 Branch Reference

This implementation is available on the GitHub branch:
👉 [`app-inbox-api-version`](https://github.com/rohkode/CTReactNative-RK/tree/app-inbox-api-version)
