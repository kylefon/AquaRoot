import { Leaf, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Button, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Collapsible } from "../Collapsible";
import SelectDropdown from "react-native-select-dropdown";
import InlineDropdown from "../Dropdown";
import { ScrollView } from "react-native-gesture-handler";
import EditPlant from "../EditPlant";
import { getPlants } from "@/utils/actions";

export default function EditPots() {
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
        <View style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
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
                                    <Text style={styles.mainHeader}>Edit Plants</Text>
                                    <View>
                                        <View style={styles.plantView}>
                                            {plants.map(( data, index ) => (
                                                <View style={styles.dropdownContainer} key={index}>
                                                    <Text style={styles.potText}>Pot {index + 1 }</Text>
                                                    <EditPlant data={data}/>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        ):(
                            <></>
                        )}
                </SafeAreaView>
            </SafeAreaProvider>
            <Pressable 
                style={({ pressed }) => [
                    styles.wateringCanButton,
                    pressed && styles.pressed
                ]}
                onPress={() => setModalVisible(!modalVisible)} 
                >
                <Image source={require('@/assets/images/watering-can.png')} style={styles.wateringCan}/>
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
    saveButton: {
        backgroundColor: "#557153",
        borderRadius: 25,
        padding: 16,
        alignItems: "center",
        width: 100
    },
    dropdownContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
        width: "100%",
    },
    pressed: {
        transform: [{ translateY: 5}, {translateX: -5}],
        shadowOpacity: 0,
    },
    wateringCanButton: {
        backgroundColor: '#a9af7e',
        width: 150,
        height: 100,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: "center",
        shadowColor: '#557153',
        shadowOffset: { width: -5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    wateringCan: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
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
        width: '93%',
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
    potText: {
        color: '#ffffff',
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 10
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