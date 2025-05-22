import { plant, plantType, user } from "@/db/schema";
import { useDrizzle } from "@/hooks/useDrizzle";
import { PlantData, PlantTypeData, UserData } from "@/types/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Application() {
    const navigation = useNavigation();

    return(
        <SafeAreaView style={styles.background}>
            <View style={{ padding: 15 }}>
                <MaterialIcons name="account-circle" style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                <View style={{ alignItems: 'center', justifyContent: "center"}}>
                    <Text style={styles.header}>Customize Application</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    background: {
        backgroundColor: "#3c4b2b",
        flex: 1,
        paddingBottom: 100,
    },
    header: {
        fontWeight: "bold",
        color: "#ffffff",
        fontSize: 18,
        textAlign: "center",
        padding: 15,
    },
    profile: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    section: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    item: {
        backgroundColor: "#5a6c45",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
    },
    itemText: {
        color: "#f0f0f0",
        fontSize: 12,
    },
});