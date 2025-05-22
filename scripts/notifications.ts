import { GetPlantData } from "@/types/models";
import { convertUTCStringToLocalDate } from "@/utils/actions";
export async function ScheduleNotification(plant: GetPlantData, scheduleNotificationAsync: any, drizzleDb: any) {
    // notification test without ESP32 fetch
    // currently not in use and can be deleted once PlantDataToESP and notifESP works

    const now = new Date();

    if (!plant.date) return;

    const scheduledDate = convertUTCStringToLocalDate(plant.date);

    // Don't schedule if date is in the past
    if (scheduledDate.getTime() <= now.getTime()) {
        console.log(`Skipping notification for ${plant.plantName} because the date is in the past.`);
        return;
    }

    try {

        // if (plant.notificationId) {
        //     await Notifications.cancelScheduledNotificationAsync(plant.notificationId);
        //     console.log(`⛔ Cancelled existing notification with ID ${plant.notificationId}`);
        // }

        const notificationId = await scheduleNotificationAsync({
            request: {
                content: {
                    title: `Plant at ${plant.potNumber}`,
                    body: `${plant.plantName} is being watered!`,
                    data: {
                        plantId: plant.plantId,
                        date: plant.date,
                        frequency: plant.frequency ?? 24
                    }
                },
                trigger: {
                    type: "date",
                    date: scheduledDate
            }},
            plantId: plant.plantId,
            date: plant.date,
            frequency: plant.frequency
        });

        // await drizzleDb.update(plantType).set({ notificationId: notificationId }).where(eq(plantType.plantId, plant.plantId))
        
        console.log(`✅ Notification scheduled for ${plant.plantName} with ID: ${notificationId}`);
    } catch (err) {
        console.error("Failed to schedule notification: ", err);
    }

}
