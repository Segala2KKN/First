import {serialize} from "cookie";

export async function POST(){
    const cookie = serialize("token", " ", {
        httpOnly: true,
        secure: process.env.NODE.ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    
    return new Response(
        JSON.stringify({message: "Logout berhasil"}),
        {
            status: 200,
            headers: {
                "Set-Cookie": cookie,
            },
        }
    );
}