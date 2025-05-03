import CreateLayout from "@/components/CreateLayout";
import { Link, router } from "expo-router";
import { Button, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIn() {
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
                    <View style={{ gap: 10 }}>
                        <View>
                            <Text style={styles.subHeading}>USERNAME</Text>
                            <TextInput placeholder="username" style={styles.input}/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>EMAIL</Text>
                            <TextInput placeholder="example@gmail.com" style={styles.input}/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>PASSWORD</Text>
                            <TextInput placeholder="password" style={styles.input}/>
                        </View>
                        <View>
                            <Text style={styles.subHeading}>CONFIRM PASSWORD</Text>
                            <TextInput placeholder="confirm password" style={styles.input}/>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Button title="Next" onPress={() => router.push("/plant-type")}/>
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