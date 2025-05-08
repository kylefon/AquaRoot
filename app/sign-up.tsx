import CreateLayout from "@/components/CreateLayout";
import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIn() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signUpWithEmail() {
        setLoading(true)

        if (!email || !password || !confirmPassword || !username) {
            Alert.alert("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password and confirm password do not match");
            return;
        }

        const {
            data: signUpData,
            error: signUpError
        } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                },
            },
        })

        if (signUpError) {
            Alert.alert(signUpError.message);
            setLoading(false);
            return;
        }

        Alert.alert("Successfully signed in your account");
        router.push("/plant-type")
        
        setLoading(false);
    }
    
    return (
        <CreateLayout>
            <View style={{ gap: 15 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Create New Account</Text>
                    <Link href="/sign-in" asChild>
                        <Text style={styles.subHeading}>Already Registered? Log in here</Text>
                    </Link>
                </View>
                <View style={{ gap: 20}}>
                    <View style={{ gap: 10 }}>
                        <View>
                            <Text style={styles.subHeading}>USERNAME</Text>
                            <TextInput placeholder="username" value={username} onChangeText={(text) => setUsername(text)} style={styles.input}/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>EMAIL</Text>
                            <TextInput placeholder="example@gmail.com" value={email} onChangeText={(text) => setEmail(text)} style={styles.input} autoCapitalize="none"/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>PASSWORD</Text>
                            <TextInput placeholder="password" value={password} onChangeText={(text) => setPassword(text)} style={styles.input} secureTextEntry={true} autoCapitalize={'none'}/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>CONFIRM PASSWORD</Text>
                            <TextInput placeholder="confirm password" value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} style={styles.input} secureTextEntry={true} autoCapitalize={'none'}/>
                        </View>
                    </View>
                    <View style={styles.button}>
                        {/* <Button title="Next" onPress={() => router.push("/plant-type")}/> */}
                        <Button title="Next" disabled={loading} onPress={() => signUpWithEmail()}/>
                    </View>
                </View>
            </View>
        </CreateLayout>
    )
}

const styles = StyleSheet.create({
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
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50,
    },
    subHeading: {
        color: '#8f8e8e',
        fontSize: 10.5
    }
})

