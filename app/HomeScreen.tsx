import React, {useState, useEffect, useMemo} from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import TaskItem from "../components/TaskItem";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Task } from "@/interfaces/interface";
import {SafeAreaView} from "react-native-safe-area-context";

export default function HomeScreen() {
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const tasksRef = collection(db, "users", user.uid, "tasks");
        const q = query(tasksRef, orderBy("dueDate", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: Task[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                dueDate: docSnap.data().dueDate?.toDate?.() || null,
            })) as Task[];
            setTasks(fetched);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleToggleComplete = async (task: Task) => {
        const user = auth.currentUser;
        if (!user) return;
        const taskRef = doc(db, "users", user.uid, "tasks", task.id);
        await updateDoc(taskRef, { completed: !task.completed });
    };

    // filtering
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (priorityFilter !== "All" && task.priority !== priorityFilter) return false;
            if (statusFilter === "Completed" && !task.completed) return false;
            if (statusFilter === "Incomplete" && task.completed) return false;
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()))
                return false;
            return true;
        });
    }, [tasks, priorityFilter, statusFilter, searchQuery]);

// ✅ grouping optimized
    const { todayTasks, tomorrowTasks, weekTasks, laterTasks } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const normalize = (date: Date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        };

        const todayTasks = filteredTasks.filter(
            (t) => t.dueDate && normalize(t.dueDate) === today.getTime()
        );

        const tomorrowTasks = filteredTasks.filter(
            (t) => t.dueDate && normalize(t.dueDate) === tomorrow.getTime()
        );

        const weekTasks = filteredTasks.filter(
            (t) =>
                t.dueDate &&
                normalize(t.dueDate) > tomorrow.getTime() &&
                normalize(t.dueDate) <= nextWeek.getTime()
        );

        const laterTasks = filteredTasks.filter(
            (t) => t.dueDate && normalize(t.dueDate) > nextWeek.getTime()
        );

        return { todayTasks, tomorrowTasks, weekTasks, laterTasks };
    }, [filteredTasks]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    const hasTasks =
        todayTasks.length || tomorrowTasks.length || weekTasks.length || laterTasks.length;

    return (

            <View className="flex-1 bg-gray-100">
                {/* Header Section */}
                <SafeAreaView className="bg-indigo-50 px-4 pt-8 pb-4 rounded-b-3xl shadow">
                    {/* Profile + Search */}
                    <View className="flex-row items-center mb-3">
                        {/* Profile Icon */}
                        <TouchableOpacity
                            onPress={() => {}}
                            className="w-12 h-12 rounded-full bg-indigo-200 items-center justify-center mr-3"
                        >
                            <Ionicons name="person" size={22} color="black" />
                        </TouchableOpacity>

                        {/* Search Bar */}
                        <TextInput
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 bg-white rounded-full px-4 py-3 shadow"
                        />
                    </View>

                    {/* Filters */}
                    {/* Filters */}
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-gray-700 font-medium">Filters:</Text>

                        {/* Priority Filter */}
                        <View className="flex-1 bg-white rounded-lg border mr-2 h-12 justify-center px-2">
                            <Picker
                                selectedValue={priorityFilter}
                                onValueChange={setPriorityFilter}
                                style={{
                                    fontSize: 16,   // 👈 larger text
                                    color: "black",
                                }}
                            >
                                <Picker.Item label="All Priorities" value="All" />
                                <Picker.Item label="Low" value="Low" />
                                <Picker.Item label="Medium" value="Medium" />
                                <Picker.Item label="High" value="High" />
                            </Picker>
                        </View>

                        {/* Status Filter */}
                        <View className="flex-1 bg-white rounded-lg border mr-2 h-12 justify-center px-2">
                            <Picker
                                selectedValue={statusFilter}
                                onValueChange={setStatusFilter}
                                style={{
                                    fontSize: 16,   // 👈 larger text
                                    color: "black",
                                }}
                                dropdownIconColor="#4f46e5"
                            >
                                <Picker.Item label="All" value="All" />
                                <Picker.Item label="Completed" value="Completed" />
                                <Picker.Item label="Incomplete" value="Incomplete" />
                            </Picker>
                        </View>
                    </View>

                </SafeAreaView>

                {/* Task Sections */}
                <View className="flex-1 px-4 pt-4">
                    {hasTasks ? (
                        <FlatList
                            ListHeaderComponent={
                                <>
                                    {todayTasks.length > 0 && (
                                        <>
                                            <Text className="text-lg font-semibold mb-2">Today</Text>
                                            {todayTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    {...task}
                                                    onToggleComplete={() => handleToggleComplete(task)}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {tomorrowTasks.length > 0 && (
                                        <>
                                            <Text className="text-lg font-semibold mt-4 mb-2">
                                                Tomorrow
                                            </Text>
                                            {tomorrowTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    {...task}
                                                    onToggleComplete={() => handleToggleComplete(task)}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {weekTasks.length > 0 && (
                                        <>
                                            <Text className="text-lg font-semibold mt-4 mb-2">
                                                This Week
                                            </Text>
                                            {weekTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    {...task}
                                                    onToggleComplete={() => handleToggleComplete(task)}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {laterTasks.length > 0 && (
                                        <>
                                            <Text className="text-lg font-semibold mt-4 mb-2">Later</Text>
                                            {laterTasks.map((task) => (
                                                <TaskItem
                                                    key={task.id}
                                                    {...task}
                                                    onToggleComplete={() => handleToggleComplete(task)}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            }
                            data={[]} // handled manually
                            renderItem={null}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500 text-lg">
                                No tasks currently, create one
                            </Text>
                        </View>
                    )}
                </View>

                {/* Floating Add Button */}
                <TouchableOpacity
                    className="absolute bottom-8 right-8 bg-indigo-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
                    onPress={() => router.push("/CreateTaskScreen")}
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>

    );
}
