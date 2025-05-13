import { Leaf, Pencil, Scroll, Trash2 } from "lucide-react-native";
import { Alert, Button, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Collapsible } from "../Collapsible";
import SelectDropdown from "react-native-select-dropdown";
import InlineDropdown from "../Dropdown";
import { ScrollView } from "react-native-gesture-handler";
import { editPotNumber, getAuthenticatedUser, getPlants } from "@/utils/actions";
import { useUserContext } from "@/context/UserContext";
import { useDrizzle } from "@/hooks/useDrizzle";

export default function PotManagement() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ selectedPlants, setSelectedPlants] = useState([]);
    const [ newPlants, setNewPlants ] = useState([]);

    const drizzleDb = useDrizzle()
    
    useEffect(() => {
        const getPlant = async () => {
            setLoading(true);
            const user = await getAuthenticatedUser(drizzleDb);
            const allPlants = await getPlants(drizzleDb, user.id);

            if (allPlants.length === 0) {
                setModalVisible(false);
                return;
            }
            
            const name = allPlants.filter(plant => plant.plantName && plant.potNumber).map(plant => ({ plantName: plant.plantName, potNumber: plant.potNumber}))
            const plantArray = Array(4).fill(null);

            name.forEach(plant => {
                const index = plant.potNumber - 1;
                if ( index >= 0 && index < 4) {
                    plantArray[index] = plant.plantName;
                }
            })
            setSelectedPlants(plantArray)
            setNewPlants(plantArray);
            
            setLoading(false);
        }
        
        if (modalVisible) {
            getPlant();
        }
    }, [modalVisible])

    const handleSelect = (item, i) => {
        setNewPlants(prev => {
            const updated = [...prev];
            updated[i] = item === "None" ? null : item; 
            return updated; 
          });
    }


    const onSave = async () => {
        const sortedNewPlants = [...newPlants].sort();
        const sortedSelectedPlants = [...selectedPlants].sort();

        if (sortedNewPlants.join(",") !== sortedSelectedPlants.join(",")) {
            Alert.alert("Please include all plants and prevent duplicates");
            return;
        }

        const result = newPlants.map((item, index) => item !== null ? { plantName: item, potNumber: index + 1}: null).filter(item => item !== null);

        for (let i = 0; i < result.length; i++ ) {
            await editPotNumber(drizzleDb, result[i].plantName, result[i].potNumber);
        }

        Alert.alert("Successfully edited pot numbers");
        setModalVisible(false);
    }

    if (loading) {
        return (
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <Leaf color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColorActive}>Pot Management</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} weight="medium" color="#557153"/>
            </Pressable>
        )
    }

    return (
        <View>
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
                                <Text style={styles.mainHeader}>Pot Management</Text>
                                <View>
                                    <View style={styles.plantView}>
                                        {selectedPlants.map((_, index) => (
                                                <View style={styles.dropdownContainer} key={index}>
                                                    <Text style={styles.potText}>Pot {index + 1}</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <InlineDropdown data={selectedPlants} onSelect={handleSelect} i={index} />
                                                    </View>
                                                </View>
                                        ))}
                                    </View>
                                    <View style={{ alignItems: "center" }}> 
                                        <Pressable style={styles.saveButton} onPress={() => onSave()}>
                                            <Text style={{ color: "white"}}>Save</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <Leaf color="#557153" size={40} />
                <View style={styles.text}>
                    <Text style={styles.textColor}>Pot Management</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    textColorActive: {
        fontSize: 20,
        color: "#557153",
        fontWeight: "800"      
    },
    mainHeader: {
        fontSize: 30,
        color: "#ffffff",
        textAlign: 'center',
        fontWeight: "bold"
    },
    dropdownContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        gap: 10
    },
    saveButton: {
        backgroundColor: "#557153",
        borderRadius: 25,
        padding: 16,
        alignItems: "center",
        width: 100
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