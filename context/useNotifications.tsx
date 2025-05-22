import { getAuthenticatedUser, getPlants } from "@/utils/actions";
import * as Notifications from "expo-notifications";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";

//reference: https://dev.to/walter_bloggins/local-notifications-in-expo-2p47

interface NotificationContextType {
  scheduleNotificationAsync: (
    params: {
      request: Notifications.NotificationRequestInput;
      plantId: number;
      date: string;
      frequency: number;
    }
  ) => Promise<void>;
  // refreshNotifications: () => Promise<void>;
}


const NotificationsContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const configureNotificationsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        return console.warn("⚠️ Notification Permissions not granted!");
      }         
      Notifications.setNotificationHandler({
          handleNotification: async () => ({
              shouldPlaySound: false,
              shouldSetBadge: false,
              shouldShowBanner: true,
              shouldShowList: true,
            }),
          });
          console.log("Notification Permissions granted!");
    };
    configureNotificationsAsync();
  }, []);

// const refreshNotifications = async (drizzleDb: any) => {
//   const user = await getAuthenticatedUser(drizzleDb);
//   const plantData = await getPlants(drizzleDb, user.id);
//   if (!plantData) return;
//   if (plantData?.length > 0) {
//     for (const plant of plantData) {
//       await ScheduleNotification(plant, scheduleNotificationAsync, drizzleDb);
//     }
//   }
// };

const scheduledNotificationsRef = useRef<Record<number, { id: string; date: string }>>({});
    const scheduleNotificationAsync = async ({
        request,
        plantId,
        date,
        frequency
    }: {
        request: Notifications.NotificationRequestInput;
        plantId: number;
        date: string;
        frequency: number;
    }) => {
      const existing = scheduledNotificationsRef.current[plantId];
      if (existing && existing.date === date) {
        console.log(`⏭️ Skipping rescheduling for plant ${plantId} - no change in date`);
        return;    
      } 

      if (existing) {
        console.log(`🔁 Date changed - canceling previous notification for plant ${plantId}`);
        await Notifications.cancelScheduledNotificationAsync(existing.id);
      }

      const newId = await Notifications.scheduleNotificationAsync(request);
      scheduledNotificationsRef.current[plantId] = { id: newId, date };

      console.log("✍️ Scheduling notification: ", scheduledNotificationsRef.current);
    };

  // const cancelNotificationAsync = async () => {
  //   console.log(
  //     "🗑️ Canceling notification: ",
  //     scheduledNotificationsRef.current
  //   );
  //   await Notifications.cancelScheduledNotificationAsync(
  //     scheduledNotificationsRef.current
  //   );
  //   scheduledNotificationsRef.current = "";
  // };

  const value = { scheduleNotificationAsync };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be called from within a NotificationProvider!"
    );
  }

  return context;
};

export { NotificationsProvider, useNotifications };
