import { Collapsible } from "@/components/Collapsible";
import CreateLayout from "@/components/CreateLayout";
import { supabase } from "@/lib/supabase";
import { Link, router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Button, Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function PlantTypes() {
    const [ plantTypes, setPlantTypes ] = useState([{ name: "", checks: "", duration: "" }]);

    async function addPlantType({plant, index}) {

        const checks = 168/plant.checks;

        const now = Date.now();
        const addHour = now + (checks*60*60*1000);
        const futureDate = new Date(addHour);

        const { data, error } = await supabase
            .from('plant')
            .insert({
                plantName: plant.name,
                image: null
            }).select()
        if (error) {
            Alert.alert(`Error adding plant ${plant.name}`)
        }

        const { data: plantData, error: plantError } = await supabase
            .from('plantType')
            .insert({
                potNumber: index + 1,
                frequency: checks,
                duration: plant.duration,
                plantId: data?.[0]?.id,
                date: futureDate.toISOString().split("T")[0],
                time: futureDate.toISOString()
            })
        
        if (plantError) {
            Alert.alert(`Error adding plant info for ${plant.name}`)
        }
    }
    
    const handlePlants = () => {
        setPlantTypes(prev => [...prev, { name: "", checks: "", duration: "" }]);
    }

    const handleRemove = (index: number) => {
        const newPlantTypes = [...plantTypes];
        newPlantTypes.splice(index, 1);
        setPlantTypes(newPlantTypes);
    }

    const handleInputChange = ( field: 'name' | 'checks' | 'duration', value: string, index: number ) => {
        const newPlantTypes = [...plantTypes];
        newPlantTypes[index][field] = value;
        setPlantTypes(newPlantTypes);
    }

    const submitForm = async () => {
        for ( let i = 0; i< plantTypes.length; i++ ){
            const plant = plantTypes[i]
            if (!plant.name || !plant.checks || !plant.duration) {
                Alert.alert("Please fill up all values")
            }
            await addPlantType({plant, index: i})
        }

        Alert.alert("Successfully added plants");
        router.push("/my-home")
    }


    return (
        <CreateLayout>
            <View style={{ gap: 15 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Create New Account</Text>
                    <Link href="/" asChild>
                        <Text style={styles.subHeading}>Already Registered? Log in here</Text>
                    </Link>
                </View>
                <ScrollView
                    contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                <View style={{ gap: 20}}>
                    <View style={{ gap: 10 }}>
                        <View style={{ width: "100%"}}>
                            <Text style={styles.subHeading}>SPECIFY PLANT TYPES (MAX 4):</Text>
                            <View style={styles.container}>
                                {plantTypes.map((input, index)=>(
                                    <View style={styles.inputContainer} key={index} >
                                        <Collapsible 
                                            title={`Plant ${index + 1}`}
                                            deleteElement={ plantTypes.length > 1 ? (
                                                <Trash2 onPress={() => handleRemove(index)} color="#4d4c4c"/>
                                            ):(
                                                <Trash2 color="#4d4c4c"/>
                                            )}
                                        >
                                            <View style={{ gap: 5 }}>
                                                <View style={{ width: "100%"}}>
                                                    <Text style={styles.subHeading}>Plant Name</Text>
                                                    <TextInput value={input.name} placeholder={`Plant Name`} style={styles.input} onChangeText={text => handleInputChange('name', text, index)}/>
                                                </View>
                                                <View>
                                                    <Text style={styles.subHeading}>Frequency of Checks (per week)</Text>
                                                    <TextInput value={input.checks} placeholder="Checks" style={styles.input} onChangeText={text => handleInputChange('checks', text, index)}/>
                                                </View>
                                                <View>
                                                    <Text style={styles.subHeading}>Duration (in seconds)</Text>
                                                    <TextInput value={input.duration} placeholder="Duration" style={styles.input} onChangeText={text => handleInputChange('duration', text, index)}/>
                                                </View>
                                            </View>
                                        </Collapsible>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    { plantTypes.length < 4 && (
                        <Pressable style={styles.addButton} onPress={handlePlants}>
                            <Text>+</Text>
                        </Pressable>
                    )}
                    <Pressable style={styles.button}>
                        {/* <Button title="Sign Up" onPress={() => submitForm()}/> */}
                        <Button title="Sign Up" onPress={() => router.push("/my-home")}/>
                    </Pressable>
                </View>
                </ScrollView>
            </View>
        </CreateLayout>
    )
}


const styles = StyleSheet.create({
    container:{
        display: "flex",
        gap: 15
    },
    inputContainer: {
        backgroundColor: '#cbc9c8',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    input: {
        backgroundColor: '#8f8e8e',
        color: '#000000',
        borderRadius: 20,
        padding: 5,
    },
    headerContainer: {
        alignItems: 'center'
    }, 
    addButton: {
        backgroundColor: '#8f8e8e',
        borderRadius: 25,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center'
    },
    addButtonText: {
        fontSize: 25
    },
    button: {
        backgroundColor: '#1c2120',
        color: '#ffffff',
        borderRadius: 10
    },
    header: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50,
    },
    subHeading: {
        color: '#8f8e8e',
        fontSize: 10.5
    }
})