import { Leaf, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Collapsible } from "../Collapsible";
import SelectDropdown from "react-native-select-dropdown";
import InlineDropdown from "../Dropdown";
import { ScrollView } from "react-native-gesture-handler";
import { getPlants } from "@/utils/actions";

export default function PotManagement() {
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


    const handleSelect = (item: string) => {
        // console.log(item);
    }

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
                                        <Text style={styles.mainHeader}>Pot Management</Text>
                                        {/* <ScrollView
                                            contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
                                            showsVerticalScrollIndicator={false}
                                        > */}
                                            <View>
                                                <View style={styles.plantView}>
                                                    { plants.map((data, index) => (
                                                        <View style={styles.dropdownContainer} key={index}>
                                                            <Text style={styles.potText}>Pot {data.potNumber}</Text>
                                                            <View style={{ flex: 1 }}>
                                                                <InlineDropdown data={data.plantName} onSelect={handleSelect}/>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                                <View style={{ alignItems: "center" }}> 
                                                    <Pressable style={styles.saveButton}>
                                                        <Text style={{ color: "white"}}>Save</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        {/* </ScrollView> */}
                                    </View>
                                </View>
                            </Modal>
                        ) : (
                            <></>
                        )}
                </SafeAreaView>
            </SafeAreaProvider>
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
        alignItems: 'flex-start',
        gap: 10
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