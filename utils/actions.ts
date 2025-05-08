import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from 'expo-router'

export async function getPlants(id: string) {
    let allPlants: any[] = []

    const { data, error } = await supabase
        .from('plantType')
        .select("id, userId, plantId, duration, frequency, potNumber, date" )
        .eq("userId",id)
        .order('potNumber');

    if (error) {
        Alert.alert("Error getting plant types");
        return [];
    }

    if (data?.length === 0 ) {
        Alert.alert("There are no plants available");
        return [];
    }

    for ( let i = 0; i < data?.length; i++ ) {
        const { data: plantData, error: plantError } = await supabase
            .from('plant')
            .select("plantName").eq("id", data?.[i].plantId);

        if (plantData === null || data === null) {
            Alert.alert("No plants available");
            return [];
        }

        allPlants.push({ ...plantData[0], ...data[i] })
    }

    return allPlants;
}

export async function getAuthenticatedUser() {
    const router = useRouter()
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        Alert.alert("The user is not logged in");
        router.replace("/sign-in");
        return;
    }
    
    return user
}

export async function editPlantName(name: string, id: string) {
    const { error } = await supabase
        .from('plant')
        .update({
            plantName: name
        })
        .eq('id', id)
    
    if (error) {
        Alert.alert("Unable to edit plant");
    }
}

export async function deletePlant(id: string) {
    const response = await supabase
        .from('plant')
        .delete()
        .eq('id', id)
    
    if (!response) {
        Alert.alert("Unable to delete plant");
    }
}

export async function editPlantType(data){
    const { error } = await supabase
        .from('plant')
        .update({
            plantName: data.plantName,
        }).eq('id', data.plantId)
    
    const { error: plantError } = await supabase
        .from('plantType')
        .update({
            potNumber: data.potNumber,
            duration: data.duration,
            frequency: data.frequency,
            date: data.date,
        }).eq('plantId', data.plantId)
    
    return { error, plantError };
}

export async function editPotNumber(plantName: string, potNumber: number){
    const { data, error } = await supabase
        .from('plant').select().eq('plantName', plantName)
    
    if (error) {
        Alert.alert("Unable to get plant name");
        return;
    }

    const { error: plantTypeError } = await supabase
        .from('plantType').update({potNumber: potNumber}).eq("plantId", data[0].id)

    if (plantTypeError) {
        Alert.alert("Unable to edit pot number");
        return;
    }
}

export async function addPlantData(data) {
    const { data: plantData, error } = await supabase
        .from('plant')
        .insert({ plantName: data.plantName })
        .select()
    
    const { error: plantTypeError } = await supabase
        .from('plantType')
        .insert({
            potNumber: data.potNumber,
            frequency: data.frequency,
            duration: data.duration,
            plantId: plantData?.[0]?.id,
            userId: data.userId,
            date: data.date,
        })
    
    return { error, plantTypeError }
}

export async function getPotNumbers(userId) {
    const { data, error } = await supabase
        .from('plantType')
        .select("potNumber")
        .eq("userId", userId)

    return { data, error }
}