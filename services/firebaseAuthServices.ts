import { auth } from "@/firebaseConfig";
import {
    createUserWithEmailAndPassword, getAuth,
    signInWithEmailAndPassword, signOut,
} from "firebase/auth";

// ✅ Sign Up
export const signUp = async (email: string, password: string): Promise<void> => {
    if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields.");
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        let message = "Something went wrong. Please try again.";

        switch (err.code) {
            case "auth/invalid-email":
                message = "Invalid email format.";
                break;
            case "auth/email-already-in-use":
                message = "This email is already registered.";
                break;
            case "auth/weak-password":
                message = "Password should be at least 6 characters.";
                break;
        }

        throw new Error(message);
    }
};

// ✅ Login
export const login = async (email: string, password: string): Promise<void> => {
    if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields.");
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        let message = "Something went wrong. Please try again.";
        console.log(err);
        switch (err.code) {
            case "auth/invalid-email":
                message = "Invalid email format.";
                break;
            case "auth/user-not-found":
                message = "No account found with this email.";
                break;
            case "auth/wrong-password":
                message = "Incorrect password. Please try again.";
                break;
            case "auth/invalid-credential":
                message = "Incorrect email or password.";
                break;
            case "auth/too-many-requests":
                message = "Too many failed attempts. Try again later.";
                break;
        }

        throw new Error(message);
    }
};

export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (err: any) {
        throw new Error("Failed to log out. Please try again.");
    }
};

export const getCurrentUser = () => {
    const auth = getAuth();
    return auth.currentUser;
};

export const getCurrentUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || "";
};