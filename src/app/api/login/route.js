import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ message: "Email tidak terdaftar"}), {status: 401});
        }
        
        const user = rsult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.strngify({ message: "Password salah"}), {status: 401});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60*60*24*7,
        }
        );

        return new Response(
            JSON.stringify({message: "Login berhasil"}),
            {
                status: 200,
                headers: {"Set-Cookie": cookie },
            }
        );
    } catch (e) {;
        return new Response(JSON.stringify({message: "Server error"}), {status: 500});
    }
}

