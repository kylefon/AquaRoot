import { plant, plantType, user } from "@/db/schema";
import { GetPlantData, NewPlantData } from "@/types/models";
import { eq } from "drizzle-orm";
import { Alert } from "react-native";


export async function getPlants(id: string) {
    try {
        const response = await fetch(`http://<ESP32-IP>/plants/getUserPlants?userId=${id}`)
        if (!response.ok) {
            throw new Error('Failed to fetch plants');
        }

        const result = await response.json();

        if (result.data === null) {
            Alert.alert("No plants found");
            return null;
        }

        if (Array.isArray(result.data) && result.data.length === 0 ) {
            Alert.alert("No plants available");
            return [];
        }

        return result.data;
    } catch (err) {
        console.error("Error fetching plants: ", err);
        Alert.alert("Error" , "unable to fetch platnts");
        return [];
    } 
}

export async function getAuthenticatedUser() {
    try { 
        const response = await fetch(`http://<ESP32-IP>/users/getLoggedUser`)
        if (!response.ok) {
            throw new Error("Failed to fetch logged-in user");
        }

        const result = await response.json();

        return result.data;
    } catch (err) {
        console.error("Error getting authenticated user: ", err);
        Alert.alert("Error", "Unable to retrieve logged-in user");
        return null;
    }
}

export async function editPlantName(name: string, id: number) {
    try {
        const response = await fetch(`http://<ESP32-IP>/plants/editName`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name })
        })

        if (!response.ok) {
            throw new Error("Failed to update plant name");
        }

        const result = await response.json();

        if (!result.success) {
            Alert.alert("Error", "Unable to edit plant name");
        }
    } catch (err) {
        console.error("Error editing plant name:", err);
        Alert.alert("Error", "Could not edit plant name");
    }
}

export async function deletePlant(id: number) {
    try {
        const response = await fetch(`http://<ESP32-IP>/plants/delete?=id=${id}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error("Failed to delete plant");
        }

        const result = await response.json();

        if (!result.success) {
            Alert.alert("Unable to delete app");
        }
    } catch (err) {
        console.error("Error deleting plant:", err);
        Alert.alert("Error", "Could not delete plant");
    }
    
}

export async function editPlantType(drizzleDb: any, data: GetPlantData){
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

export async function editPotNumber(plantName: string, potNumber: number) {
    try {
        const response = await fetch(`http://<ESP32-IP>/pots/editPotNumber`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ plantName, potNumber })
        });

        const result = await response.json();

        if (!result.success) {
            Alert.alert("Error", "Unable to update pot number");
        }
    } catch (err) {
        console.error("Error updating pot number:", err);
        Alert.alert("Error", "Could not update pot number");
    }
}

export async function addPlantData(drizzleDb: any, data: NewPlantData) {
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

export function dateWithFrequency(date: string, frequency: number) {
    const toAdd = frequency * 60 * 60 * 1000;
    const localDate = new Date(date);
    const updatedTime = new Date(localDate.getTime() + toAdd);
    const localISOString = new Date(updatedTime.getTime() - updatedTime.getTimezoneOffset() * 60000).toISOString().slice(0, -1);

    return localISOString;
}

export async function editDate(drizzleDb: any, date: string, plantId: number) {
    const result = await drizzleDb
        .update(plantType)
        .set({
            date: date
        })
        .where(eq(plantType.plantId, plantId)).run();
    return result;
}

export function convertUTCStringToLocalDate(utcString: string): Date {
  const utcDate = new Date(utcString);
  const localTimeMillis = utcDate.getTime();
  return new Date(localTimeMillis);
}

export async function addWaterUsage(drizzleDb: any, newWaterUsage: number, plantId: number) {
    const getUsage = await drizzleDb.set({
        waterUsage: newWaterUsage
    }).where(eq( plantType.plantId, plantId )).run();

    if (!getUsage) {
        Alert.alert("Failed to update water usage");
    }
}