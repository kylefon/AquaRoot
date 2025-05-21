import EditPots from "@/components/home-tabs/EditPots";
import HomeTabs from "@/components/HomeTabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { useEffect } from "react";

import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function MyHome() {
    const navigation = useNavigation();

    useEffect(() => {
        const getDbFilePath = async () => {
            const dbPath = `${FileSystem.documentDirectory}SQLite/user.db`;
            console.log("Database file path: ", dbPath);
        };

        getDbFilePath();
    }, []);

    return (
        <SafeAreaView style={styles.background}>
            <View style={{ padding: 15 }}>
                <MaterialIcons name="account-circle" style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
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
                            <EditPots/>
                        </View>
                    </View>
                </View>
            </View>
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
        fontSize: 25,
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