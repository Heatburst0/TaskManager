import React from "react";
import {TouchableOpacity, Text, View} from "react-native";

export default function CustomButton({
                                         title,
                                         onPress,
                                         icon,
                                     }: {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-center bg-indigo-500 rounded-xl mt-3 py-4 px-6"
        >
            <Text className="text-white font-semibold text-lg mr-2">{title}</Text>
            {icon && <View>{icon}</View>}
        </TouchableOpacity>
    );
}
