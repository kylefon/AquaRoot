import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { getAuthenticatedUser, getPlants } from "@/utils/actions";
import { useDrizzle } from "@/hooks/useDrizzle";
import { GetPlantData } from "@/types/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function WaterMonitoring() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState<GetPlantData[] | null>([]);
    const [ loading, setLoading ] = useState(false);

    const drizzleDb = useDrizzle()
    

    useEffect(() => {
        const getPlant = async () => {
            setLoading(true);
            const user = await getAuthenticatedUser(drizzleDb);
            const allPlants = await getPlants(drizzleDb, user.id);
            if (!allPlants) {
                Alert.alert("Error", "No Plants Available")
                setLoading(false);
                setModalVisible(false);
                return;
            }
            setPlants(allPlants);
            setLoading(false);
        }
        
        if (modalVisible) {
            getPlant();
        }
    }, [modalVisible])

    if (loading) {
        return (
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <MaterialIcons name="water-drop" color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColorActive}>Water Monitoring</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} weight="medium" color="#557153"/>
            </Pressable>
        )
    }

    return (
        <View>
            {!loading && (
                <Modal 
                animationType="fade" 
                visible={modalVisible} 
                transparent={true}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed");
                    setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <KeyboardAvoidingView 
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{ width: "93%" }}
                        >
                            <ScrollView contentContainerStyle={styles.modalView} keyboardShouldPersistTaps="handled">
                                <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ alignItems: "flex-end"}}>
                                    <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20}}>x</Text>
                                </Pressable>
                                <Text style={styles.mainHeader}>Water Monitoring</Text>
                                {plants && plants.map((data, index) => {
                                    const waterUsage = ((24/data.frequency)* data.duration * 0.001149).toFixed(2);
                                    return (
                                        <View style={styles.plantView} key={index}>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Pot {data.potNumber}: {data.plantName}</Text>
                                            </View>
                                            <View style={styles.plantSubText}>
                                                <Text style={styles.subHeader}>Every {Number.isInteger(data?.frequency) ? data?.frequency : parseFloat(data?.frequency.toFixed(2))} hours</Text>
                                                <Text style={styles.subHeader}>Valve: {data.duration} s</Text>
                                                <Text style={styles.subHeader}>Water Usage: {waterUsage}L/hour</Text>
                                                {data?.waterUsage ? (
                                                    <Text style={styles.subHeader}>Water Used: {parseFloat(data?.waterUsage.toFixed(2))}L</Text>
                                                ):(
                                                    <Text style={styles.subHeader}>Water Used: 0L</Text>
                                                )}
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            )}
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <MaterialIcons name="water-drop" color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Water Monitoring</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    textColorActive: {
        color: "#557153",
        fontWeight: "800"      
    },
    mainHeader: {
        fontSize: 20,
        color: "#ffffff",
        textAlign: 'center',
        fontWeight: "bold"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        borderRadius: 20,
        justifyContent: 'space-between',
        padding: 35,
        backgroundColor: '#a9af7e',
        gap:15,
        width: '100%'
    },
    plantView: {
        borderBottomColor: "#557153",
        borderBottomWidth: 0.5,
        padding: 10
    },
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
    plantHeader: {
        flexDirection: 'row',
        color: '#ffffff',
        justifyContent: 'space-between',
        padding: 10
    },
    subHeader: {
        color: "#557153",
        fontSize: 12,
        fontWeight: "600"
    },
    plantSubText: {
        paddingHorizontal: 10
    },
    plantName: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: "bold"
    },
    icons: {
        flexDirection: 'row',
    }
})