import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const fetchDoctors = async () => {
    const { data } = await supabase.from("doctors").select("*");
    setDoctors(data || []);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const addDoctor = async () => {
    if (!name || !specialization) {
      return alert("All fields required");
    }

    await supabase.from("doctors").insert([{ name, specialization }]);

    setName("");
    setSpecialization("");
    fetchDoctors();
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h2 className="text-xl md:text-2xl font-bold">
          Medical Staff
        </h2>

        {/* RESPONSIVE FORM */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">

          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />

          <button
            onClick={addDoctor}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Add
          </button>
        </div>
      </div>

      {/*  RESPONSIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {doctors.map((d) => (
          <div key={d.id} className="bg-white rounded-xl shadow p-5">

            {/* IMAGE PLACEHOLDER */}
            <div className="h-28 bg-gray-200 rounded-lg mb-4"></div>

            <h3 className="text-lg font-semibold">{d.name}</h3>

            <p className="text-sm text-teal-600 bg-teal-100 inline-block px-2 py-1 rounded mt-1">
              {d.specialization}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              5+ years experience
            </p>

            <button className="mt-4 bg-teal-600 text-white px-4 py-1 rounded w-full md:w-auto">
              Book Appt
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}