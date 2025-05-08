import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'

export default function TimePicker({ setTimeValue }) {
    const [ time, setTime ] = useState(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentTime = selectedDate || time;
            // console.log(currentDate);
            setTime(currentTime);

            const formatted = currentTime.toLocaleTimeString("sv-SE", { hour12: false }); // "HH:mm:ss"
            const datePart = currentTime.toISOString().split("T")[0]; // Local date fallback if needed
            setTimeValue(`${datePart}T${formatted}.000`);        
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={[styles.input, showPicker && styles.inputActive]}>
                { showPicker ? ( 
                    <View style={{ alignContent: 'center' }}>
                        <DateTimePicker 
                        mode="time"
                        value={time || new Date() }
                        onChange={handleDateChange}
                        style={styles.picker}
                        />
                    </View>
                ) : (
                    <Text style={{ color: "gray"}}>Time</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8
    },
    inputActive: {
        alignContent: 'center',
        padding: 0,
    },
    picker: {
        padding: 0,
    }
})