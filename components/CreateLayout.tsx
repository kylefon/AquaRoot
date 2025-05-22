import { ReactNode } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

export default function CreateLayout({ children }:{ children: ReactNode }) {

    return (
        <View style={{ flex: 1, backgroundColor: '#7caa95'}}>
            <ImageBackground source={require('@/assets/images/leaf-bg.png')} style={styles.background}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flexGrow: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.WelcomeBox}>
                            {children}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
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
        gap: 30,
        marginTop: 80
    }
})