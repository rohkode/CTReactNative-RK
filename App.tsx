import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import CleverTap from 'clevertap-react-native';

//emulator -avd Medium_Phone_API_36 -read-only 

const App = () => {
  const [identity, setIdentity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    // Listener for CleverTap push notification click
    const onPushNotificationClick = (event: any) => {
      console.log('Push Notification Clicked:', event);
      const deepLinkURL = event.wzrk_dl;
      if (deepLinkURL) {
        // Handle the deep link (e.g., navigate or show alert)
        Alert.alert('CleverTap Deep Link Triggered', deepLinkURL);
      }
    };

    CleverTap.addListener('CleverTapPushNotificationClicked', onPushNotificationClick);

    return () => {
      CleverTap.removeListener('CleverTapPushNotificationClicked');
    };
  }, []);


  // useEffect(() => {
  //   // Handle the initial URL if the app was cold-launched via a deep link
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       handleDeepLink(url);
  //     }
  //   });

  //   // Listen for deep links while the app is running or in background
  //   const subscription = Linking.addEventListener('url', (event) => {
  //     handleDeepLink(event.url);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  // const handleDeepLink = (url: string) => {
  //   console.log('Deep link opened:', url);
  //   Alert.alert('Deep Link Triggered', `URL: ${url}`);
  //   // You can add route-based logic here if needed
  // };

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

      <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
        <Text style={styles.buttonText}>User Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRandomEvent}>
        <Text style={styles.buttonText}>Trigger Random Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleEventWithProperties}>
        <Text style={styles.buttonText}>Trigger Event With Properties</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default App;