import { useFormik } from 'formik';
import { Pencil, Trash2 } from 'lucide-react';
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
import * as Yup from 'yup';
import { useAuth } from '../../context/auth-context';
import hemoglobinService from '../../services/hemoglobin.service';
import './HemoglobinTestApp.css'; // Import the CSS below

export default function HemoglobinTestApp() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdminAuth, auth } = useAuth();

  // ---- Floating blood cells ----
  useEffect(() => {
    const bg = document.getElementById('bgCells');
    if (!bg) return;

    const count = Math.min(
      26,
      Math.max(10, Math.round(window.innerWidth / 80))
    );
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'cell';
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
  }, [isAdminAuth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = isAdminAuth
        ? await hemoglobinService.getPatients()
        : await hemoglobinService.getPatientsByUserId(auth.user.id);
      setPatients(data.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---- Classification ----
  const classifyHemoglobin = (item) => {
    if (item.gender === 'M') {
      if (item.hemo < 13.8) return 'Low';
      if (item.hemo > 17.2) return 'High';
      return 'Normal';
    } else {
      if (item.hemo < 12.1) return 'Low';
      if (item.hemo > 15.1) return 'High';
      return 'Normal';
    }
  };

  const getSuggestion = (category) => {
    switch (category) {
      case 'Low':
        return 'Consider consulting a doctor. Iron-rich foods may help.';
      case 'High':
        return 'Monitor hydration and consult a physician if persistent.';
      case 'Normal':
        return 'Maintain your current healthy lifestyle!';
      default:
        return 'No suggestion available';
    }
  };

  // ---- Delete / Edit ----
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await hemoglobinService.deletePatient(id);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleEdit = (patient) => {
    formik.setValues({
      _id: patient._id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      hemo: patient.hemo,
    });
  };

  // ---- Formik ----
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    age: Yup.number()
      .required('Age is required')
      .positive('Age must be positive')
      .integer('Age must be an integer'),
    gender: Yup.string().required('Gender is required'),
    hemo: Yup.number()
      .required('Hemoglobin level is required')
      .positive('Hemoglobin must be positive'),
  });

  const formik = useFormik({
    initialValues: { _id: null, name: '', age: '', gender: 'M', hemo: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        age: Number(values.age),
        hemo: Number(values.hemo),
        userId: auth.user.id,
      };
      try {
        if (values._id) {
          const updated = await hemoglobinService.updatePatient(
            values._id,
            payload
          );
          setPatients((prev) =>
            prev.map((p) => (p._id === updated._id ? updated : p))
          );
        } else {
          const saved = await hemoglobinService.addPatient(payload);
          setPatients((prev) => [...prev, saved]);
        }
        resetForm();
        loadData();
      } catch (error) {
        console.error('Error saving patient:', error);
      }
    },
  });

  const previewCategory = classifyHemoglobin(formik.values);

  const categoryCounts = useMemo(() => {
    const counts = { Low: 0, Normal: 0, High: 0 };
    patients.forEach((p) => counts[p.category]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  // ---- Category Badge ----
  function CategoryBadge({ category }) {
    let className = '';
    if (category === 'Low') className = 'badge low';
    else if (category === 'High') className = 'badge high';
    else className = 'badge normal';
    return <span className={className}>{category}</span>;
  }

  return (
    <div className="relative min-h-screen">
      <div
        id="bgCells"
        className="bg-cells fixed inset-0 z-0 pointer-events-none overflow-hidden"
      ></div>

      <div className="page-wrap relative z-10 flex justify-center items-start p-6 pt-12">
        <div className="container bg-white p-6 rounded-lg w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Interactive Hemoglobin Test Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {categoryCounts.map((c) => (
              <div
                key={c.name}
                className="bg-white shadow rounded p-4 text-center"
              >
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-3xl font-bold text-blue-700">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          {isAdminAuth && (
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow rounded p-6 mb-8 flex flex-col gap-4"
            >
              <label className="flex flex-col">
                <span className="font-medium mb-1">Name</span>
                <input
                  type="text"
                  {...formik.getFieldProps('name')}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                />
                {formik.touched.name && formik.errors.name && (
                  <span className="text-red-600 text-sm">
                    {formik.errors.name}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">Age</span>
                <input
                  type="number"
                  {...formik.getFieldProps('age')}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                />
                {formik.touched.age && formik.errors.age && (
                  <span className="text-red-600 text-sm">
                    {formik.errors.age}
                  </span>
                )}
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
                {formik.touched.gender && formik.errors.gender && (
                  <span className="text-red-600 text-sm">
                    {formik.errors.gender}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">
                  Hemoglobin Level (g/dL)
                </span>
                <input
                  type="number"
                  disabled={true}
                  step="0.1"
                  {...formik.getFieldProps('hemo')}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                />
                {formik.touched.hemo && formik.errors.hemo && (
                  <span className="text-red-600 text-sm">
                    {formik.errors.hemo}
                  </span>
                )}
              </label>

              {/* Preview */}
              <div
                className={`p-3 rounded mt-2 ${previewCategory.toLowerCase()}`}
              >
                <p>
                  Classification: <CategoryBadge category={previewCategory} />
                </p>
                <p className="text-sm">{getSuggestion(previewCategory)}</p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded mt-2 hover:bg-blue-700 transition"
              >
                {formik.values._id ? 'Update Patient' : 'Add Patient'}
              </button>
            </form>
          )}

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
                  <th className="p-2 text-left">S.No</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Age</th>
                  <th className="p-2 text-left">Gender</th>
                  <th className="p-2 text-left">Hemoglobin (g/dL)</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Suggestion</th>
                  {isAdminAuth && <th className="p-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr
                    key={p._id}
                    className={`border-t hover:bg-gray-50 transition ${p.category.toLowerCase()}`}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.age}</td>
                    <td className="p-2">{p.gender}</td>
                    <td className="p-2">{p.hemo}</td>
                    <td className="p-2">
                      <CategoryBadge category={p.category} />
                    </td>
                    <td className="p-2">{getSuggestion(p.category)}</td>
                    {isAdminAuth && (
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="text-xs text-gray-500 mt-6 text-center">
            Thresholds: Male (Low &lt; 13.8, High &gt; 17.2), Female (Low &lt;
            12.1, High &gt; 15.1)
          </footer>
        </div>
      </div>
    </div>
  );
}
