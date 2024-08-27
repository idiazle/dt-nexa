import { signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";

export async function logoutAction() {
    await signOut({ callbackUrl: '/auth/login' });
}

export function revalidaTeRoute(route: string) {
    revalidatePath(route)
}