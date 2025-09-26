import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react';
import {useRouter} from "expo-router";
import ArrowRight from "@/components/ArrowRight";
import {images} from"@/constants/images"

const Introscreen = () => {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white justify-between items-center p-6">
            <View className="flex-1 justify-center items-center">
                {/* Logo Image instead of tick block */}
                <Image
                    source={images.sampleImage}
                    className={"w-32 h-32 mb-6"}
                    resizeMode={"contain"}
                    />
                <Text className="text-2xl font-bold text-gray-800">
                    Get things done.
                </Text>
                <Text className="text-gray-500 mt-2 text-center">
                    Just a click away from planning your tasks.
                </Text>
            </View>

            <TouchableOpacity
                className="bg-indigo-500 rounded-full p-5 mb-10 self-end"
                onPress={() => router.push("/SignUpScreen")} // expo-router navigation
            >
                <ArrowRight/>
            </TouchableOpacity>
        </View>
    );
}
export default Introscreen
