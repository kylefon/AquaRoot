import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, AppState, Button, Dimensions, Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import 'react-native-gesture-handler';

AppState.addEventListener('change', (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function SignIn() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) Alert.alert(error.message)
        if ( data ) {
            Alert.alert("Successfully logged in");
            router.push("/my-home");
            return;
        }
        setLoading(false);
    }
    
    return (
        <View style={{ flex: 1, backgroundColor: '#7caa95' }}>
            <ImageBackground source={require('@/assets/images/leaf-bg.png')} style={styles.background}>
                <View style={{ flex: 1 }}>
                    <View style={styles.logo}>
                        <Image source={require('@/assets/images/AquaRoot-Logo.png')}/>
                    </View>
                    <View style={styles.WelcomeBox}>
                        <View style={{ gap: 15 }}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.header}>Welcome!</Text>
                                <Text style={styles.subHeading}>Sign in to continue</Text>
                            </View>
                            <View style={{ gap: 20}}>
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
                                <View style={styles.button}>
                                    {/* <Button title="Log in" onPress={() => router.push("/my-home/")}/> */}
                                    <Button title="Log in" disabled={loading} onPress={() => signInWithEmail()}/>
                                </View>
                            </View>
                        </View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.subHeading}>Forgot Password?</Text>
                            <Link href="/sign-up" asChild>
                                <Text style={styles.subHeading}>Signup</Text>
                            </Link>
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
        color: '#000000',
        borderRadius: 20,
        padding: 16
    },
    headerContainer: {
        alignItems: 'center'
    }, 
    button: {
        backgroundColor: '#1c2120',
        color: '#ffffff',
        borderRadius: 10
    },
    header: {
        fontSize: 50,
        fontWeight: 'bold'
    },
    subHeading: {
        color: '#8f8e8e',
        fontSize: 10.5
    }
})