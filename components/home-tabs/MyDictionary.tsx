import { BookOpenText, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getPlants } from "@/utils/actions";
import { useUserContext } from "@/context/UserContext";

export default function MyDictionary() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const user = useUserContext()

    useEffect(() => {
        const getPlant = async () => {
            setLoading(true);
            const allPlants = await getPlants(user.id);
            setPlants(allPlants);
            setLoading(false);
        }
        
        if (modalVisible) {
            getPlant();
        }
    }, [modalVisible])

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
                                    <Text style={styles.mainHeader}>My Dictionary</Text>
                                    {plants.map((data, index) => (
                                        <View style={styles.plantView} key={index}>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>{data.plantName}</Text>
                                                <View style={styles.icons}>
                                                    <Pencil color="#557153"/>
                                                    <Trash2 color="#560216"/>
                                                </View>
                                            </View>
                                            <View style={styles.plantSubText}>
                                                <Text style={styles.subHeader}>Every {data.frequency} hours</Text>
                                                <Text style={styles.subHeader}>Valve: {data.duration}s</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </Modal>
                    )}
                {/* </SafeAreaView> */}
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <BookOpenText color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Your Dictionary</Text>
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
        gap: 13
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
        padding: 10
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
        fontSize: 20
    },
    icons: {
        flexDirection: 'row',
    }
})