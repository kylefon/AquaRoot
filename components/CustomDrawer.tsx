import { useUserContext } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { UserCircle } from "lucide-react-native";
import { Alert, StyleSheet, View } from "react-native";

export default function CustomDrawer(props: any) {
    const router = useRouter();

    const user = useUserContext();

    const signOutUser = async () => {
        const { error } = await supabase.auth.signOut();

        if ( error ) {
            Alert.alert("Error signing out user");
        } 
    }
     
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#3c4b2b', height: '100%'}} scrollEnabled={false}>
                <View style={styles.content}>
                    <View style={styles.profile}>
                        <DrawerItem 
                            label={`Hi ${user?.email}!` || 'Profile'} 
                            onPress={() => router.replace('/my-home/profile')}
                            icon={({size,color})=> <UserCircle size={size} color={color} />}
                            labelStyle={{fontSize: 20}}
                        />
                        <View>
                            <DrawerItemList {...props} />
                        </View>
                    </View>
                    <View> 
                        <DrawerItem label={'About Us'} onPress={() => router.replace('/')}/>
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