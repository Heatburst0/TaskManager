import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function CustomButton({ title, onPress } : {title: string, onPress: () => void}) {
    return (
        <TouchableOpacity
            className="bg-indigo-500 rounded-xl py-4 items-center mt-2"
            onPress={onPress}
        >
            <Text className="text-white text-lg font-semibold">{title}</Text>
        </TouchableOpacity>
    );
}
