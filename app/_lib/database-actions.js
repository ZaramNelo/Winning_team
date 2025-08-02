"use server";
import { supabase } from "./supabase";

export async function getUser(email) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("getUser error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getUser exception:", error);
    return null;
  }
}

export async function createUser({ email, fullName, password = null }) {
  try {
    // First check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log("User already exists:", email);
      return existingUser;
    }

    // Create user profile (no password hashing)
    const { data, error } = await supabase.from("users").insert([
      {
        email,
        fullName,
        password: password, // Store password as-is
      },
    ]);

    if (error) {
      console.error("createUser error:", error);
      throw new Error("User could not be created");
    }

    console.log("User created successfully:", email);
    return data;
  } catch (error) {
    console.error("createUser exception:", error);
    throw error;
  }
}

export async function verifyPassword(password, storedPassword) {
  // Simple string comparison (no encryption)
  return password === storedPassword;
}

export async function getSymptomsHistory(userId) {
  try {
    const { data, error } = await supabase
      .from("symptomsHistory")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching symptoms history:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Error fetching symptoms history" };
  }
}
