import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'

export default function TimePicker({ setTimeValue }) {
    const [ time, setTime ] = useState(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentTime = selectedDate || time;
            // console.log(currentDate);
            setTime(currentTime);
            setTimeValue(currentTime);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                {/* <Button title="Time" disabled={true}/> */}
                {/* { showPicker && (  */}
                    <DateTimePicker 
                    mode="time"
                    value={time || new Date() }
                    onChange={handleDateChange}
                    style={styles.input}
                    />
                {/* )}  */}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: 20,
        // padding: 8
    }
})