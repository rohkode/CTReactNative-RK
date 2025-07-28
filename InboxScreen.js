import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import CleverTap from 'clevertap-react-native';

const CT_ACCOUNT_ID = 'W84-RZR-RZ7Z';
const CT_PASSCODE = 'IYA-IOC-MHEL';
const BASE_URL = 'https://sk1.api.clevertap.com/1/inbox';

const InboxScreen = ({ route }) => {
  const { userIdentity } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CleverTap.onUserLogin({ Identity: userIdentity });
    fetchInboxMessages();
  }, []);

  const fetchInboxMessages = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getMessages`,
        { userId: userIdentity },
        {
          headers: {
            'X-CleverTap-Account-Id': CT_ACCOUNT_ID,
            'X-CleverTap-Passcode': CT_PASSCODE,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (message) => {
    try {
      await axios.post(
        `${BASE_URL}/markMessagesAsRead`,
        {
          userId: userIdentity,
          messages: [
            {
              messageId: message.messageId,
              isRead: true,
              wzrk_pivot: message.wzrk_pivot || 'wzrk_default',
              wzrk_id: message.wzrk_id,
            },
          ],
        },
        {
          headers: {
            'X-CleverTap-Account-Id': CT_ACCOUNT_ID,
            'X-CleverTap-Passcode': CT_PASSCODE,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      console.log(`Marked message ${message.messageId} as read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAsClicked = async (message) => {
    try {
      await axios.post(
        `${BASE_URL}/markMessagesAsClicked`,
        {
          userId: userIdentity,
          messages: [
            {
              messageId: message.messageId,
              wzrk_id: message.wzrk_id,
              wzrk_pivot: message.wzrk_pivot || 'wzrk_default',
            },
          ],
        },
        {
          headers: {
            'X-CleverTap-Account-Id': CT_ACCOUNT_ID,
            'X-CleverTap-Passcode': CT_PASSCODE,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
      console.log(`Marked message ${message.messageId} as clicked`);
    } catch (error) {
      console.error('Error marking message as clicked:', error);
    }
  };

  const handleMessagePress = async (message) => {
    try {
      // Call both APIs
      await markAsRead(message);
      await markAsClicked(message);

      // Local SDK tracking (optional for profile)
      CleverTap.pushInboxNotificationViewedEventForId(message._id);
      CleverTap.pushInboxNotificationClickedEventForId(message._id);

      Alert.alert('Message Clicked', `ID: ${message.messageId}`);
    } catch (err) {
      console.error('Error processing message click:', err);
    }
  };

  const renderItem = ({ item }) => {
    const content = item.msg?.content?.[0];
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleMessagePress(item)}>
        <Text style={styles.title}>{content?.title?.text}</Text>
        <Text style={styles.body}>{content?.message?.text}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!messages.length) {
    return (
      <View style={styles.container}>
        <Text>No messages available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => String(item.messageId)}
        renderItem={renderItem}
      />
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: { padding: 12, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16 },
  body: { fontSize: 14, marginTop: 4 },
});