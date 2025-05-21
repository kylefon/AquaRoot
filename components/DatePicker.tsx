import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Pressable } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from "react-native-gesture-handler";

type DatePickerProps = {
    setDateValue: any;
    dateValue: string;
}


export default function DatePicker({ setDateValue, dateValue }: DatePickerProps) {
    const [ date, setDate ] = useState<Date | null>(null);
    const [ showPicker, setShowPicker ] = useState(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    const handleDateChange = (event: any, selectedDate: any) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || date;
            setDateValue(currentDate.toLocaleDateString('en-ca'))

            if (Platform.OS === "android") {
                toggleDatePicker(); 
                setDate(currentDate);
            }
        } else {
            toggleDatePicker();
        }
    }

    useEffect(() => {
        if (date) {
            setDateValue(date);
        } else {
            const now = new Date();
            setDateValue(now.toLocaleDateString("en-ca"));
            setDate(now);
        }
        if (dateValue === "") {
            const now = new Date();
            setDateValue(now.toLocaleDateString("en-ca"));
            setDate(now);
        }
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={toggleDatePicker} style={styles.inputWrapper}>
                { showPicker && ( 
                    <DateTimePicker 
                        mode="date"
                        minimumDate={new Date()}
                        value={ date || new Date() }
                        onChange={handleDateChange}
                    />
                )}
                {!showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                        <TextInput 
                            placeholder="Date"
                            style={styles.input}
                            placeholderTextColor="gray"
                            value={date?.toLocaleDateString('en-ca')}
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
})