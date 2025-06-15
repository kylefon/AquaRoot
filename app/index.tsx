import { user } from '@/db/schema'
import { useDrizzle } from '@/hooks/useDrizzle'
import { and, eq } from 'drizzle-orm'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useRouter } from 'expo-router'
import * as SQLite from "expo-sqlite"
import { useEffect, useState } from 'react'
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { sha256 } from 'js-sha256';
import { getAuthenticatedUser } from '@/utils/actions'

const db = SQLite.openDatabaseSync('user');

export default function Main() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const getLogin = async () => {
      try {
        const response = await getAuthenticatedUser();
        if (response) {
          router.replace('/my-home')
        }
      } catch (err) {
        console.log("Login failed: ", err);
      }
    }

    getLogin();
  }, [])

  async function signInWithEmail() {
    setLoading(true); 

    if (email.length === 0 || password.length === 0) {
      Alert.alert("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const hashedInputPassword = sha256(password);

      const response = await fetch(`http://192.168.68.50/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: hashedInputPassword,
        })
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert('Error', 'Email does not exist');
        } else if (response.status === 401) {
          Alert.alert('Error', 'Incorrect password');
        } else {
          Alert.alert('Error', 'Login failed');
        }
        return;
      }

      const user = await response.json();
      Alert.alert('Success', 'Login successful');

      router.replace('/my-home');
      setEmail('');
      setPassword('');
      
    } catch (error) {
      Alert.alert("Error", "Unable during login");
      console.log("Error during login: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#7caa95' }}>
        <ImageBackground source={require('@/assets/images/leaf-bg.png')} style={styles.background}>
            <View style={{ flex: 1 }}>
                <View style={styles.logo}>
                    <Image source={require('@/assets/images/AquaRoot-HomeLogo.png')} style={{ width: 200,  height: 200, resizeMode: 'contain', }}/>
                </View>
                <View style={styles.WelcomeBox}>
                    <View style={{ gap: 15 }}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.header}>Welcome!</Text>
                            <Text style={styles.subHeading}>Sign in to continue</Text>
                        </View>
                        <View
                            style={{ gap: 20}}>
                            <ScrollView         
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 20 }}   
                                keyboardShouldPersistTaps="handled">
                            <View style={{ gap: 10 }}>
                                <View>
                                    <Text style={styles.subHeading}>EMAIL</Text>
                                    <TextInput placeholder="email" style={styles.input} value={email} onChangeText={(text) => setEmail(text)}/>
                                </View>
                                <View>
                                    <Text style={styles.subHeading}>PASSWORD</Text>
                                    <TextInput placeholder="password" style={styles.input} value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} autoCapitalize="none"/>
                                </View>
                            </View>
                            <Pressable style={styles.button} disabled={loading} onPress={() => signInWithEmail()}>
                                <Text style={{ fontSize: 10, padding: 10, color: 'white', textAlign: "center"}}>Log in</Text>
                            </Pressable>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.subHeading}>Forgot Password?</Text>
                        <Pressable onPress={() => router.navigate('/sign-up')}>
                            <Text style={styles.subHeading}>Signup</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    logo: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        width: '100%', 
        height: '100%',
    },
    WelcomeBox: {
        flex: 2,
        backgroundColor: '#f6f6e9',
        borderTopRightRadius: 100,
        borderTopLeftRadius: 7,
        padding: 50,
        width: '100%',
        display: 'flex',
        gap: 30
    },
    input: {
        backgroundColor: '#cfcec6',
        color: "#4d4c4c",
        borderRadius: 20,
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center'
    }, 
    button: {
        backgroundColor: '#1c2120',
        color: '#ffffff',
        borderRadius: 10,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    subHeading: {
        color: '#8f8e8e',
        fontSize: 10.5
    }
})
