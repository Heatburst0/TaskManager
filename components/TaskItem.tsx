import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Task } from "@/interfaces/interface";

export default function TaskItem({
                                     task,
                                     onToggleComplete,
                                 }: {
    task: Task;
    onToggleComplete: () => void;
}) {
    const router = useRouter();

    const priorityColors = {
        Low: "bg-green-200 text-green-800",
        Medium: "bg-yellow-200 text-yellow-800",
        High: "bg-red-200 text-red-800",
    };

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/CreateTaskScreen",
                    params: { task: JSON.stringify(task) }, // 👈 pass the whole task
                })
            }
        >
            <View className="flex-row items-center rounded-xl p-3 mb-3 bg-white">
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={onToggleComplete}
                    className={`w-6 h-6 border-2 rounded-md mr-3 items-center justify-center ${
                        task.completed ? "bg-indigo-600 border-indigo-600" : "border-gray-400"
                    }`}
                >
                    {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
                </TouchableOpacity>

                {/* Task Info */}
                <View className="flex-1">
                    <Text
                        className={`text-base font-semibold ${
                            task.completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                    >
                        {task.title}
                    </Text>
                    {task.dueDate && (
                        <Text className="text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toDateString()}
                        </Text>
                    )}
                </View>

                {/* Priority Tag */}
                <View className={`px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
                    <Text className="text-sm font-semibold">{task.priority}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
