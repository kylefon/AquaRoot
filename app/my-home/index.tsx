import EditPots from "@/components/home tabs/EditPots";
import HomeTabs from "@/components/HomeTabs";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { CircleUser, Scale } from "lucide-react-native";
import { Image, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { Button, Text, View } from "react-native";

export default function MyHome() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.background}>
            {/* <LinearGradient
                colors={['#3c4b2b', '#7caa95']}
                start={{ x: 0, y: 0 }}
                end={{ x:1, y:1 }}
                style={styles.gradientCircle}
            > */}
            <View style={{ padding: 15 }}>
                <CircleUser style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                <View style={styles.pageContainer}>
                    <View style={styles.logo}>
                        <Image source={require('@/assets/images/logo-png.png')} style={styles.logoImage}/>
                    </View>
                    <View style={styles.contentContainer}>
                        <View>
                            <Text style={styles.header}>My Home</Text>
                            <HomeTabs />
                        </View>
                        <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                            <EditPots />
                        </View>
                    </View>
                </View>
            </View>
            {/* </LinearGradient> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profile: {
        position: 'absolute',
        top: 20, 
        left: 20,
        zIndex: 10
    },
    pageContainer: {
        display: 'flex',
        gap: 5
    },
    logo: {
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5
    },
    logoImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    header: {
        fontWeight: "bold",
        color: "#ffffff",
        fontSize: 40,
        textAlign: "center"
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }, 
    background: {
        backgroundColor: "#3c4b2b",
        width: "100%",
        height: "100%",
        padding: 30,
        flex: 1
    }, 
    canContainer: {
        alignItems: 'center'
    }, 
    contentContainer: {
        gap: 50
    },
    gradientCircle: {
        width: "100%",
        height: "100%",
        flex: 1
    },
    pressed: {
        // backgroundColor: "#557153",
        transform: [{ translateY: 5}, {translateX: -5}],
        shadowOpacity: 0,
    }
})