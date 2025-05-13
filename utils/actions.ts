import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from 'expo-router'
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import * as schema from '@/db/schema';
import { plant, plantType, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useDrizzle } from "@/hooks/useDrizzle";


export async function getPlants(drizzleDb: any, id: string) {
    let allPlants: any[] = []

    const data = await drizzleDb
        .select()
        .from(plantType)
        .where(eq(plantType.userId, Number(id)))
        .orderBy(plantType.potNumber).all();

    if (!data ||data?.length === 0 ) {
        console.error("No plants available");
        Alert.alert("There are no plants available");
        return [];
    }

    for ( let i = 0; i < data?.length; i++ ) {
        const plantData = drizzleDb.select({
            plantName: plant.plantName,
            image: plant.image
        }).from(plant)
        .where(eq(plant.id, Number(data[i].plantId)))
        .all()

        if (plantData === null) {
            console.error("No plants available");
            Alert.alert("No plants available");
            return [];
        }

        allPlants.push({ ...plantData[0], ...data[i] })
    }

    return allPlants;
}

export async function getAuthenticatedUser(drizzleDb: any) {
    const result = await drizzleDb
        .select({
            id: user.id,
            username: user.username,
            email: user.email,
        })
        .from(user)
        .where(eq(user.isLoggedIn, 1))
        .limit(1)
        .all();

    return result.length ? result[0] : null
}

export async function editPlantName(drizzleDb: any, name: string, id: string) {
    const data =  await drizzleDb
        .update(plant)
        .set({ plantName: name})
        .where(eq(plant.id, Number(id)))
        .run()
    
    if (!data) {
        Alert.alert("Unable to edit plant");
    }
}

export async function deletePlant(drizzleDb: any, id: string) {

    const response = await drizzleDb
        .delete(plant)
        .where(eq(plant.id, Number(id)))
        .run()

    await drizzleDb
        .delete(plantType)
        .where(eq(plantType.plantId, Number(id)))
        .run()
    
    
    if (!response) {
        Alert.alert("Unable to delete plant");
    }
}

export async function editPlantType(drizzleDb: any, data){
    const editPlantData = await drizzleDb
        .update(plant)
        .set({
            plantName: data.plantName,
            image: data.image
        }).where(eq(plant.id, data.plantId)).run()

    const editPlantTypeData = await drizzleDb
        .update(plantType)
        .set({
            potNumber: data.potNumber,
            duration: data.duration,
            frequency: data.frequency,
            date: data.date,
        }).where(eq(plantType.plantId, data.plantId)).run() 
    return { editPlantData, editPlantTypeData };
}

export async function editPotNumber(drizzleDb: any, plantName: string, potNumber: number){
    const data = await drizzleDb
        .select()
        .from(plant)
        .where(eq(plant.plantName, plantName))
    
    if (!data) {
        Alert.alert("Unable to get plant name");
        return;
    }

    const plantTypeData = await drizzleDb
        .update(plantType)
        .set({
            potNumber: potNumber
        })
        .where(eq(plantType.plantId, data[0].id))
        .run()

    if (!plantTypeData) {
        Alert.alert("Unable to edit pot number");
        return;
    }
}

export async function addPlantData(drizzleDb: any, data) {
    const plantData = await drizzleDb
        .insert(plant)
        .values({
            plantName: data.plantName, 
            image: data.image
        }).run()

    const plantTypeData = await drizzleDb
        .insert(plantType)
        .values({
            potNumber: data.potNumber,
            frequency: data.frequency,
            duration: data.duration,
            plantId: plantData.lastInsertRowId,
            userId: data.userId,
            date: data.date,
        }).run()
    
    return { plantData, plantTypeData }
}

export async function getDuplicateEmail(drizzleDb: any, email: string) {
    
    const data = await drizzleDb
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1)
        .all();

    return data.length > 0
}

export function isValidEmail(email: string): boolean {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

export function dateWithFrequency(date, frequency) {
    const toAdd = frequency * 60 * 60 * 1000;
    const localDate = new Date(date);
    const updatedTime = new Date(localDate.getTime() + toAdd);
    const localISOString = new Date(updatedTime.getTime() - updatedTime.getTimezoneOffset() * 60000).toISOString().slice(0, -1);

    return localISOString;
}