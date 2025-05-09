import { CalendarDays, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getPlants } from "@/utils/actions";
import { useUserContext } from "@/context/UserContext";

export default function MySchedule() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const user = useUserContext();

    useEffect(() => {
        const getPlant = async () => {
            setLoading(true);
            const allPlants = await getPlants(user.id);

            if (allPlants.length === 0) {
                setModalVisible(false);
                return;
            }
            
            setPlants(allPlants);
            setLoading(false);
        }
        
        if (modalVisible) {
            getPlant();
        }
    }, [user, modalVisible])

    return (
        <View>
                {/* <SafeAreaView> */}
                    {!loading && (
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
                                        <Text style={styles.mainHeader}>My Schedule</Text>
                                        { plants.map((data, index) => {
                                            const rawDate = data.date; 
                                            const [datePart, timePart] = rawDate.split("T");
                                            const [year, month, day] = datePart.split("-");
                                            let [hour, minute] = timePart.split(":");
                                            
                                            hour = parseInt(hour);
                                            const ampm = hour >= 12 ? "PM" : "AM";
                                            hour = hour % 12 || 12; 
                                            
                                            const formatted = `${new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'short' })} ${day}, ${year} at ${hour}:${minute} ${ampm}`;
                                            
                                            return(
                                                <View key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                                                    <Image source={{ uri: data.image}} style={styles.image}/>
                                                    <View style={styles.plantView} >
                                                        <View style={styles.plantHeader}>
                                                            <Text style={styles.plantName}>{data.plantName}</Text>
                                                            <Text style={styles.potText}>Pot {data.potNumber}</Text>
                                                        </View>
                                                        <View style={styles.plantSubText}>
                                                            <Text style={styles.subHeader}>{formatted}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                            </View>
                        </Modal>
                    )} 
            {/* </SafeAreaView> */}
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <CalendarDays color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>My Schedule</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
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
    potText: {
        fontWeight: "bold",
        color: "#557153",
        borderLeftColor: "white",
        borderLeftWidth: 1,
        paddingLeft: 10,
        fontSize: 15
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
        gap: 13,
        borderBottomColor: "#557153",
        borderBottomWidth: 1,
        paddingVertical: 16,
        flex: 1
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
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        padding: 10,
        alignItems: "center"
    },
    subHeader: {
        color: "#557153",
        fontSize: 15,
        fontWeight: "600"
    },
    plantSubText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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