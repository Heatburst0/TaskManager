import React, { useState } from "react";
import {View, Text, TouchableOpacity, StatusBar, ActivityIndicator} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import {Stack, useRouter} from "expo-router";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        // Reset previous error
        setError(null);
        setLoading(true);
        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Navigate to home or next screen if successful
            router.push("/SignInScreen");
        } catch (err) {
            // @ts-ignore
            setError(err.message);
            console.log(err);
        }finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-1 bg-white justify-center px-6">
                <View className="items-center mb-6">
                    <View className="bg-indigo-500 rounded-2xl p-6 mb-6">
                        <Text className="text-5xl text-white font-bold">✓</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">
                        Let’s get started!
                    </Text>
                </View>

                <InputField label="Email Address" value={email} onChangeText={setEmail} />
                <InputField
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {error && <Text className="text-red-500">{error}</Text>}

                {loading ? (
                    <View className="flex-row justify-center py-3">
                        <ActivityIndicator size="large" color="#4f46e5" />
                    </View>
                ) : (
                    <CustomButton title="Sign Up" onPress={handleSignUp} />
                )}

                <Text className="text-center text-gray-500 mt-4">Or sign up with</Text>

                {/* Social login buttons (Google/Facebook/Apple) */}
                <View className="flex-row justify-center mt-4 gap-6">
                    <View className="bg-blue-600 w-12 h-12 rounded-full" />
                    <View className="bg-red-500 w-12 h-12 rounded-full" />
                    <View className="bg-black w-12 h-12 rounded-full" />
                </View>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500">Already an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/SignInScreen")}>
                        <Text className="text-indigo-500 font-semibold">Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>

    );
}
