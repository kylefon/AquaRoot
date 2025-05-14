import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

type TimePickerProps = {
    setTimeValue: any;
    timeValue: string;
}

export default function TimePicker({ setTimeValue, timeValue }: TimePickerProps) {
    const [ time, setTime ] = useState<Date | null>(null);
    const [ showPicker, setShowPicker ] = useState(true);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (event.type === 'set') {
            const currentTime = selectedDate || time;
            setTime(currentTime);

            const formatted = currentTime?.toLocaleTimeString("sv-SE", { hour12: false }); // "HH:mm:ss"
            setTimeValue(formatted);        
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
            <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={[styles.input, showPicker && styles.inputActive]}>
                { showPicker ? ( 
                    <View style={{ alignContent: 'center', flex: 1 }}>
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
        flex: 1,
        width: "100%"
    },
    inputActive: {
        alignContent: 'center',
        padding: 0,
    },
    picker: {
        padding: 0,
    }
})