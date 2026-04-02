import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: p } = await supabase.from("patients").select("*");
    const { data: d } = await supabase.from("doctors").select("*");
    const { data: a } = await supabase.from("appointments").select("*");

    setPatients(p || []);
    setDoctors(d || []);
    setAppointments(a || []);
  };

  const bookAppointment = async () => {
    if (!patientId || !doctorId || !date) {
      return alert("All fields required");
    }

    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: Number(patientId),
        doctor_id: Number(doctorId),
        date,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setPatientId("");
    setDoctorId("");
    setDate("");

    fetchData();
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Appointments
          </h2>
          <p className="text-gray-500 text-sm">
            Manage scheduling and consultations
          </p>
        </div>

        <button
          onClick={bookAppointment}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          + Book Appointment
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow mb-6">

        {/* 🔥 RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            className="border p-2 rounded w-full"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded w-full"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow p-4 md:p-5">

        {/* 🔥 SCROLL FIX */}
        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-400">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((a) => {
                  const patient = patients.find(
                    (p) => p.id === a.patient_id
                  );
                  const doctor = doctors.find(
                    (d) => d.id === a.doctor_id
                  );

                  return (
                    <tr key={a.id} className="border-t hover:bg-gray-50 text-sm">

                      <td className="p-3">
                        {a.date
                          ? new Date(a.date).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="p-3">
                        {patient ? patient.name : "N/A"}
                      </td>

                      <td className="p-3">
                        {doctor ? doctor.name : "N/A"}
                      </td>

                      <td className="p-3">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                          Completed
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}