"use client";

export default function Dashboard() {
    async function handleLogout(){
        await fetch("/api/logout", {method: "POST"});
        window.location.href = "/";
    }

    return (
        <div className= "min-h-screen flex flex-col items-center justify-center gap-6 bgb-black text-white">
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <button
                onClick={handleLogout}
                className= "px-6 py-3 bg-white text-black rounded-2xl"
            >
                Logout
            </button>

        </div>

    )
}