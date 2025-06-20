import { useDrizzle } from "@/hooks/useDrizzle";
import { getAuthenticatedUser } from "@/utils/actions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UploadImage({ setImage }: { setImage: any }) {
    const [ files, setFiles ] = useState<string>("");

    const drizzleDb = useDrizzle();

    const onSelectImage = async () => {
        const user = await getAuthenticatedUser();

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true
        });

        if (!result.canceled) {
            const img = result.assets[0];
            const extension = img.uri.split('.').pop() || 'jpg';
            const userFolder = `${user!.userId}`;
            const destDir = FileSystem.documentDirectory + `images/${userFolder}`;
            const filePath = `${Date.now()}.${extension}`;
            const newPath = destDir + filePath;

                try {
                    await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
                    const cachedPath = FileSystem.cacheDirectory + filePath;
                    await FileSystem.copyAsync({ from: img.uri, to: cachedPath });
                    await FileSystem.moveAsync({ from: cachedPath, to: newPath });

                    setFiles(newPath);
                    setImage(newPath);

                } catch (err: any) {
                    Alert.alert("Error saving image locally: ", err.message);
                }
            }
        }

    return(
        <View>
            {files ? (
                <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', justifyContent: 'space-between',gap: 5 }}>
                    <Image style={{ width: 80, height: 80 }} source={{ uri: files }} />
                </View>                
            ) : null }

            <TouchableOpacity onPress={onSelectImage}>
                <View style={styles.upload}>
                    <MaterialIcons name="photo-camera"  size={25}/>
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