import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { useUserContext } from "@/context/UserContext";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import { Camera, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { plant, plantType } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useDrizzle } from "@/hooks/useDrizzle";
import { getAuthenticatedUser } from "@/utils/actions";


export default function UploadImage({ setImage }) {
    const [ files, setFiles ] = useState<string>("");

    const drizzleDb = useDrizzle();

    const onSelectImage = async () => {
        const user = await getAuthenticatedUser(drizzleDb);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true
        });

        if (!result.canceled) {
            const img = result.assets[0];
            const extension = img.uri.split('.').pop();
            const destDir = FileSystem.documentDirectory + "images/";
            const filePath = `${user!.id}/${Date.now()}.${extension}`;
            const newPath = destDir + filePath;

                try {
                    await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
                    await FileSystem.copyAsync({ from: img.uri, to: newPath });

                    setFiles(newPath);
                    setImage(newPath);

                } catch (err) {
                    Alert.alert("Error saving image locally: ", err.message);
                }
            }
        }

    // const onRemoveImage = async () => {
    //     if (!files) return;

    //     try {
    //         await FileSystem.deleteAsync(files, { idempotent: true });
    //         setFiles("");
    //         setImage("");

    //         if (plantId) {
    //             await drizzleDb.update(plant)
    //                 .set({ image: null})
    //                 .where(eq(plant.id, plantId))
    //                 .run()
    //         }
    //     } catch (err) {
    //         Alert.alert("Error removing image: ", err.message);
    //     }
    // }

    return(
        <View>
            {files ? (
                <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', justifyContent: 'space-between',gap: 5 }}>
                    <Image style={{ width: 80, height: 80 }} source={{ uri: files }} />
                    {/* <TouchableOpacity onPress={onRemoveImage}>
                        <Trash2 color="red"/>
                    </TouchableOpacity> */}
                </View>                
            ) : null }

            <TouchableOpacity onPress={onSelectImage}>
                <View style={styles.upload}>
                    <Camera/>
                    <Text style={{ fontWeight: "bold"}} >Upload Image</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    upload: {
        flexDirection: 'row', 
        gap: 5, 
        alignItems: "center", 
        backgroundColor: "#ffffff", 
        padding: 8, 
        justifyContent: "center", 
        borderRadius: 20
    }
})