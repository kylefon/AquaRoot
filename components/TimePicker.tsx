import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Pressable, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from "react-native";

type TimePickerProps = {
    setTimeValue: any;
    timeValue: string;
}

export default function TimePicker({ setTimeValue, timeValue }: TimePickerProps) {
    const [ time, setTime ] = useState<Date | null>(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (event.type === 'set') {
            const currentTime = selectedDate || time;
            
            const formatted = currentTime?.toLocaleTimeString("sv-SE", { hour12: false }); // "HH:mm:ss"
            setTimeValue(formatted); 

            if (Platform.OS === "android"){
                toggleDatePicker();   
                setTime(currentTime);
            }
        } else {
            toggleDatePicker();
        }
    }
    
    useEffect(() => {
        if (timeValue === "") {
            const currentTime = new Date();
            const formatted = currentTime.toLocaleTimeString("sv-SE", { hour12: false }); // "HH:mm:ss"
            setTimeValue(formatted);        
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={toggleDatePicker} style={styles.input}>
                { showPicker && ( 
                    <View style={{ alignContent: 'center', flex: 1 }}>
                        <DateTimePicker 
                        mode="time"
                        value={time || new Date() }
                        onChange={handleDateChange}
                        style={styles.picker}
                        />
                    </View>
                )}

                { !showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                        <TextInput
                            placeholder="Time"
                            style={styles.input}
                            placeholderTextColor="gray"
                            value={time?.toLocaleTimeString('sv-SE')}
                            editable={false}
                            />
                    </Pressable>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: { 
        alignItems: 'center', 
        justifyContent: 'space-between',  
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
    picker: {
        padding: 0,
    }
})