import { plant, plantType, user } from "@/db/schema";
import { useDrizzle } from "@/hooks/useDrizzle";
import { PlantData, PlantTypeData, UserData } from "@/types/models";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { CircleUser } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Application() {
    const [ userData, setUserData ] = useState<UserData[]>();
    const [ plantData, setPlantData ] = useState<PlantData[]>();
    const [ plantTypeData, setPlantTypeData ] = useState<PlantTypeData[]>();
    const navigation = useNavigation();

    const drizzleDb = useDrizzle();

    useEffect(() => {
        getDatabaseContent();
        getPlantContent();
        getPlantTypeContent();
    }, [])

    const getDatabaseContent = async () => {
        const result = await drizzleDb.select().from(user).all();
        setUserData(result);
    }

    const getPlantContent = async () => {
        const result = await drizzleDb.select().from(plant).all();
        setPlantData(result);
    }

    const getPlantTypeContent = async () => {
        const result = await drizzleDb.select().from(plantType).all();
        setPlantTypeData(result);
    }

    const renderItem = (item: any) => (
        <View style={styles.item}>
            {Object.entries(item).map(([key, value]) => (
                <Text style={styles.itemText} key={key}>
                    {key}: {value?.toString()}
                </Text>
            ))}
        </View>
    );

    return(
        <SafeAreaView style={styles.background}>
            <View style={{ padding: 15 }}>
                <CircleUser style={styles.profile} size={40} color="#ffffff" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                <View style={{ alignItems: 'center', justifyContent: "center"}}>
                    <Text style={styles.header}>Customize Application</Text>
                </View>
            </View>
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Users</Text>
                    <FlatList data={userData} renderItem={({ item }) => renderItem(item)} keyExtractor={(item, index) => `user-${index}`} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Plants</Text>
                    <FlatList data={plantData} renderItem={({ item }) => renderItem(item)} keyExtractor={(item, index) => `plant-${index}`} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Plant Types</Text>
                    <FlatList data={plantTypeData} renderItem={({ item }) => renderItem(item)} keyExtractor={(item, index) => `plantType-${index}`} />
                </View>
            </ScrollView>
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
        fontSize: 20,
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