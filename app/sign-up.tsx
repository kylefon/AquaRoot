import CreateLayout from "@/components/CreateLayout";
import { user } from "@/db/schema";
import { useDrizzle } from "@/hooks/useDrizzle";
import { isValidEmail } from "@/utils/actions";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { sha256 } from "js-sha256";

export default function SignUp() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    
    async function signUpWithEmail() {
        setLoading(true);

        if (username.length < 3) {
            Alert.alert("Username should be more than 2 characters");
            setLoading(false);
            return;
        }

        if (!email || !password || !confirmPassword || !username) {
            Alert.alert("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password and confirm password do not match");
            setLoading(false);
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Invalid email format");
            setLoading(false);
            return;
        }
        const hashedPassword = sha256(password);

        const response = await fetch(`http://192.168.68.50/users/createUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email.toLowerCase(),
                password: hashedPassword,
                username: username,
                isLoggedIn: 1
            })
        })

        if (!response.ok) {
            // add a 409 status code whenever email already exists
            if (response.status === 409) {
                setLoading(false);
                Alert.alert('User already registered')
            } else {
                Alert.alert("Unable to sign up user");
                setLoading(false);
            }
            return;
        }

        Alert.alert("Successfully signed in your account");
        router.replace("/plant-type")   
        setLoading(false);            
    } 

    if (loading) {
        return(
            <CreateLayout>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginBottom: 10 }}>Creating your account...</Text>
                    <ActivityIndicator size="large" color="#00cc99" />
                </View>
            </CreateLayout>
        )
    }
    
    return (
        <CreateLayout>
            <View style={{ gap: 15 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Create New Account</Text>
                    <Link href="/" asChild>
                        <Text style={styles.subHeading}>Already Registered? Log in here</Text>
                    </Link>
                </View>
                <View style={{ gap: 20}}>
                    <View style={{ flexGrow: 1, justifyContent: "center", gap: 10 }} >
                        <View style={{ gap: 15 }}>
                            <View>
                                <Text style={styles.subHeading}>USERNAME</Text>
                                <TextInput placeholder="username" value={username} maxLength={15} onChangeText={(text) => setUsername(text)} style={styles.input}/>
                            </View>
                            <View>
                                <Text style={styles.subHeading}>EMAIL</Text>
                                <TextInput placeholder="example@gmail.com" value={email} onChangeText={(text) => setEmail(text.toLowerCase())} style={styles.input} autoCapitalize="none"/>
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
                    </View>
                    <Pressable style={styles.button} disabled={loading} onPress={() => signUpWithEmail()}>
                        <Text style={{ fontSize: 10, padding: 10, color: 'white', textAlign: "center"}}>Next</Text>
                    </Pressable>
                </View>
            </View>
        </CreateLayout>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#cfcec6',
        color: '#4d4c4c',
        borderRadius: 20,
        padding: 16,
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
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 30,
    },
    subHeading: {
        color: '#8f8e8e',
        fontSize: 10.5
    }
})

