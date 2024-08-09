import { signIn} from "next-auth/react";

export async function doSocialLogin(formData: FormData) {
    const action = formData.get('action') as string;
    console.log(2)
    if (action) {
        await signIn(action, { callbackUrl: "/user" });
        
    } else {
        throw new Error("No action specified for social login");
    }
}
