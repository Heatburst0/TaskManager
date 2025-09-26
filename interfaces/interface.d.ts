// types/task.ts
import { Timestamp } from "firebase/firestore";

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date | null;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
    createdAt: Timestamp;
}
