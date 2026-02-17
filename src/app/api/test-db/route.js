import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query("SELECT NOW()");
        return new Response(
            JSON.stringify({ time: result.rows[0].now }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}