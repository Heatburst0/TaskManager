import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import {Stack} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");

    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log Out",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut(auth);
                        Alert.alert("Success", "You have logged out.");
                        navigation.navigate("(auth)/Introscreen" as never);
                    } catch (error: any) {
                        Alert.alert("Error", error.message);
                    }
                },
            },
        ]);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-white px-5 pt-2">
                {/* Header */}
                <View className="flex-row items-center mb-6 mt-5">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    <Text className="text-lg font-semibold flex-1">Profile</Text>

                    {/* placeholder for balance */}
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Icon */}
                <View className="items-center mt-6 mb-10">
                    <View className="w-28 h-28 rounded-full bg-indigo-200 items-center justify-center">
                        <Ionicons name="person" size={60} color="white" />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    {/* Email */}
                    <InputField
                        label="Email ID"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Phone */}
                    <InputField
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                {/* Logout Button */}
                <View className="mb-6">
                    <CustomButton title="Log Out" onPress={handleLogout} />
                </View>
            </SafeAreaView>
        </>

    );
}
