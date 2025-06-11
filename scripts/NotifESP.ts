import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import { sendPlantDataToESP } from "./sendPlantDataToESP";

export default function NotifESP() {
    // poll for every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // change to esp32 ip add
                //Should return { shouldNotify: boolean, potNumber: number, plantName: string }
                const response = await fetch("http://<ESP32_IP_ADDRESS>/notify");

                if (!response.ok) return;

                const data = await response.json();

                if (data?.shouldNotify) {
                    // change based on esp32 info
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: `Plant at pot ${data.potNumber}`,
                            body: `${data.plantName} is being watered`,
                        },
                        trigger: null,
                    });
                }
            } catch ( error ) {
                console.error("Failed to fetch from ESP32", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    
    return null;
}