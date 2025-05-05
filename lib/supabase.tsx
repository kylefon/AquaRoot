import 'react-native-url-polyfill/auto';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Alert, AppState } from "react-native";

const supabaseUrl =process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey =process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
    Alert.alert("No supabase environment variables");
}

export const supabase = createClient(supabaseUrl , supabaseAnonKey , {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // debug: true
    }
})
