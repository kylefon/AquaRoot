import { StyleSheet, useColorScheme, View } from "react-native";
import MyDictionary from "./home-tabs/MyDictionary";
import PotManagement from "./home-tabs/PotManagement";
import WaterMonitoring from "./home-tabs/WaterMonitoring";
import MySchedule from "./home-tabs/MySchedule";

export default function HomeTabs() {
    return (
        <View style={styles.container}>
            {/* <View style={styles.tab}>
                <BookOpenText color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Your Dictionary</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </View> */}
            <MyDictionary />
            {/* <View style={styles.tab}>
                <Leaf color="#557153" size={40}/>
                <View style={styles.text}>
                    <Text style={styles.textColor}>Pot Management</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153" />
            </View> */}
            <PotManagement />
            {/* <View style={styles.tab}>
                <Droplets color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Water Monitoring</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153" />
            </View> */}
            <WaterMonitoring />
            {/* <View style={styles.tab}>
                <CalendarDays color="#557153" size={40}/>
                <View style={styles.text}>
                    <Text style={styles.textColor}>My Schedule</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153" />
            </View> */}
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
        fontSize: 20,
        color: "#557153",
        fontWeight: "600"      
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#f6f6e9',
        borderRadius: 10,
        marginTop: 50,
        display: 'flex',
        gap: 40,
    },
})