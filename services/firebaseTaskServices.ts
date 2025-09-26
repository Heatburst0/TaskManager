import {auth, db} from "@/firebaseConfig";
import {
    getAuth
} from "firebase/auth";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    Timestamp, deleteDoc, onSnapshot, orderBy, query
} from "firebase/firestore";
import { Task } from "@/interfaces/interface";

export const subscribeToTasks = (
    callback: (tasks: Task[]) => void,
    onError?: (error: Error) => void
) => {
    const user = auth.currentUser;
    if (!user) {
        onError?.(new Error("No user is signed in."));
        return () => {};
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("dueDate", "asc"));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const fetched: Task[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                dueDate: docSnap.data().dueDate?.toDate?.() || null,
            })) as Task[];
            callback(fetched);
        },
        (error) => {
            onError?.(error);
        }
    );

    return unsubscribe;
};

export const saveTask = async (
    task: Partial<Task>,
    isEditing: boolean,
    taskId?: string
): Promise<void> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in.");
    }

    if (isEditing && taskId) {
        // 🔹 Update existing task
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        await updateDoc(taskRef, {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
            priority: task.priority,
            completed: task.completed,
        });
    } else {
        // 🔹 Create new task
        await addDoc(collection(db, "users", user.uid, "tasks"), {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
            priority: task.priority,
            completed: task.completed ?? false,
            createdAt: Timestamp.fromDate(new Date()),
        });
    }
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is signed in.");
    }

    await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
};

export const toggleTaskComplete = async (task: Task) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is signed in.");

    const taskRef = doc(db, "users", user.uid, "tasks", task.id);
    await updateDoc(taskRef, { completed: !task.completed });
};
