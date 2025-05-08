import { Droplets, Pencil, Trash2 } from "lucide-react-native";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { addPlantData, editPlantType, getPotNumbers } from "@/utils/actions";
import { useUserContext } from "@/context/UserContext";

export default function EditPlant({ data, onRefresh }) {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [dateValue, setDateValue] = useState(data?.date || "");
    const [timeValue, setTimeValue] = useState(data?.time || "");
    const [plantName, setPlantName] = useState(data?.plantName || "");
    const [potNumber, setPotNumber] = useState(data?.potNumber || "");
    const [duration, setDuration] = useState(data?.duration || "");
    const [frequency, setFrequency] = useState(data?.frequency || "");

    const isEdit = data === null;

    const user = useUserContext();

    const dateWithFrequency = (date) => {
        const toAdd = frequency * 60 * 60 * 1000;
        const localDate = new Date(date);

        const updatedTime = new Date(localDate.getTime() + toAdd);
        const localISOString = new Date(updatedTime.getTime() - updatedTime.getTimezoneOffset() * 60000).toISOString().slice(0, -1);

        return localISOString;
    }

    const submitForm = async () => {

        const formattedDate = `${dateValue}T${timeValue}.000`;
        const localISOString = dateWithFrequency(formattedDate);

        const newData = {
            ...data,
            date: localISOString,
            plantName: plantName,
            potNumber: potNumber,
            duration: duration,
            frequency: frequency
        }

        try {
            const { error, plantError } = await editPlantType(newData);

            if ( error || plantError ) {
                Alert.alert("Error", "Unable to edit plant. Please try again")
            } else {
                Alert.alert("Successfully edited plant");
                setModalVisible(false);
                onRefresh();
            }
        } catch (err) {
            Alert.alert(`Unexpected Error: ${err}`);
        }
    }
    
    const addForm = async () => {

        const formattedDate = `${dateValue}T${timeValue}.000`
        const localISOString = dateWithFrequency(formattedDate);


        if (!plantName || !potNumber || !frequency || !duration || !user || !dateValue || !timeValue) {
            Alert.alert("Please fill in all values");
            return;
        }

        const { data: potNumData , error } = await getPotNumbers(user.id);

        if (error) {
            Alert.alert("Error getting pot numbers");
        }

        if (potNumber < 1 || potNumber > 4) {
            Alert.alert("Pot number should be from 1 - 4");
            return;
        };

        const potNumbers = potNumData?.map(item => item.potNumber);
        if (potNumbers?.includes(Number(potNumber))) {
            Alert.alert(`There is already a plant at pot ${potNumber}`);
            return;
        } 
        
        const newData= {
            plantName: plantName,
            potNumber: potNumber,
            frequency: frequency,
            duration: duration,
            userId: user?.id,
            date: localISOString,
        }
        
        const { error: plantError, plantTypeError } = await addPlantData(newData);

        if ( plantError || plantTypeError ) {
            Alert.alert(`Error adding plant ${plantName} at pot ${potNumber}`)
        } else {
            Alert.alert("Successfully added plant");
            setModalVisible(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
                <SafeAreaView>
                        <Modal 
                            animationType="slide" 
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
                                                    <TextInput placeholder={data?.plantName || "Plant name"} placeholderTextColor="gray" style={styles.input} value={plantName} maxLength={15} onChangeText={(text) => setPlantName(text)}/>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Date</Text>
                                                    <DatePicker setDateValue={setDateValue} dateValue={dateValue}/>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Time</Text>
                                                    <TimePicker setTimeValue={setTimeValue} timeValue={timeValue}/>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Pot Number</Text>
                                                    <TextInput placeholder={data?.potNumber?.toString() || "Pot number"} placeholderTextColor="gray" style={styles.input} maxLength={1} keyboardType="numeric" value={potNumber} onChangeText={(text) => setPotNumber(text)}/>
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Valve Duration</Text>
                                                    <TextInput placeholder={data?.duration?.toString() || "Duration"} placeholderTextColor="gray" style={styles.input} keyboardType="numeric" maxLength={10} value={duration} onChangeText={(text) => setDuration(text)} />
                                                </View>
                                                <View style={styles.plantHeader}>
                                                    <Text style={styles.plantName}>Frequency</Text>
                                                    <TextInput placeholder={`Every ${data?.frequency || "x"} hours` || "Frequency"} placeholderTextColor="gray" style={styles.input} keyboardType="numeric" maxLength={10} value={frequency} onChangeText={(text) => setFrequency(text)}/>
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
    input: {
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: 20,
        padding: 8,
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
        fontSize: 20,
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