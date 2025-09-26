import React, {useState} from "react";
import {TextInput, View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";


export default function InputField({ label, secureTextEntry=false, ...props }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = secureTextEntry;

    return (
        <View className="w-full mb-4">
            <Text className="text-gray-700 font-medium mb-1">{label}</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
                <TextInput
                    className="flex-1 py-3 text-base"
                    placeholderTextColor="#aaa"
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={22}
                            color="gray"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

