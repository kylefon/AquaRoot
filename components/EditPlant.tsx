import { Droplets, Pencil, Trash2 } from "lucide-react-native";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

export default function EditPlant({ data }) {
    const [ modalVisible, setModalVisible ] = useState(false);
    const [dateValue, setDateValue] = useState(null);
    const [timeValue, setTimeValue] = useState(null);
    const [plantName, setPlantName] = useState(data.plantName);
    const [potNumber, setPotNumber] = useState(data.potNumber);
    const [duration, setDuration] = useState(data.duration);
    const [frequency, setFrequency] = useState(data.frequency);

    const submitForm = () => {
        console.log("DATE VALUE", dateValue);
        
        console.log("TIME VALUE", timeValue);
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
                                <View style={styles.modalView}>
                                    <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ alignItems: "flex-end"}}>
                                        <Text style={{color: '#557153', fontWeight: "bold", fontSize: 20}}>x</Text>
                                    </Pressable>
                                    <Text style={styles.mainHeader}>Edit {data.plantName}</Text>
                                        <View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Plant Name</Text>
                                                <TextInput placeholder={data.plantName} placeholderTextColor="gray" style={styles.input}/>
                                            </View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Date</Text>
                                                <DatePicker setDateValue={setDateValue}/>
                                            </View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Time</Text>
                                                {/* <TextInput placeholder="Time" placeholderTextColor="gray" style={styles.input}/> */}
                                                <TimePicker setTimeValue={setTimeValue}/>
                                            </View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Pot Number</Text>
                                                <TextInput placeholder="Enter pot number" placeholderTextColor="gray" style={styles.input} keyboardType="numeric"/>
                                            </View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Valve Duration</Text>
                                                <TextInput placeholder="Enter valve duration" placeholderTextColor="gray" style={styles.input} keyboardType="numeric"/>
                                            </View>
                                            <View style={styles.plantHeader}>
                                                <Text style={styles.plantName}>Frequency</Text>
                                                <TextInput placeholder={`Every ${data.frequency} hours`} placeholderTextColor="gray" style={styles.input} keyboardType="numeric"/>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: "center" }}> 
                                            <Pressable style={styles.saveButton} onPress={() => submitForm()}>
                                                <Text style={{ color: "white"}}>Set</Text>
                                            </Pressable>
                                        </View>
                                </View>
                            </View>
                        </Modal>
                </SafeAreaView>
            <Pressable style={styles.tab} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.plantEdit}>{data.plantName}</Text>
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
        width: '93%'
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