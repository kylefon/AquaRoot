import { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'

export default function DatePicker({ setDateValue }) {
    const [ date, setDate ] = useState(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || date;
            // console.log(currentDate);
            setDate(currentDate);
            setDateValue(currentDate);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                {/* <Button title="Date" disabled={true}/> */}
                {/* { showPicker && (  */}
                    <DateTimePicker 
                        mode="date"
                        minimumDate={new Date()}
                        value={date || new Date() }
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