import { Droplets, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getPlants } from "@/utils/actions";

export default function WaterMonitoring() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const getPlant = async () => {
            setLoading(true);
            const allPlants = await getPlants(id);
            setPlants(allPlants);
            setLoading(false);
        }
        
        if (modalVisible) {
            getPlant();
        }
    }, [modalVisible])

    return (
        <View>
            <SafeAreaProvider>
                <SafeAreaView>
                    {!loading ? (
                        <Modal 
                        animationType="slide" 
                        visible={modalVisible} 
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed");
                            setModalVisible(!modalVisible);
                        }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ alignItems: "flex-end"}}>
                                        <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20}}>x</Text>
                                    </Pressable>
                                    <Text style={styles.mainHeader}>Water Monitoring</Text>
                                    {plants.map((data, index) => {
                                        const waterUsage = (data.frequency * data.duration * 0.001149).toFixed(2);
                                        return (
                                            <View style={styles.plantView} key={index}>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Pot {index+1}: {data.plantName}</Text>
                                                </View>
                                                <View style={styles.plantSubText}>
                                                    <Text style={styles.subHeader}>Every {data.frequency} hours</Text>
                                                    <Text style={styles.subHeader}>Valve: {data.duration} s</Text>
                                                    <Text style={styles.subHeader}>Water Usage: {waterUsage}L/day</Text>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        <></>
                    )}
                </SafeAreaView>
            </SafeAreaProvider>
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <Droplets color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Water Monitoring</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 30,
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
        width: '93%'
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
        fontSize: 20,
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
        fontSize: 15,
        fontWeight: "600"
    },
    plantSubText: {
        paddingHorizontal: 10
    },
    plantName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: "bold"
    },
    icons: {
        flexDirection: 'row',
    }
})