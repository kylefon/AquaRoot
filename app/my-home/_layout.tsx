import CustomDrawer from '@/components/CustomDrawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Drawer } from 'expo-router/drawer';

export default function MyHomeLayout() {
  return (
  <Drawer screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen
        name='profile' 
        options={{
            drawerLabel: 'Profile',
            drawerIcon: ({ size, color }) => (
                <MaterialIcons name="account-circle" size={size} color={color} />
            ),
            drawerItemStyle: { display: 'none' }
        }}
    />
    <Drawer.Screen
        name='about-us' 
        options={{
            drawerLabel: 'About Us',
            drawerIcon: ({ size, color }) => (
                <MaterialIcons name="account-circle" size={size} color={color} />
            ),
            drawerItemStyle: { display: 'none' }
        }}
    />
    <Drawer.Screen
        name='index' 
        options={{
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => (
                <MaterialIcons name="home" size={size} color={color} />
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
                <MaterialIcons name="notifications" size={size} color={color} />
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
                <MaterialIcons name="edit" size={size} color={color} />
            ),
            drawerLabelStyle: {
                fontSize: 20
            }
        }}
    />
  </Drawer>
  );
}
