import { useDrizzle } from "@/hooks/useDrizzle";
import { GetPlantData } from "@/types/models";
import { getAuthenticatedUser, getPlants } from "@/utils/actions";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import EditPlant from "../EditPlant";

export default function EditPots() {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ plantArray, setPlantArray ] = useState<GetPlantData[] | []>([])
    const [ loading, setLoading ] = useState(false);

    const drizzleDb = useDrizzle();

    const getPlant = async () => {
        const user = await getAuthenticatedUser();

        setLoading(true);
        const allPlants = await getPlants(user.id) || [];

        const emptyPlants = Array(4).fill(null);
        allPlants.forEach((plant: { potNumber: number; }) => {
            const index = plant.potNumber - 1;
            if ( index >= 0 && index < 4) {
                emptyPlants[index] = plant;
            }
        })
    
        setPlantArray(emptyPlants);
        setLoading(false);
    }

    useEffect(() => {        
        if (modalVisible) {
            getPlant();
        }
    }, [modalVisible])

    return (
        <View style={{ flex: 1 }}>
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
                                    <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20 }}>x</Text>
                                </Pressable>
                                <Text style={styles.mainHeader}>Edit Plants</Text>
                                <View>
                                    <View style={styles.plantView}>
                                        {plantArray.map(( data, index ) => (
                                            <View style={styles.dropdownContainer} key={index}>
                                                <Text style={styles.potText}>Pot {index + 1}</Text>
                                                <EditPlant data={data} onRefresh={async () => {
                                                    await getPlant();
                                                }}/>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            <Pressable 
                style={({ pressed }) => [
                    styles.wateringCanButton,
                    pressed && styles.pressed
                ]}
                onPress={() => setModalVisible(!modalVisible)} 
                >
                    <Image source={require('@/assets/images/watering-can.png')} style={styles.wateringCan}/>
                    <Text style={{ fontWeight: "bold", fontSize: 15, color: "#557153" }}>Edit Plants</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        fontSize: 20,
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
        height: 130,
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
        fontSize: 15,
        paddingTop: 10
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