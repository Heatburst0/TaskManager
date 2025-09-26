import React, { useState } from "react";
import {View, Text, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Stack, useRouter } from "expo-router";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/HomeScreen");
        } catch (err: any) {
            let message = "Something went wrong. Please try again.";

            switch (err.code) {
                case "auth/invalid-email":
                    message = "Invalid email format.";
                    break;
                case "auth/user-not-found":
                    message = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    message = "Incorrect password. Please try again.";
                    break;
                case "auth/too-many-requests":
                    message = "Too many failed attempts. Try again later.";
                    break;
            }

            Alert.alert("Login Failed", message);
            console.log(err);
        } finally {
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
                    <Text className="text-2xl font-bold text-gray-800">Welcome back!</Text>
                </View>

                <InputField label="Email Address" value={email} onChangeText={setEmail} />
                <InputField
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {loading ? (
                    <View className="flex-row justify-center py-3">
                        <ActivityIndicator size="large" color="#4f46e5" />
                    </View>
                ) : (
                    <CustomButton title="Log In" onPress={handleLogin} />
                )}

                <Text className="text-center text-gray-500 mt-4">Or sign in with</Text>

                <SocialLoginButtons />

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
