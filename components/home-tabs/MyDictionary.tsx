import { BookOpenText, Check, Pencil, Sprout, Trash2 } from "lucide-react-native";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { deletePlant, editPlantName, getPlants } from "@/utils/actions";
import { useUserContext } from "@/context/UserContext";
import { Image } from "react-native";

export default function MyDictionary() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ plantName, setPlantName ] = useState('');
    const [ toEditId, setToEditId ] = useState(null);

    const {user} = useUserContext()

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

    const handleEditPlant = async (name: string, id: string) => {
        await editPlantName(name, id);
        const allPlants = await getPlants(user.id);
        setPlants(allPlants);
        setPlantName('');

        Alert.alert("Successfully edited plant name");
    }

    const handleDeletePlant = (id: string) => {
        Alert.alert(
          "Delete Plant",
          "Are you sure you want to delete this plant?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress:  async () => {
                await deletePlant(id);
                const allPlants = await getPlants(user.id);
                setPlants(allPlants); 
              },
            },
          ]
        );
      };
      
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
                                        <View style={{ flexDirection: 'row', gap: 20 }} key={index}>
                                            { data.image ? (
                                                <Image source={{ uri: data.image}} style={styles.image}/>
                                            ):(
                                                <View style={{ borderWidth: 2, borderRadius: 100, borderColor:"#557153"}}>
                                                    <Sprout size={80} color="#557153"/>
                                                </View>
                                            )}
                                            <View style={styles.plantView}>
                                                <View style={styles.plantHeader} >
                                                    {toEditId === data.id ? (
                                                        <TextInput style={styles.input} value={data.plantName} maxLength={25} placeholder={data.plantName} onChangeText={(text) => setPlantName(text)}/>
                                                    ):(
                                                        <Text style={styles.plantName}>{data.plantName}</Text>
                                                    )}
                                                    <View style={styles.icons}>
                                                        <Pressable onPress={() => {
                                                            if (toEditId === data.id) {
                                                                setToEditId(null);
                                                            } else {
                                                                setToEditId(data.id);
                                                            }
                                                        }}>
                                                            <Pencil color="#557153"/>
                                                        </Pressable>
                                                        {toEditId === data.id ? (
                                                            <Pressable onPress={() => {
                                                                setToEditId(null);
                                                                handleEditPlant(plantName, data.plantId)
                                                            }}>
                                                                <Check color="#557153"/>
                                                            </Pressable>
                                                        ):(
                                                            <Pressable onPress={() => {
                                                                handleDeletePlant(data.plantId)
                                                            }}>
                                                                <Trash2 color="#560216"/>
                                                            </Pressable>
                                                        )}
                                                    </View>
                                                </View>
                                                <View style={styles.plantSubText}>
                                                    <Text style={styles.subHeader}>Every {data.frequency} hours</Text>
                                                    <Text style={styles.subHeader}>Valve: {data.duration}s</Text>
                                                </View>
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
    image: {
        width: 80,
        height: 80,
        borderRadius: 100
    },
    input: {
        backgroundColor: '#8f8e8e',
        color: '#000000',
        borderRadius: 20,
        padding: 5,
        width: 100,
        flex: 1
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
        gap: 5
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
        gap: 5
    }
})