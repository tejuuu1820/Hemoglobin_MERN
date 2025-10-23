import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as Yup from "yup";
import { useAuth } from "../../context/auth-context";
import authServices from "../../services/auth.service";
import hemoglobinService from "../../services/hemoglobin.service";

export default function HemoglobinDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdminAuth, auth } = useAuth();
  const [modalInfo, setModalInfo] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [initialValues, setInitialValues] = useState({
    _id: null,
    name: "",
    email: "",
    age: "",
    gender: "M",
    hemo: "",
  });

  // ---- Floating blood cells ----
  useEffect(() => {
    const bg = document.getElementById("bgCells");
    if (!bg) return;
    const count = Math.min(26, Math.max(10, Math.round(window.innerWidth / 80)));
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "cell";
      const w = 40 + Math.round(Math.random() * 80);
      const h = Math.round(w * (0.65 + Math.random() * 0.2));
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.left = `${Math.random() * 110 - 5}%`;
      el.style.top = `${80 + Math.random() * 30}vh`;
      const dur = 18 + Math.random() * 18;
      const delay = -Math.random() * dur;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay = `${delay}s`;
      el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
      bg.appendChild(el);
    }
  }, []);

  // ---- Load patient data ----
  useEffect(() => {
    loadData();
  }, [isAdminAuth, auth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = isAdminAuth
        ? await hemoglobinService.getPatients()
        : await hemoglobinService.getPatientsByUserId(auth.user.email);
      const processedData = data.data.map((p) => ({
        ...p,
        category: classifyHemoglobin(p),
      }));
      setPatients(processedData);
      setFilteredPatients(processedData);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Filter Buttons ---
  // const handleFilter = (filter) => {
  //   setSelectedFilter(filter);
  //   if (filter === "All") {
  //     setFilteredPatients(patients);
  //   } else {
  //     setFilteredPatients(patients.filter((p) => p.category === filter));
  //   }
  // };

  const handleFilter = (filter) => {
  setSelectedFilter(filter);
  applyFilterAndSearch(filter, searchQuery);
};

const handleSearch = (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  applyFilterAndSearch(selectedFilter, query);
};

const applyFilterAndSearch = (filter, query) => {
  let data = [...patients];

  // Apply category filter
  if (filter !== "All") {
    data = data.filter((p) => p.category === filter);
  }

  // Apply search filter
  if (query.trim() !== "") {
    data = data.filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }

  setFilteredPatients(data);
};

  // ---- Helper: Determine age group ----
  const getAgeGroup = (age, gender) => {
    if (!age) return "Unknown";
    if (age < 0.5) return "Newborn (0-6 months)";
    if (age < 1) return "Infant (6-12 months)";
    if (age >= 1 && age < 6) return "Young Children (1-6 years)";
    if (age >= 6 && age < 18) return "Older Children (6-18 years)";
    if (age >= 18 && age < 60) return gender === "M" ? "Young Adult Male" : "Young Adult Female";
    if (age >= 60) return gender === "M" ? "Older Adult Male" : "Older Adult Female";
    return "Unknown";
  };

  // ---- Classification ----
  const classifyHemoglobin = (item) => {
    const ageGroup = getAgeGroup(item.age, item.gender);
    const hemo = item.hemo;

    switch (ageGroup) {
      case "Newborn (0-6 months)":
        if (hemo < 14) return "Low";
        if (hemo > 24) return "High";
        return "Normal";
      case "Infant (6-12 months)":
        if (hemo < 11) return "Low";
        if (hemo > 17) return "High";
        return "Normal";
      case "Young Children (1-6 years)":
        if (hemo < 9.5) return "Low";
        if (hemo > 14) return "High";
        return "Normal";
      case "Older Children (6-18 years)":
        if (hemo < 10) return "Low";
        if (hemo > 15.5) return "High";
        return "Normal";
      case "Young Adult Male":
        if (hemo < 13.8) return "Low";
        if (hemo > 17.2) return "High";
        return "Normal";
      case "Young Adult Female":
        if (hemo < 12.1) return "Low";
        if (hemo > 15.1) return "High";
        return "Normal";
      case "Older Adult Male":
        if (hemo < 12.4) return "Low";
        if (hemo > 14.9) return "High";
        return "Normal";
      case "Older Adult Female":
        if (hemo < 11.7) return "Low";
        if (hemo > 13.8) return "High";
        return "Normal";
      default:
        return "Unknown";
    }
  };

  const getSuggestion = (category) => {
    switch (category) {
      case "Low":
        return "Consider consulting a doctor. Iron-rich foods may help.";
      case "High":
        return "Monitor hydration and consult a physician if persistent.";
      case "Normal":
        return "Maintain your current healthy lifestyle!";
      default:
        return "No suggestion available";
    }
  };

  // ---- Delete / Edit ----
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await hemoglobinService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      loadData()
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleEdit = (patient) => {
    formik.setValues({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      age: patient.age,
      gender: patient.gender,
      hemo: patient.hemo,
    });
  };

  // ---- Generate Credentials ----
  const handleGenerateCreds = async (patient) => {
    const username = `${patient.name}_${patient.age}`;
    const email = patient.email;
    const password = `${patient.name}_${patient.age}`;

    const payload = {
      username,
      email,
      password,
      confirm_password: password,
    };

    try {
      const res = await authServices.signUp(payload);
      setModalInfo({ email, password });
    } catch (error) {
      console.error("Error generating credentials:", error);
      alert("Error generating credentials.");
    }
  };

  // ---- Formik ----
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.number().required("Age is required").positive().integer(),
    gender: Yup.string().required("Gender is required"),
    hemo: Yup.number().required("Hemoglobin level is required").positive(),
    email: Yup.string().required("Email is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        name: values.name,
        email: values.email,
        gender: values.gender,
        age: Number(values.age),
        hemo: Number(values.hemo),
        userId: auth.user.id,
      };
      try {
        if (values._id) {
          const updated = await hemoglobinService.updatePatient(values._id, payload);
          setPatients((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        } else {
          const saved = await hemoglobinService.addPatient(payload);
          setPatients((prev) => [...prev, saved]);
        }
        resetForm();
        loadData();
      } catch (error) {
        console.error("Error saving patient:", error);
      }
    },
  });

    // ---- Floating blood cells ----
    useEffect(() => {
      const bg = document.getElementById("bgCells");
      if (!bg) return;
      const count = Math.min(26, Math.max(10, Math.round(window.innerWidth / 80)));
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "cell";
        const w = 40 + Math.round(Math.random() * 80);
        const h = Math.round(w * (0.65 + Math.random() * 0.2));
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.left = `${Math.random() * 110 - 5}%`;
        el.style.top = `${80 + Math.random() * 30}vh`;
        const dur = 18 + Math.random() * 18;
        const delay = -Math.random() * dur;
        el.style.animationDuration = `${dur}s`;
        el.style.animationDelay = `${delay}s`;
        el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        bg.appendChild(el);
      }
    }, []);

  const previewAgeGroup = getAgeGroup(formik.values.age, formik.values.gender);
  const previewCategory = classifyHemoglobin(formik.values);

  const categoryCounts = useMemo(() => {
    const counts = { Low: 0, Normal: 0, High: 0 };
    patients.forEach((p) => counts[p.category]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  function CategoryBadge({ category }) {
    let className = "";
    if (category === "Low") className = "text-red-500 font-semibold";
    else if (category === "High") className = "text-yellow-500 font-semibold";
    else className = "text-green-600 font-semibold";
    return <span className={className}>{category}</span>;
  }

  const avgHemo = useMemo(() => {
    if (filteredPatients.length === 0) return 0;
    return (
      filteredPatients.reduce((acc, p) => acc + Number(p.hemo || 0), 0) / filteredPatients.length
    ).toFixed(1);
  }, [filteredPatients]);

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-xl">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      {/* Floating Cells Background */}
      <div id="bgCells" className="fixed inset-0 -z-10"></div>
      <style jsx>{`
        .cell {
          position: absolute;
          background: rgba(220, 38, 38, 0.3);
          border-radius: 50%;
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
          }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="animate-pulse text-red-500 text-5xl">❤️</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Hemoglobin Test Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track, visualize, and understand hemoglobin levels easily.
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ➕ Add / Edit Patient Record
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Patient Name"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              placeholder="Age"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <input
              type="number"
              step="0.1"
              name="hemo"
              value={formik.values.hemo}
              onChange={formik.handleChange}
              placeholder="Hemoglobin (g/dL)"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-5 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {formik.values._id ? "Update Patient" : "Add Patient"}
            </button>
          </div>

          {/* Preview */}
          <div className={`p-3 rounded mt-4 border-l-4 border-blue-600`}>
            <p>
              <strong>Age Group:</strong> {previewAgeGroup}
            </p>
            <p>
              Classification: <CategoryBadge category={previewCategory} />
            </p>
            <p className="text-sm">{getSuggestion(previewCategory)}</p>
          </div>
        </form>

        {/* Average Hemoglobin */}
        {patients.length > 0 && (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg py-3 mb-6 shadow">
            <p className="text-blue-700 font-medium">
              Average Hemoglobin Level:{" "}
              <span className="font-bold text-blue-900">{avgHemo} g/dL</span>
            </p>
          </div>
        )}

        {/* Filter Buttons */}
<div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
  <input
    type="text"
    placeholder="Search by name..."
    value={searchQuery}
    onChange={handleSearch}
    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
  />
  <div className="flex gap-3">
    {["All", "Low", "Normal", "High"].map((f) => (
      <button
        key={f}
        onClick={() => handleFilter(f)}
        className={`px-4 py-2 rounded-lg font-medium shadow-sm ${
          selectedFilter === f
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {f}
      </button>
    ))}
  </div>
</div>

        {/* Table Section */}
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] bg-white shadow-md rounded-xl border border-gray-200 mb-10">
  <table className="min-w-[800px] text-sm text-left border-collapse">
    <thead className="bg-gray-100 sticky top-0 z-10">
      <tr>
        <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Email</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Age</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Gender</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Hemoglobin</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Category</th>
        <th className="px-4 py-2 font-semibold text-gray-700 text-center">Visualization</th>
        <th className="px-4 py-2 font-semibold text-gray-700">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y">
      {filteredPatients.map((p) => (
        <tr key={p._id} className="hover:bg-gray-50">
          <td className="px-4 py-2">{p.name}</td>
          <td className="px-4 py-2">{p.email}</td>
          <td className="px-4 py-2">{p.age}</td>
          <td className="px-4 py-2">{p.gender}</td>
          <td className="px-4 py-2">{p.hemo}</td>
          <td className="px-4 py-2 font-semibold">
            <CategoryBadge category={p.category} />
          </td>
          <td className="px-4 py-2">
            <div className="w-14 mx-auto">
              <CircularProgressbar
                value={p.hemo}
                maxValue={20}
                text={`${p.hemo}`}
                styles={buildStyles({
                  textSize: "30px",
                  textColor: "#1e3a8a",
                  pathColor:
                    p.category === "Low"
                      ? "#ef4444"
                      : p.category === "High"
                      ? "#f59e0b"
                      : "#10b981",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </td>
          <td className="px-4 py-2 flex gap-2">
            <button
              onClick={() => handleEdit(p)}
              className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => handleGenerateCreds(p)}
              className="bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700"
            >
              Generate Creds
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {filteredPatients.length === 0 && (
    <p className="text-center py-5 text-gray-500">No records to display.</p>
  )}
</div>


        {/* 📊 Age Group Reference Card */}
        <div className="mt-6 bg-white shadow-md rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            🩸 Hemoglobin Reference by Age Group
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 font-semibold text-gray-700">Age Group</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Gender</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Normal Range (g/dL)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2">Newborn (0–6 months)</td>
                  <td className="px-4 py-2">All</td>
                  <td className="px-4 py-2">14 – 24</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Infant (6–12 months)</td>
                  <td className="px-4 py-2">All</td>
                  <td className="px-4 py-2">11 – 17</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Young Children (1–6 years)</td>
                  <td className="px-4 py-2">All</td>
                  <td className="px-4 py-2">9.5 – 14</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Older Children (6–18 years)</td>
                  <td className="px-4 py-2">All</td>
                  <td className="px-4 py-2">10 – 15.5</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Young Adults (18–60 years)</td>
                  <td className="px-4 py-2">Male / Female</td>
                  <td className="px-4 py-2">13.8–17.2 / 12.1–15.1</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Older Adults (60+ years)</td>
                  <td className="px-4 py-2">Male / Female</td>
                  <td className="px-4 py-2">12.4–14.9 / 11.7–13.8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-xs mt-3 italic">
            *Values are approximate and may vary slightly based on medical references.
          </p>
        </div>
      </div>

      {/* Modal for credentials */}
      {modalInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">Generated Credentials</h3>
            <p>
              <strong>Email:</strong> {modalInfo.email}
            </p>
            <p>
              <strong>Password:</strong> {modalInfo.password}
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setModalInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
