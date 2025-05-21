import { SQLiteColumn } from "drizzle-orm/sqlite-core";

export type UserData = {
    id: number;
    created_at: Date | null;
    username: string;
    email: string;
    password: string;
    isLoggedIn: number | null;
};

export type PlantData = {
    id: number;
    created_at: Date | null;
    plantName: string;
    image: string | null;
}

export type PlantTypeData = {
    id: number;
    created_at: Date | null;
    potNumber: number;
    frequency: number;
    duration: number;
    plantId: number;
    userId: number;
    waterUsage: number | null;
    date: string | null;
}

export type GetPlantData = {
    id: number | null;
    created_at: Date | null;
    potNumber: number;
    frequency: number;
    duration: number;
    plantId: number;
    userId: number;
    waterUsage: number | null;
    date: string | null;
    plantName: string;
    image: string | null;
    notificationId: string | null;
}

export type AuthenticatedUser = { 
    id: number,
    username: string,
    email: string            
}

export type NewPlantData = {
    plantName: string;
    potNumber: number;
    frequency: number;
    duration: number;
    userId: number;
    date: string;
    image: string;
}