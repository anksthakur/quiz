import { signIn, signOut } from "next-auth/react";

export async function doSocialLogin(formData: FormData) {
    const action = formData.get('action') as string;
    if (action) {
        await signIn(action, { callbackUrl: "/user" });
    } else {
        throw new Error("No action specified for social login");
    }
}

export async function doLogout(formData: FormData) {
    await signOut({ callbackUrl: "/" });
}