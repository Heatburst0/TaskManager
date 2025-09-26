import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import InputField from "../components/InputField";
import {SafeAreaView} from "react-native-safe-area-context";
import {getAuth} from "@firebase/auth";
import CustomButton from "@/components/CustomButton";
import {Task} from "@/interfaces/interface";

export default function CreateTaskScreen() {
    const navigation = useNavigation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [completed, setCompleted] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("Validation", "Please enter a title.");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Error", "No user is signed in.");
                return;
            }

            // Define the task using your interface (except id)
            const newTask: Omit<Task, "id"> = {
                title,
                description,
                dueDate,
                priority,
                completed,
                createdAt: Timestamp.fromDate(new Date()),
            };

            await addDoc(collection(db, "users", user.uid, "tasks"), {
                ...newTask,
                dueDate: dueDate ? Timestamp.fromDate(dueDate) : null, // keep Firestore format
            });

            Alert.alert("Success", "Task created successfully!");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-5 pt-2">
            {/* Custom Header */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold ml-3">Create a Task</Text>
            </View>

            {/* Content */}
            <View className="flex-1 mt-12">
                {/* Title */}
                <InputField
                    label="Title"
                    placeholder="Enter task title"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Description */}
                <InputField
                    label="Description"
                    placeholder="Enter task description"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Due Date + Priority */}
                <View className="flex-row gap-x-4 mt-2">
                    {/* Due Date */}
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-1">Due Date</Text>
                        <TouchableOpacity
                            className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14"
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color="gray" />
                            <Text className="text-base text-gray-600 ml-2">
                                {dueDate ? dueDate.toDateString() : "Set Date"}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={dueDate || new Date()}
                                mode="date"
                                display="calendar"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setDueDate(selectedDate);
                                }}
                            />
                        )}
                    </View>

                    {/* Priority */}
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-1">Set Priority</Text>
                        <View className="border border-gray-300 rounded-xl h-14 justify-center">
                            <Picker
                                selectedValue={priority}
                                onValueChange={(itemValue) => setPriority(itemValue)}
                                style={{
                                    height: 50,
                                    fontSize: 16,
                                    color: "#374151", // gray-700
                                }}
                            >
                                <Picker.Item label="High" value="High" />
                                <Picker.Item label="Medium" value="Medium" />
                                <Picker.Item label="Low" value="Low" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Completed Checkbox */}
                <TouchableOpacity
                    className="flex-row items-center mt-6"
                    onPress={() => setCompleted(!completed)}
                >
                    <View
                        className={`w-6 h-6 border-2 rounded-md mr-3 ${
                            completed ? "bg-indigo-600 border-indigo-600" : "border-gray-400"
                        } items-center justify-center`}
                    >
                        {completed && <Ionicons name="checkmark" size={18} color="white" />}
                    </View>
                    <Text className="text-gray-700 text-base">Mark as Completed</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-6">
                <CustomButton title="Save" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
}
