import React, { useState } from "react";
import {View, Text, TouchableOpacity, StatusBar, ActivityIndicator, Alert} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import {Stack, useRouter} from "expo-router";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);

        // Basic validation
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/SignInScreen");
        } catch (err: any) {
            let message = "Something went wrong. Please try again.";

            switch (err.code) {
                case "auth/invalid-email":
                    message = "Invalid email format.";
                    break;
                case "auth/email-already-in-use":
                    message = "This email is already registered.";
                    break;
                case "auth/weak-password":
                    message = "Password should be at least 6 characters.";
                    break;
            }
            Alert.alert("Sign Up Failed", message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-1 bg-white justify-center px-6">
                {/* Header */}
                <View className="items-center mb-6">
                    <View className="bg-indigo-500 rounded-2xl p-6 mb-6">
                        <Text className="text-5xl text-white font-bold">✓</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">
                        Let’s get started!
                    </Text>
                </View>

                {/* Inputs */}
                <InputField label="Email Address" value={email} onChangeText={setEmail} />
                <InputField
                    label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Button */}
                {loading ? (
                    <View className="flex-row justify-center py-3">
                        <ActivityIndicator size="large" color="#4f46e5" />
                    </View>
                ) : (
                    <CustomButton title="Sign Up" onPress={handleSignUp} />
                )}

                {/* Social logins */}
                <Text className="text-center text-gray-500 mt-4">Or sign up with</Text>
                <SocialLoginButtons />

                {/* Redirect */}
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
