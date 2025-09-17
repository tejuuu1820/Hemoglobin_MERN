import { useFormik } from 'formik';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import hemoglobinService from '../../services/hemoglobin.service';

export default function HemoglobinTestApp() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load patients from backend on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await hemoglobinService.getPatients();
      console.log(data);
      setPatients(data.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // classify function
  function classifyHemoglobin(item) {
    if (item.gender === 'M') {
      if (item.hemo < 13.8) return 'Low';
      if (item.hemo > 17.2) return 'High';
      return 'Normal';
    } else {
      if (item.hemo < 12.1) return 'Low';
      if (item.hemo > 15.1) return 'High';
      return 'Normal';
    }
  }

  // Formik form
  const formik = useFormik({
    initialValues: {
      name: '',
      age: '',
      gender: 'M',
      hemo: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const newPatient = {
        ...values,
        name: values.name,
        age: Number(values.age),
        hemo: Number(values.hemo),
        // category: classifyHemoglobin(values),
      };
      try {
        const saved = await hemoglobinService.addPatient(newPatient);
        setPatients((prev) => [...prev, saved]);
        resetForm();
        loadData();
      } catch (error) {
        console.error('Error saving patient:', error);
      }
    },
  });

  const previewCategory = classifyHemoglobin(formik.values);

  // Category counts for chart
  const categoryCounts = useMemo(() => {
    const counts = { Low: 0, Normal: 0, High: 0 };
    patients.forEach((p) => counts[p.category]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  // Badge component
  function CategoryBadge({ category }) {
    let styles = '';
    let Icon = null;
    if (category === 'Low') {
      styles = 'bg-red-100 text-red-700 border border-red-300';
      Icon = XCircle;
    } else if (category === 'High') {
      styles = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      Icon = AlertTriangle;
    } else {
      styles = 'bg-green-100 text-green-700 border border-green-300';
      Icon = CheckCircle;
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${styles}`}
      >
        <Icon size={14} /> {category}
      </span>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Interactive Hemoglobin Test Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {categoryCounts.map((c) => (
          <div key={c.name} className="bg-white shadow rounded p-4 text-center">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="text-3xl font-bold text-blue-700">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Input form with Formik */}
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow rounded p-6 mb-8 flex flex-col gap-4 w-full lg:w-1/2 mx-auto"
      >
        <label className="flex flex-col">
          <span className="font-medium mb-1">Name</span>
          <input
            type="text"
            {...formik.getFieldProps('name')}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex flex-col">
          <span className="font-medium mb-1">Age</span>
          <input
            type="number"
            {...formik.getFieldProps('age')}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Gender</span>
          <select
            {...formik.getFieldProps('gender')}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-medium mb-1">Hemoglobin Level (g/dL)</span>
          <input
            type="number"
            step="0.1"
            {...formik.getFieldProps('hemo')}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Real-time preview */}
        <div className="mt-2">
          <span className="font-medium mr-2">Current Classification:</span>
          <CategoryBadge category={previewCategory} />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded mt-2 hover:bg-blue-700 transition"
        >
          Add Patient
        </button>
      </form>

      {/* Chart */}
      <div className="bg-white shadow rounded p-4 flex-1 mb-8">
        <h2 className="font-semibold mb-2">Category Counts</h2>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={categoryCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Age</th>
              <th className="p-2 text-left">Gender</th>
              <th className="p-2 text-left">Hemoglobin (g/dL)</th>
              <th className="p-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, index) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.age}</td>
                <td className="p-2">{p.gender}</td>
                <td className="p-2">{p.hemo}</td>
                <td className="p-2">
                  <CategoryBadge category={p.category} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-xs text-gray-500 mt-6 text-center">
        Thresholds: Male (Low &lt; 13.8, High &gt; 17.2), Female (Low &lt; 12.1,
        High &gt; 15.1)
      </footer>
    </div>
  );
}
