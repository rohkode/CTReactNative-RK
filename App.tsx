import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import CleverTap from 'clevertap-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from './InboxScreen'; // make sure this path is correct

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }: any) => {
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    CleverTap.initializeInbox();

    CleverTap.addListener('CleverTapInboxDidInitialize', () => {
      console.log('CleverTap Inbox Initialized');
    });

    CleverTap.addListener('CleverTapPushNotificationClicked', (event: any) => {
      const deepLinkURL = event.wzrk_dl;
      if (deepLinkURL) {
        Alert.alert('CleverTap Deep Link Triggered', deepLinkURL);
      }
    });

    return () => {
      CleverTap.removeListener('CleverTapPushNotificationClicked');
    };
  }, []);

  const handleUserLogin = () => {
    CleverTap.onUserLogin({
      Identity: identity,
      Name: name,
      Email: email,
      Phone: phone,
      Gender: gender,
    });
    console.log('User logged in:', { identity, name, email, phone, gender });
  };

  const fetchInboxMessages = async () => {
    try {
      const headers = {
        'X-CleverTap-Account-Id': 'W84-RZR-RZ7Z',
        'X-CleverTap-Passcode': 'IYA-IOC-MHEL',
        'Content-Type': 'application/json',
      };

      const body = {
        d: [{ userId: identity }],
      };

      const response = await axios.post(
        'https://sk1.api.clevertap.com/1/inbox/getMessages',
        body,
        { headers }
      );

      console.log('Fetched Inbox Messages:', response.data);
      Alert.alert('Inbox Fetched', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error fetching inbox:', error);
      Alert.alert('Error', 'Failed to fetch inbox messages');
    }
  };

  const handleRandomEvent = () => {
    CleverTap.recordEvent('Withdrawal Requested', {});
    console.log('Event without properties');
  };

  const handleEventWithProperties = () => {
    CleverTap.recordEvent('Withdrawal Completed', {
      withdrawal_amount: 200.0,
      withdrawal_method: 'bank_transfer',
      currency: 'USD',
      status: 'completed',
    });
    console.log('Event with properties');
  };

  const goToInboxScreen = () => {
    if (!identity.trim()) {
      Alert.alert('Missing Identity', 'Please enter identity before opening inbox');
      return;
    }
    navigation.navigate('Inbox', { userIdentity: identity });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Text style={styles.header}>CTReactNative</Text>

      <TextInput
        style={styles.input}
        placeholder="Identity"
        placeholderTextColor="#888"
        value={identity}
        onChangeText={setIdentity}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#888"
        value={gender}
        onChangeText={setGender}
      />

      <TouchableOpacity style={styles.inboxIconContainer} onPress={goToInboxScreen}>
        <Image
          source={require('./assets/bell_inbox.png')}
          style={styles.inboxIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
        <Text style={styles.buttonText}>User Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRandomEvent}>
        <Text style={styles.buttonText}>Trigger Random Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleEventWithProperties}>
        <Text style={styles.buttonText}>Trigger Event With Properties</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={fetchInboxMessages}>
        <Text style={styles.buttonText}>Fetch Inbox Messages</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 40,
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  inboxIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
  },
  inboxIcon: {
    width: 40,
    height: 40,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});