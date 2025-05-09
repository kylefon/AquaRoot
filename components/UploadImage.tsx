import { supabase } from "@/lib/supabase";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import { FileObject } from '@supabase/storage-js'
import { decode } from 'base64-arraybuffer'
import { useUserContext } from "@/context/UserContext";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import { Camera, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import ImageItem from "./ImageItem";


export default function UploadImage({ setImage }) {
    const {user} = useUserContext();
    const [ files, setFiles ] = useState<string>("");

    const onSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true
        });

        if (!result.canceled) {
            const img = result.assets[0];
            const extension = img.uri.split('.').pop();
            const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
            const filePath = `${user!.id}/${Date.now()}.${extension}`;
            const contentType = `image/${extension}`;

            const { error } = await supabase.storage.from('plantimage').upload(filePath, decode(base64), { contentType })

            if ( error ) {
                Alert.alert(`Upload failed: ${error}`);
                return;
            }

            const { data } = supabase.storage.from('plantimage').getPublicUrl(filePath);
            if (data?.publicUrl) {
                const finalUrl = `${data.publicUrl}?v=${Date.now()}`;
                setFiles(finalUrl);                
                setImage(finalUrl);
            }   
        }
    }

    const onRemoveImage = async () => {
        if (!files) return;

        const imagePath = files.split("/plantimage/")[1].split("?")[0];

        const { error } = await supabase.storage.from('plantimage').remove([imagePath]);

        if ( error ) {
            Alert.alert(`Delete failed: ${error}`);
            return;
        }
        
        setFiles("");
        setImage("");
    }

    return(
        <View>
            {files ? (
                <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', justifyContent: 'space-between',gap: 5 }}>
                    <Image style={{ width: 80, height: 80 }} source={{ uri: files }} />
                    <TouchableOpacity onPress={onRemoveImage}>
                        <Trash2 color="red"/>
                    </TouchableOpacity>
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