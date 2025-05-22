import { StyleSheet, View } from "react-native";
import MyDictionary from "./home-tabs/MyDictionary";
import MySchedule from "./home-tabs/MySchedule";
import PotManagement from "./home-tabs/PotManagement";
import WaterMonitoring from "./home-tabs/WaterMonitoring";

export default function HomeTabs() {
    return (
        <View style={styles.container}>
            <MyDictionary />
            <PotManagement />
            <WaterMonitoring />
            <MySchedule />
        </View>
    )
}

const styles = StyleSheet.create({
    tab: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: "center"
    },
    text: {
        flex: 2,
        borderBottomColor: "#557153",
        borderBottomWidth: 0.5,
        color: "#557153",
    },
    textColor: {
        fontSize: 15,
        color: "#557153",
        fontWeight: "600"      
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#f6f6e9',
        borderRadius: 10,
        marginTop: 20,
        display: 'flex',
        gap: 40,
    },
})