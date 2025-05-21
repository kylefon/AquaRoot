import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { addPlantData, dateWithFrequency, editPlantType, getAuthenticatedUser } from "@/utils/actions";
import UploadImage from "./UploadImage";
import { plantType } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useDrizzle } from "@/hooks/useDrizzle";
import { GetPlantData } from "@/types/models";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNotifications } from "@/context/useNotifications";
import { ScheduleNotification } from "@/scripts/notifications";
import { sendPlantDataToESP } from "@/scripts/sendPlantDataToESP";

type EditPlantProps = {
    data: GetPlantData;
    onRefresh: any;
}

export default function EditPlant({ data, onRefresh }: EditPlantProps) {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [dateValue, setDateValue] = useState(data?.date || "");
    const [timeValue, setTimeValue] = useState("");
    const [plantName, setPlantName] = useState(data?.plantName || "");
    const [potNumber, setPotNumber] = useState<string>(data?.potNumber.toString() || "");
    const [duration, setDuration] = useState<string>(data?.duration.toString() || "");
    const [frequency, setFrequency] = useState<string>(data?.frequency.toString() || "");
    const [ image, setImage ] = useState(data?.image || "");

    const isEdit = data === null;

    const drizzleDb = useDrizzle();
    // const { refreshNotifications } = useNotifications();
    
    const submitForm = async () => {
        const user = await getAuthenticatedUser(drizzleDb);

        if (!plantName || !potNumber || !frequency || !duration || !user || !dateValue || !timeValue) {
            Alert.alert("Please fill in all values");
            return;
        }
        const formattedDate = `${dateValue.split("T")[0]}T${timeValue}.000`
 
        const newData = {
            ...data,
            date: formattedDate,
            plantName: plantName,
            potNumber: Number(potNumber),
            duration: Number(duration),
            frequency: Number(frequency),
            image: image
        }
        
        try {
            const { editPlantData, editPlantTypeData } = await editPlantType(drizzleDb, newData);

            if ( !editPlantData || !editPlantTypeData ) {
                Alert.alert("Error", "Unable to edit plant. Please try again")
            } else {
                Alert.alert("Successfully edited plant");
                setModalVisible(false);
                console.log(newData);
                // await refreshNotifications(drizzleDb)
                // await ScheduleNotification(newData, scheduleNotificationAsync, drizzleDb);

                const success = await sendPlantDataToESP();
                if (!success) Alert.alert("Warning", "Failed to sync plant with ESP32")
            }
        } catch (err) {
            Alert.alert(`Unexpected Error: ${err}`);
        }
    }
    
    const addForm = async () => {
        const user = await getAuthenticatedUser(drizzleDb);
        
        if (!plantName || !potNumber || !frequency || !duration || !user || !dateValue || !timeValue) {
            Alert.alert("Please fill in all values");
            return;
        }

        const formattedDate = `${dateValue}T${timeValue}.000`

        const potNumData = await drizzleDb
            .select()
            .from(plantType)
            .where(eq(plantType.userId, user.id))

        if (!potNumData) {
            Alert.alert("Error getting pot numbers");
        }

        if (Number(potNumber) < 1 || Number(potNumber) > 4) {
            Alert.alert("Pot number should be from 1-4");
            return;
        };

        const potNumbers = potNumData?.map(item => item.potNumber);
        if (potNumbers?.includes(Number(potNumber))) {
            Alert.alert(`There is already a plant at pot ${potNumber}`);
            return;
        } 
        
        const newData= {
            plantName: plantName,
            potNumber: Number(potNumber),
            frequency: Number(frequency),
            duration: Number(duration),
            userId: user?.id,
            date: formattedDate,
            image: image
        }
        
        const { plantData, plantTypeData } = await addPlantData(drizzleDb, newData);

        if ( !plantData || !plantTypeData ) {
            Alert.alert(`Error adding plant ${plantName} at pot ${potNumber}`)
        } else {
            Alert.alert("Successfully added plant");
            setModalVisible(false);
            // await refreshNotifications(drizzleDb);
            // console.log(plantData, plantTypeData);
            // await ScheduleNotification(newData, scheduleNotificationAsync, drizzleDb)

            const success = await sendPlantDataToESP();
            if (!success) Alert.alert("Warning", "Failed to sync plant with ESP32")
        }
    }
  
    return (
        <View style={{ flex: 1 }}>
                <SafeAreaView>
                        <Modal 
                            animationType="fade" 
                            visible={modalVisible} 
                            transparent={true}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed");
                                setModalVisible(!modalVisible);
                        }}>
                            <View style={styles.centeredView}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={{ width: "93%" }}
                                >
                                    <ScrollView contentContainerStyle={styles.modalView} keyboardShouldPersistTaps="handled">

                                        <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ alignItems: "flex-end"}}>
                                            <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20}}>x</Text>
                                        </Pressable>
                                            <Text style={styles.mainHeader}>
                                                {isEdit ? "Add Plant": `Edit ${data?.plantName || ""}`}
                                            </Text>
                                            <View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Plant Name</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <TextInput placeholder={data?.plantName || "Plant name"} placeholderTextColor="gray" style={styles.input} value={plantName} maxLength={15} onChangeText={(text) => setPlantName(text)}/>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Date</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <DatePicker setDateValue={setDateValue} dateValue={dateValue}/>
                                                        <MaterialIcons name="event" color="gray"/>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Time</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <TimePicker setTimeValue={setTimeValue} timeValue={timeValue}/>
                                                        <MaterialIcons name="schedule" color="gray"/>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Pot Number</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <TextInput placeholder={data?.potNumber?.toString() || "Pot number"} placeholderTextColor="gray" style={styles.input} maxLength={1} keyboardType="numeric" value={potNumber} onChangeText={(text) => setPotNumber(text)}/>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Valve Duration</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <TextInput placeholder={data?.duration?.toString() || "Duration"} placeholderTextColor="gray" style={styles.input} keyboardType="numeric" maxLength={10} value={duration} onChangeText={(text) => setDuration(text)} />
                                                        <Text style={{ color: "gray" }}>sec</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Frequency</Text>
                                                    <View style={styles.inputWrapper}>
                                                        <TextInput placeholder={`Every ${ Number.isInteger(data?.frequency) ? data?.frequency : parseFloat(data?.frequency.toFixed(2)) || "x"} hours` || "Frequency"} placeholderTextColor="gray" style={styles.input} keyboardType="numeric" maxLength={10} value={frequency} onChangeText={(text) => setFrequency(text)}/>
                                                    </View>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Upload Image</Text>
                                                    <UploadImage setImage={setImage}/>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: "center" }}> 
                                                { isEdit ? (
                                                    <Pressable style={styles.saveButton} onPress={() => addForm()}>
                                                        <Text style={{ color: "white"}}>Add</Text>
                                                    </Pressable>
                                                ):(
                                                    <Pressable style={styles.saveButton} onPress={() => submitForm()}>
                                                        <Text style={{ color: "white"}}>Edit</Text>
                                                    </Pressable>
                                                )}
                                            </View>
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </View>
                        </Modal>
                </SafeAreaView>
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.plantEdit}>{data?.plantName || "Add Plant"}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    plantEdit:{
        backgroundColor: "white",
        borderRadius: 25,
        padding: 8,
        flex: 1,
        width: "100%",
        textAlign: "center",
        fontWeight: "bold"
    },
    saveButton: {
        backgroundColor: "#557153",
        borderRadius: 25,
        padding: 16,
        alignItems: "center",
        width: 100
    },
    inputWrapper: { 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 8, 
        flexDirection: 'row', 
        flex: 1, 
        backgroundColor: '#ffffff', 
        borderRadius: 20,
    },
    input: {
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: 20,
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
        width: '100%'
    },
    tab: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: "center",
        width: "100%",
        textAlign: "center",
    },
    textColor: {
        fontSize: 15,
        color: "#557153",
        fontWeight: "600"      
    },
    plantHeader: {
        flexDirection: 'column',
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
        color: '#000000',
        fontSize: 20,
        fontWeight: "bold"
    },
    icons: {
        flexDirection: 'row',
    }
})