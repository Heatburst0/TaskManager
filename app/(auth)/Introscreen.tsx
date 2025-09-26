import {View, Text} from 'react-native'
import React from 'react';
import {useRouter} from "expo-router";
import CustomButton from "@/components/CustomButton";
import {Ionicons} from "@expo/vector-icons";

const Introscreen = () => {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white justify-between items-center p-6">
            <View className="flex-1 justify-center items-center">
                {/* Logo Image instead of tick block */}
                <View className="items-center mb-6">
                    <View className="bg-indigo-500 rounded-2xl p-6 mb-6">
                        <Text className="text-5xl text-white font-bold">✓</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-800">Task Manager!</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                    Get things done.
                </Text>
                <Text className="text-gray-500 mt-2 text-center">
                    Just a click away from planning your tasks.
                </Text>
            </View>

            <CustomButton
                title="Let’s get started"
                onPress={() => router.replace("/SignUpScreen")}
                icon={<Ionicons name="arrow-forward" size={20} color="white" />} // 👈 white arrow
            />
        </View>
    );
}
export default Introscreen
