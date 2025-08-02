"use server";

import { signIn, signOut } from "./auth";

export async function signInAction() {
  // If you had more than one provider, you'd have to loop through them
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
