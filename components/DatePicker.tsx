import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Button, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'

export default function DatePicker({ setDateValue, dateValue }) {
    const [ date, setDate ] = useState(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setDateValue(currentDate.toLocaleDateString('en-ca'))
        }
    }

    useEffect(() => {
        if (dateValue === "") {
            const now = new Date();
            setDateValue(now.toLocaleDateString("en-ca"));
        }
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={[styles.input, showPicker && styles.inputActive]}>
                { showPicker ? ( 
                    <DateTimePicker 
                        mode="date"
                        minimumDate={new Date()}
                        value={ date || new Date() }
                        onChange={handleDateChange}
                    />
                ):(
                    <Text style={{ color: "gray"}}>Date</Text>
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
        flex: 1,
        width: "100%"
    }, 
    inputActive: {
        alignItems: 'center',
        padding: 0
    }
})