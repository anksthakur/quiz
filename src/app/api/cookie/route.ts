import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export const GET = () => {
    try {
        const cookieStore = cookies();
        const hasCookie = cookieStore.getAll();
        console.log(hasCookie)
        return NextResponse.json({hasCookie});
    } catch (err) {
        return NextResponse.json({err})
    }
}