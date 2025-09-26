// types/navigation.ts
import { Task } from "@/interfaces/interface";

export type RootStackParamList = {
    TaskListScreen: undefined;
    CreateTaskScreen: { task?: Task }; // 👈 task is optional
};
