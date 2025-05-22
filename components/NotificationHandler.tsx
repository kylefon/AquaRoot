// components/NotificationHandler.tsx
import { useDrizzle } from '@/hooks/useDrizzle';
import { dateWithFrequency, editDate } from '@/utils/actions';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function NotificationHandler() {
  // currently not in use and can be deleted once PlantDataToESP and notifESP works

  const drizzleDb = useDrizzle();

  // const { refreshNotifications } = useNotifications();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(async notification => {
      const notifData = notification.request?.content?.dataString;

      if (!notifData) {
        console.log("Notification received but data is undefined, ignoring...");
        return;
      }

      try {
        const { date, plantId, frequency } = JSON.parse(notifData)
        if (!date || !plantId) return;

        console.log("🌱 Parsed values:", { date, plantId, frequency });

        // const frequencyInSeconds = Number(frequency) * 60 * 60;

        const newDate = dateWithFrequency(date, Number(frequency));
        await editDate(drizzleDb, newDate, Number(plantId));

        // await Notifications.scheduleNotificationAsync({
        //   content: {
        //       title: `Recurring Watering`,
        //       body: `Water ${plantId} again!`,
        //       data: { plantId: plantId, frequency: frequency }
        //     },
        //     trigger: {
        //       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        //       seconds: frequencyInSeconds,
        //       repeats: true
        //     }
        //   });

        // await refreshNotifications(drizzleDb);

          console.log("✅ Set up recurring watering every", frequency, "hours");      
        } catch (err) {
            console.error("Failed to parse notification data: ", err);
          }
        });

    return () => subscription.remove();
  }, [drizzleDb]);

  return null;
}
