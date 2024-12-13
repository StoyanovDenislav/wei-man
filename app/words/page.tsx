"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for useRouter in client component
import words from "../words.json";

export default function Words() {
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-black bg-white transition-opacity duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        className="self-start mb-4 text-green-800"
        onClick={() => router.push("/")} // Navigate to the main page
      >
        ← Zurück
      </button>
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-green-800 text-center">
        Deutsche Weihnachtsgeschenke Wörter
      </h1>
      <div className="overflow-x-auto w-full">
        <table className="table-auto border-collapse border border-green-800 w-full">
          <thead>
            <tr>
              <th className="border border-green-600 px-4 py-2">Artikel</th>
              <th className="border border-green-600 px-4 py-2">Wort</th>
              <th className="border border-green-600 px-4 py-2">Übersetzung</th>
              <th className="border border-green-600 px-4 py-2">Plural Form</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => (
              <tr key={index}>
                <td className="border border-green-600 px-4 py-2">
                  {word.gender}
                </td>
                <td className="border border-green-600 px-4 py-2">
                  {word.word}
                </td>
                <td className="border border-green-600 px-4 py-2">
                  {word.translation}
                </td>
                <td className="border border-green-600 px-4 py-2">
                  {word.plural}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
