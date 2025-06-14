import { AuthenticatedUser } from "@/types/models";
import { getAuthenticatedUser } from "@/utils/actions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function CustomDrawer(props: any) {
    const router = useRouter();

    const [ userData, setUserData ] = useState<AuthenticatedUser>();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                Alert.alert("Error fetching user data");
            }
        };

        fetchUser();
    }, []);

    const signOutUser = async () => {
        const userData = await getAuthenticatedUser();
        try {
            const response = await fetch('http://192.168.68.50/users/signout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userData.userId })
            });

            if (response.ok) {
                router.push('/');
            } else {
                Alert.alert("Unable to signout")
            }
        } catch (err) {
            Alert.alert("Unexpected error on signout");
            console.error(err);
        }
    };

     
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#3c4b2b', height: '100%'}} scrollEnabled={false}>
                <View style={styles.content}>
                    <View style={styles.profile}>
                        <DrawerItem 
                            label={`Hi ${userData?.username}!` || 'Profile'} 
                            onPress={() => router.replace('/my-home/profile')}
                            icon={({size,color})=> <MaterialIcons name="account-circle" size={size} color={color} />}
                            labelStyle={{fontSize: 20}}
                        />
                        <View>
                            <DrawerItemList {...props} />
                        </View>
                    </View>
                    <View> 
                        <DrawerItem label={`About Us`} onPress={() => router.replace('/my-home/about-us')} icon={({ size, color }) => <MaterialIcons name="groups" size={size} color={color}/>} />
                        <DrawerItem label={'Logout'} onPress={() => signOutUser()}/>
                    </View>
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        height: '100%',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    profile: {
        gap: 80
    },
    label: {
        fontSize: 20
    }
})