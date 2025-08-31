import React from "react";
import { useLocation } from "react-router-dom";

export function KvizForma() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const language = params.get("language") || "Nepoznat jezik";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10">
      <h1 className="text-4xl font-bold text-[#8f60bf] mb-6">
        Kviz za jezik: {language}
      </h1>
      {/* Ostatak kviz forme možeš ovde napraviti */}
      <p className="text-gray-700">
        Ovaj kviz će testirati tvoje znanje iz jezika: <strong>{language}</strong>.
      </p>
    </div>
  );
}
