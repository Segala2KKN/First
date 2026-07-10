import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// Middleware auth dinonaktifkan sementara.
// Untuk mengaktifkan kembali: uncomment kode di bawah dan hapus baris `return NextResponse.next()`.

export function middleware(request) {
    return NextResponse.next();

    // const token = request.cookies.get("token")?.value;

    // if(!token){
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // try {
    //     jwt.verify(token, process.env.JWT_SECRET);
    //     return NextResponse.next();
    // } catch (err){
    //     return NextResponse.redirect(new URL("/", request.url));
    // }
}

export const config = {
    matcher: ["/dashboard"],
};
