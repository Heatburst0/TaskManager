import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import {addDoc, collection, deleteDoc, doc, Timestamp, updateDoc} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import InputField from "../components/InputField";
import {SafeAreaView} from "react-native-safe-area-context";
import {getAuth} from "@firebase/auth";
import CustomButton from "@/components/CustomButton";
import {Task} from "@/interfaces/interface";
import { RootStackParamList } from "@/types/navigation";
import {RouteProp, useRoute} from "@react-navigation/core";
import {Stack, useLocalSearchParams} from "expo-router";

type CreateTaskRouteProp = RouteProp<RootStackParamList, "CreateTaskScreen">;

export default function CreateTaskScreen() {
    const navigation = useNavigation();
    const { task: taskString } = useLocalSearchParams<{ task?: string }>();
    const task: Task | undefined = taskString ? JSON.parse(taskString) : undefined;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
    const [completed, setCompleted] = useState(false);

    const isEditing = !!task?.id;

    // Pre-fill when editing
    useEffect(() => {
        if (isEditing) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setDueDate(task.dueDate ? new Date(task.dueDate) : null);
            setPriority(task.priority || "Low");
            setCompleted(task.completed || false);
        }
    }, [isEditing]);

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

            if (isEditing) {
                // 🔹 Update existing task
                const taskRef = doc(db, "users", user.uid, "tasks", task.id);
                await updateDoc(taskRef, {
                    title,
                    description,
                    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
                    priority,
                    completed,
                });
                Alert.alert("Success", "Task updated successfully!");
            } else {
                // 🔹 Create new task
                await addDoc(collection(db, "users", user.uid, "tasks"), {
                    title,
                    description,
                    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
                    priority,
                    completed,
                    createdAt: Timestamp.fromDate(new Date()),
                });
                Alert.alert("Success", "Task created successfully!");
            }

            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDelete, // call your delete function
                },
            ]
        );
    };
    const handleDelete = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) return;

            await deleteDoc(doc(db, "users", user.uid, "tasks", task!!.id));
            Alert.alert("Deleted", "Task deleted successfully!");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-white px-5 pt-2">
                {/* Custom Header */}
                <View className="flex-row items-center mb-6 mt-5">
                    {/* Back Arrow */}
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Title (flex-1 pushes delete to right) */}
                    <Text className="text-lg font-semibold flex-1">
                        {isEditing ? "Edit Task" : "Create a Task"}
                    </Text>

                    {/* Delete Button (only visible when editing) */}
                    {isEditing ? (
                        <TouchableOpacity onPress={confirmDelete}>
                            <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 24 }} /> // placeholder
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 mt-12">
                    <InputField
                        label="Title"
                        placeholder="Enter task title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <InputField
                        label="Description"
                        placeholder="Enter task description"
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Due Date + Priority */}
                    <View className="flex-row gap-x-4 mt-2">
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
                                        fontSize: 16,
                                        color: "#374151",
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
        </>

    );
}
