import { user } from '@/db/schema'
import { useDrizzle } from '@/hooks/useDrizzle'
import { and, eq } from 'drizzle-orm'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useRouter } from 'expo-router'
import * as SQLite from "expo-sqlite"
import { useEffect, useState } from 'react'
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

const db = SQLite.openDatabaseSync('user');

export default function Main() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const router = useRouter();
  
  const drizzleDb = useDrizzle();
  useDrizzleStudio(db);

  useEffect(() => {
    const getLogin = async () => {
      const checkLogin = await drizzleDb
      .select()
      .from(user)
      .where(eq(user.isLoggedIn, 1))
      .all();
            
      if (checkLogin.length > 0) {
        router.replace('/my-home');
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
      const userTable = await drizzleDb
        .select()
        .from(user)
        .where(eq(user.email, email.toLowerCase()));

      if (userTable.length === 0) {
        Alert.alert('Error', 'Email does not exist');
        setLoading(false);
        return;
      }
      const validUser = await drizzleDb
        .select()
        .from(user)
        .where(and(eq(user.email, email.toLowerCase()), eq(user.password, password)))
        .limit(1)
        .all();

      if (validUser) {
        await drizzleDb
          .update(user)
          .set({ isLoggedIn: 1 })
          .where(eq(user.id, validUser[0].id)).run();

        Alert.alert('Success', 'Login successful');
        router.replace('/my-home');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Error', 'Incorrect password');
        setLoading(false);
      }
    } catch (error) {
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
        backgroundColor: '#8f8e8e',
        borderRadius: 20,
        padding: 16,
        opacity: 0.38
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
