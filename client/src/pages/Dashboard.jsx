import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

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

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        Dashboard Overview
      </h2>

      {/* RESPONSIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-4 md:p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Patients</p>
          <h3 className="text-xl md:text-2xl font-bold">
            {patients.length}
          </h3>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Doctors</p>
          <h3 className="text-xl md:text-2xl font-bold">
            {doctors.length}
          </h3>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Appointments</p>
          <h3 className="text-xl md:text-2xl font-bold">
            {appointments.length}
          </h3>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <h3 className="text-xl md:text-2xl font-bold">0</h3>
        </div>

      </div>
    </div>
  );
}