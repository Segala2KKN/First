"use client";
import { useState } from "react";

export default function Counter({title, start}) {
    const [count, setCount] = useState(start);

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold text white">
                Angka: {count}
            </h1>

            <button
                onClick={() => setCount(count+1)}
                className="px-6 py-3 bg-white text-black rounded"
            >
                Tambah Angka
            </button>
        </div>
    );
}