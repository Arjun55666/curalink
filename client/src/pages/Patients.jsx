import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("*");
    if (error) console.log(error);
    else setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async () => {
    if (!name || !age) return alert("Name and Age required");

    const { error } = await supabase.from("patients").insert([
      { name, age, gender, phone },
    ]);

    if (error) alert(error.message);
    else {
      setName("");
      setAge("");
      setGender("");
      setPhone("");
      fetchPatients();
    }
  };

  const deletePatient = async (id) => {
    await supabase.from("patients").delete().eq("id", id);
    fetchPatients();
  };

  return (
    <div className="p-4 md:p-6">

      {/* FORM */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Add Patient
        </h2>

        {/*  RESPONSIVE FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          onClick={addPatient}
          className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Patient
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Patient List
        </h2>

        {/* SCROLL FIX */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Age</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deletePatient(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}