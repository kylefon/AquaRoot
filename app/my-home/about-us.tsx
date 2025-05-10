import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { CircleUser } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutUs() {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.background}>
            <View style={{ padding: 15 }}>
                <CircleUser style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                <View style={{ alignItems: 'center', justifyContent: "center"}}>
                    <Text style={styles.header}>About Us</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    background: {
        backgroundColor: "#3c4b2b",
        flex: 1
    },
    header: {
        fontWeight: "bold",
        color: "#ffffff",
        fontSize: 20,
        textAlign: "center",
        padding: 15
    },
    profile: {
        position: 'absolute',
        top: 20, 
        left: 20,
        zIndex: 10, 
    },
})