import { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function CreateLayout({ children }:{ children: ReactNode }) {

    return (
        <View style={{ flex: 1, backgroundColor: '#7caa95'}}>
            <ImageBackground source={require('@/assets/images/leaf-bg.png')} style={styles.background}>
                <View style={{ flex: 1 }}>
                    <View style={styles.WelcomeBox}>
                        {children}
                    </View>
                </View>
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
        flex: 1,
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