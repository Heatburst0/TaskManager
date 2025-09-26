import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TaskItem({
                                     title,
                                     dueDate,
                                     priority,
                                     completed,
                                     onToggleComplete,
                                 }: {
    title: string;
    dueDate: Date | null;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
    onToggleComplete: () => void;
}) {
    const priorityColors = {
        Low: "bg-green-200 text-green-800",
        Medium: "bg-yellow-200 text-yellow-800",
        High: "bg-red-200 text-red-800",
    };

    return (
        <View className="flex-row items-center rounded-xl p-3 mb-3 bg-white">
            {/* Checkbox */}
            <TouchableOpacity
                onPress={onToggleComplete}
                className={`w-6 h-6 border-2 rounded-md mr-3 items-center justify-center ${
                    completed ? "bg-indigo-600 border-indigo-600" : "border-gray-400"
                }`}
            >
                {completed && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>

            {/* Task Info */}
            <View className="flex-1">
                <Text className={`text-base font-semibold ${completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {title}
                </Text>
                <Text className="text-sm text-gray-500">Due: {dueDate!!.toDateString()}</Text>
            </View>

            {/* Priority Tag */}
            <View className={`px-3 py-1 rounded-full ${priorityColors[priority]}`}>
                <Text className="text-sm font-semibold">{priority}</Text>
            </View>
        </View>
    );
}
