import jwt from "jsonwebtoken";

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ user: payload }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
  }
}
