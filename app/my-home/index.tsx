import EditPots from "@/components/home-tabs/EditPots";
import HomeTabs from "@/components/HomeTabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';

import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import NotifESP from "@/scripts/NotifESP";

export default function MyHome() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.background}>
            <LinearGradient
                colors={["#678a71", "#4b6244", "#678a71"]}
                locations={[0.3, 0.5, 0.9]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1, padding: 30 }}
            >
                <View>
                    <MaterialIcons name="account-circle" style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                    <View style={styles.pageContainer}>
                        <View style={styles.logo}>
                            <Image source={require('@/assets/images/AquaRoot-WhiteText.png')} style={styles.logoImage}/>
                        </View>
                        <View style={styles.contentContainer}>
                            <View>
                                <Text style={styles.header}>My Home</Text>
                                <HomeTabs />
                                <NotifESP />
                            </View>
                            <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                                <EditPots/>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profile: {
        position: 'absolute',
        top: 20, 
        left: 5,
        zIndex: 10, 
    },
    pageContainer: {
        display: 'flex',
        gap: 25
    },
    logo: {
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5
    },
    logoImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    header: {
        fontWeight: "bold",
        color: "#ffffff",
        fontSize: 25,
        textAlign: "center"
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }, 
    background: {
        // backgroundColor: "#3c4b2b",
        width: "100%",
        height: "100%",
        flex: 1
    }, 
    canContainer: {
        alignItems: 'center'
    }, 
    contentContainer: {
        gap: 30
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