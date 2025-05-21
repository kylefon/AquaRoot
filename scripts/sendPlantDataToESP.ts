import { plantType, user } from "@/db/schema";
import { useDrizzle } from "@/hooks/useDrizzle";
import { eq } from "drizzle-orm";

export async function sendPlantDataToESP() {
    const drizzleDb = useDrizzle();

    try {
        const result = await drizzleDb
            .select({ id: user.id })
            .from(user)
            .where(eq(user.isLoggedIn, 1));

        if (!result || result.length === 0) throw new Error("There is no user logged in");

        const plantData = await drizzleDb.select().from(plantType).where(eq(plantType.userId, result[0].id));

        if (!plantData) throw new Error("There are no plants for that user");

        // change to esp32 ip add
        const response = await fetch("http://<ESP32_IP_ADDRESS>/plants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(plantData),
        });

        if (!response.ok) throw new Error("ESP32 responded with an error");

        const resJson = await response.json();
        console.log("ESP32 Response: ", resJson);

        return true;
    } catch (err) {
        console.error("Failed to send data to ESP32", err);
        return false;
    }
}