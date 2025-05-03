import CustomDrawer from '@/components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { Bell, CircleUser, House, Pencil } from 'lucide-react-native';

export default function MyHomeLayout() {
  return (
  <Drawer screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen
        name='profile' 
        options={{
            drawerLabel: 'Profile',
            drawerIcon: ({ size, color }) => (
                <CircleUser size={size} color={color} />
            ),
            drawerItemStyle: { display: 'none' }
        }}
    />
    <Drawer.Screen
        name='index' 
        options={{
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => (
                <House size={size} color={color} />
            ),
            drawerLabelStyle: {
                fontSize: 20
            }
        }}
    />
    <Drawer.Screen
        name='notification' 
        options={{
            drawerLabel: 'Customize Notification',
            drawerIcon: ({ size, color }) => (
                <Bell size={size} color={color} />
            ),
            drawerLabelStyle: {
                fontSize: 20
            }
        }}
    />
    <Drawer.Screen
        name='application' 
        options={{
            drawerLabel: 'Customize Application',
            drawerIcon: ({ size, color }) => (
                <Pencil size={size} color={color} />
            ),
            drawerLabelStyle: {
                fontSize: 20
            }
        }}
    />
  </Drawer>
  );
}
