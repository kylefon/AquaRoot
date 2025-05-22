import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useEffect, useState } from "react";
import { deletePlant, editPlantName, getAuthenticatedUser, getPlants } from "@/utils/actions";
import { Image } from "react-native";
import { useDrizzle } from "@/hooks/useDrizzle";
import { GetPlantData } from "@/types/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { sendPlantDataToESP } from "@/scripts/sendPlantDataToESP";

export default function MyDictionary() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plants, setPlants ] = useState<GetPlantData[] | null>([]);
    const [ loading, setLoading ] = useState(false);
    const [ imageLoad, setImageLoad ] = useState<{ [key: string]: boolean }>({});
    const [ plantName, setPlantName ] = useState('');
    const [ toEditId, setToEditId ] = useState<number | null>(null);

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

    const handleEditPlant = async (name: string, id: number) => {
        const user = await getAuthenticatedUser(drizzleDb);
        await editPlantName(drizzleDb, name, id);
        const allPlants = await getPlants(drizzleDb, user.id);
        if (!allPlants) {
            Alert.alert("Error", "No Plants Available")
        }
        setPlants(allPlants);
        setPlantName('');

        Alert.alert("Successfully edited plant name");
    }

    const handleDeletePlant = async (id: number) => {
        const user = await getAuthenticatedUser(drizzleDb);

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
                await deletePlant(drizzleDb, id);
                const allPlants = await getPlants(drizzleDb, user.id);
                setPlants(allPlants); 

                // Uncomment this if ESP connection is ready
                // const success = await sendPlantDataToESP();
                // if (!success) Alert.alert("Warning", "Failed to sync plant with ESP32")
              },
            },
          ]
        );
      };
    

    if (loading) {
        return (
            <Pressable style={styles.tab} onPress={() => setModalVisible(true)}>
                <MaterialIcons color="#557153" size={40} name="menu-book"/>
                <View style={styles.text}>
                    <Text style={styles.textColorActive}>Your Dictionary</Text>
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
                            setModalVisible(false);
                            }}>
                                <View style={styles.centeredView}>
                                    <KeyboardAvoidingView
                                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                                        style={{ width: "93%" }}
                                    >
                                    <ScrollView contentContainerStyle={styles.modalView} keyboardShouldPersistTaps="handled">
                                    <Pressable onPress={() => setModalVisible(false)} style={{ alignItems: "flex-end"}}>
                                        <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20 }}>x</Text>
                                    </Pressable>
                                    <Text style={styles.mainHeader}>My Dictionary</Text>
                                    {plants?.map((data: GetPlantData, index: number) => (
                                        <View style={{ flexDirection: 'row', gap: 20 }} key={index}>
                                            { data.image ? (
                                                <View style={{ position: 'relative', width: 80, height: 80 }}>
                                                    { !imageLoad[data.plantId] && (
                                                        <View style={styles.imageAbsolute}>
                                                            <MaterialIcons name="eco" size={80} color="#557153"/>
                                                        </View>
                                                    )}
                                                    <Image source={{ uri: data.image}} style={styles.image} 
                                                        onLoad={() => setImageLoad( prev => ({ ...prev, [data.plantId]: true}))}
                                                        />
                                                </View>
                                            ):(
                                                <View style={{ borderWidth: 2, borderRadius: 100, borderColor:"#557153", backgroundColor: "white", width: 80, height: 80 }}>
                                                    <MaterialIcons name="eco" size={80} color="#557153"/>
                                                </View>
                                            )}
                                            <View style={styles.plantView}>
                                                <View style={styles.plantHeader} >
                                                    {toEditId === data.id ? (
                                                        <TextInput style={styles.input} value={plantName} maxLength={25} placeholder={data.plantName} onChangeText={(text) => {setPlantName(text)}} />
                                                    ):(
                                                        <Text style={styles.plantName}>{data.plantName}</Text>
                                                    )}
                                                    <View style={styles.icons}>
                                                        <Pressable onPress={() => {
                                                            if (toEditId === data.id) {
                                                                setToEditId(null);
                                                            } else {
                                                                setToEditId(data.id);
                                                                setPlantName(data.plantName);
                                                            }
                                                        }}>
                                                                <MaterialIcons name="edit" color="#557153" size={25}/>
                                                        </Pressable>
                                                        {toEditId === data.id ? (
                                                            <Pressable onPress={() => {
                                                                setToEditId(null);
                                                                handleEditPlant(plantName, data.plantId)
                                                            }}>
                                                                <MaterialIcons name="check" color="#557153" size={25}/>
                                                            </Pressable>
                                                        ):(
                                                            <Pressable onPress={() => {
                                                                handleDeletePlant(data.plantId)
                                                            }}>
                                                                <MaterialIcons name="delete" color="#560216" size={25}/>
                                                            </Pressable>
                                                        )}
                                                    </View>
                                                </View>
                                                <View style={styles.plantSubText}>
                                                    <Text style={styles.subHeader}>Every {Number.isInteger(data?.frequency) ? data?.frequency : parseFloat(data?.frequency.toFixed(2))} hours</Text>
                                                    <Text style={styles.subHeader}>Valve: {data.duration}s</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </View>
                        </Modal>
                    )}
                {/* </SafeAreaView> */}
            <Pressable style={styles.tab} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="menu-book" color="#557153" size={40}/>
                <View style={styles.text}>
                    <Text style={styles.textColor}>Your Dictionary</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} weight="medium" color="#557153"/>
            </Pressable>
        </View>
    )
} 

const styles = StyleSheet.create({
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
        zIndex: 2 
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 100,
        display: 'flex',
        zIndex: 1 
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
        fontSize: 15,
        color: "#557153",
        fontWeight: "600"      
    },
    textColorActive: {
        color: "#557153",
        fontWeight: "800"      
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
        fontSize: 12,
        fontWeight: "600"
    },
    plantSubText: {
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    plantName: {
        color: '#ffffff',
        fontSize: 15
    },
    icons: {
        flexDirection: 'row',
        gap: 5
    }
})