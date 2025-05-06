import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";

export async function getPlants(id: string) {
    let allPlants: any[] = []

    const { data, error } = await supabase
        .from('plantType')
        .select("userId, plantId, duration, frequency, potNumber, time, date" )
        .eq("userId",id);

    if (error) {
        Alert.alert("Error getting plant types");
        return [];
    }

    if (data?.length === 0 ) {
        Alert.alert("There are no plants available");
        return [];
    }

    for ( let i = 0; i < data?.length; i++ ) {
        const { data: plantData, error: plantError } = await supabase.from('plant').select("plantName").eq("id", data?.[i].plantId);

        if (plantData === null || data === null) {
            Alert.alert("No plants available");
            return [];
        }

        allPlants.push({ ...plantData[0], ...data[i] })
    }

    return allPlants;
}