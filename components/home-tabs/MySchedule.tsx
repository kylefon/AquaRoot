import { useDrizzle } from "@/hooks/useDrizzle";
import { GetPlantData } from "@/types/models";
import { getAuthenticatedUser, getPlants } from "@/utils/actions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

export default function MySchedule() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState<GetPlantData[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ imageLoad, setImageLoad ] = useState<{ [key: string]: boolean }>({});

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
                <MaterialIcons name="calendar-month" color="#557153" size={40}/>
                <View style={styles.text}>
                    <Text style={styles.textColorActive}>My Schedule</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} weight="medium" color="#557153"/>
            </Pressable>
        )
    }

    return (
        <View>
                {/* <SafeAreaView> */}
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
                                    <View style={styles.modalView}>                                        
                                        <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ alignItems: "flex-end"}}>
                                            <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20}}>x</Text>
                                        </Pressable>
                                        <Text style={styles.mainHeader}>My Schedule</Text>
                                        { plants.map((data, index) => {
                                            const rawDate = data.date || String(new Date()); 
                                            const [datePart, timePart] = rawDate?.split("T");
                                            const [year, month, day] = datePart.split("-");
                                            let [hourStr, minute] = timePart.split(":");

                                            let hour = parseInt(hourStr);
                                            const ampm = hour >= 12 ? "PM" : "AM";
                                            hour = hour % 12 || 12; 
                                            
                                            const formatted = `${new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'short' })} ${day}, ${year} at ${hour}:${minute} ${ampm}`;
                                            
                                            return(
                                                <View key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', borderBottomColor: "#557153", borderBottomWidth: 1 }}>
                                                    { data.image ? (
                                                        <>
                                                        { !imageLoad[data.plantId] && (
                                                                <View style={styles.imageAbsolute}>
                                                                    <MaterialIcons name="eco" color="#557153"/>
                                                                </View>
                                                            )}
                                                            <Image source={{ uri: data.image}} style={styles.image} 
                                                                onLoad={() => setImageLoad( prev => ({ ...prev, [data.plantId]: true}))}
                                                            />
                                                        </>
                                                    ):(
                                                        <View style={{ borderWidth: 2, borderRadius: 100, borderColor:"#557153", backgroundColor: "white" }}>
                                                            <MaterialIcons name="eco" color="#557153" size={80}/>
                                                        </View>
                                                    )}
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
                <MaterialIcons name="calendar-month" color="#557153" size={40}/>
                <View style={styles.text}>
                    <Text style={styles.textColor}>My Schedule</Text>
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
    imageAbsolute: {
       position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        width: 80,
        height: 80,
        backgroundColor: "white",
        borderRadius: 100,
        borderColor:"#557153",
        zIndex: 1 
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
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
        fontSize: 15,
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
        fontSize: 12,
        fontWeight: "600"
    },
    plantSubText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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