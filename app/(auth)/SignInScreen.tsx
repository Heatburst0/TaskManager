import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Stack, useRouter } from "expo-router";

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true); // Start loading

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res);
            // Navigate to home after successful login
            router.replace("/CreateTaskScreen");
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false); // Stop loading in both success and error
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
                    <Text className="text-2xl font-bold text-gray-800">Welcome back!</Text>
                </View>

                <InputField label="Email Address" value={email} onChangeText={setEmail} />
                <InputField
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {error && <Text className="text-red-500 mb-2">{error}</Text>}

                {/* Show loader instead of button when loading */}
                {loading ? (
                    <View className="flex-row justify-center py-3">
                        <ActivityIndicator size="large" color="#4f46e5" />
                    </View>
                ) : (
                    <CustomButton title="Log In" onPress={handleLogin} />
                )}

                <Text className="text-center text-gray-500 mt-4">Or sign in with</Text>

                <View className="flex-row justify-center mt-4 space-x-6">
                    <View className="bg-blue-600 w-12 h-12 rounded-full" />
                    <View className="bg-red-500 w-12 h-12 rounded-full" />
                    <View className="bg-black w-12 h-12 rounded-full" />
                </View>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-500">Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
                        <Text className="text-indigo-500 font-semibold">Get Started!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
