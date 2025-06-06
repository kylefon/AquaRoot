import { useDrizzle } from "@/hooks/useDrizzle";
import { addWaterUsage, dateWithFrequency, editDate } from "@/utils/actions";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import { sendPlantDataToESP } from "./sendPlantDataToESP";

export default function NotifESP() {

    const drizzleDb = useDrizzle();

    // poll for every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // change to esp32 ip add
                const response = await fetch("http://<ESP32_IP_ADDRESS>/data");
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        // change based on esp32 info
                        Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Plant at pot ${data.potNumber}`,
                                body: `${data.plantName} is being watered`,
                            },
                            trigger: null,
                        });
                        const newDate = dateWithFrequency(data.date, Number(data.frequency))
                        await editDate(drizzleDb, newDate, Number(data.plantId));

                        const newWaterUsage = Number((data.duration * 0.001149).toFixed(2)) + data.waterUsage;
                        await addWaterUsage(drizzleDb, newWaterUsage, data.plantId);
                        
                        const success = await sendPlantDataToESP();
                        if (!success) Alert.alert("Warning", "Failed to sync plant with ESP32")
                    }
                }
            } catch ( error ) {
                console.error("Failed to fetch from ESP32", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    
    return null;
}