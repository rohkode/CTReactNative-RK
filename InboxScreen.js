import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const CT_ACCOUNT_ID = 'W84-RZR-RZ7Z';
const CT_PASSCODE = 'IYA-IOC-MHEL';

const InboxScreen = ({ route }) => {
  const { userIdentity } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInboxMessages = async () => {
    try {
      const url = 'https://sk1.api.clevertap.com/1/inbox/getMessages';
      const payload = {
        userId: userIdentity || '__tanviShettyay',
      };
      const headers = {
        'X-CleverTap-Account-Id': CT_ACCOUNT_ID,
        'X-CleverTap-Passcode': CT_PASSCODE,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(url, payload, { headers });
      console.log('Inbox API response:', response.data);
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxMessages();
  }, []);

  const renderItem = ({ item }) => {
  const content = item.msg?.content?.[0];
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{content?.title?.text}</Text>
      <Text style={styles.body}>{content?.message?.text}</Text>
    </View>
  );
};

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

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