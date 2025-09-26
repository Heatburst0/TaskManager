import { images } from "@/constants/images";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

export default function SocialLoginButtons() {
    return (
        <View className="flex-row justify-center mt-4 space-x-6">
            {/* Google */}
            <TouchableOpacity>
                <View className="bg-red-500 w-20 h-20 rounded-full items-center justify-center mr-5">
                    <Image
                        source={images.googleImage}
                        className="w-7 h-7"
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity>
                <View className="bg-blue-600 w-20 h-20 rounded-full items-center justify-center">
                    <Image
                        source={images.facebookImage}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity>
                <View className="bg-black w-20 h-20 rounded-full items-center justify-center ml-5">
                    <Image
                        source={images.appleImage}
                        className="w-7 h-7"
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}
