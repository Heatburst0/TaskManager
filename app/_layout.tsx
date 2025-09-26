import { Stack } from "expo-router";
import './globals.css'
import {auth} from '@/firebaseConfig';
import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "@firebase/auth";
import {ActivityIndicator, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";


export default function RootLayout() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setInitializing(false);
        });

        return unsubscribe;
    }, []);

    if (initializing) {
        // Show loading while checking auth state
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <Stack>
                {user ? (
                    <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
                ) : (
                    <Stack.Screen name="(auth)/Introscreen" options={{ headerShown: false }} />
                )}
            </Stack>


    );
}
