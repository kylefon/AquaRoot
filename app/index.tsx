import { Link, router } from "expo-router";
import { Button, Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import 'react-native-gesture-handler';

export default function SignIn() {

    return (
        <View style={{ flex: 1, backgroundColor: '#7caa95'}}>
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
                                        <Text style={styles.subHeading}>USERNAME</Text>
                                        <TextInput placeholder="username" style={styles.input}/>
                                    </View>
                                    <View>
                                        <Text style={styles.subHeading}>PASSWORD</Text>
                                        <TextInput placeholder="password" style={styles.input}/>
                                    </View>
                                </View>
                                <Pressable style={styles.button}>
                                    <Button title="Log in" onPress={() => router.push("/my-home/")}/>
                                </Pressable>
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