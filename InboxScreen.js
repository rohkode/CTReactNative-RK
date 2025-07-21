import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CleverTap from 'clevertap-react-native';

const CT_ACCOUNT_ID = 'W84-RZR-RZ7Z';
const CT_PASSCODE = 'IYA-IOC-MHEL';

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
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessagePress = (messageId) => {
    if (!messageId) return;
    try {
      CleverTap.markReadInboxMessageForId(messageId);
      CleverTap.pushInboxNotificationViewedEventForId(messageId);
      CleverTap.pushInboxNotificationClickedEventForId(messageId);
    } catch (err) {
      console.error('Error tracking inbox events:', err);
    }
  };

  const renderItem = ({ item }) => {
    const content = item.msg?.content?.[0];
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleMessagePress(item._id)}>
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
        keyExtractor={(item) => item._id}
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