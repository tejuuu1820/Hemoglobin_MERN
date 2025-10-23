import { useFormik } from 'formik';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
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
import authServices from '../../services/auth.service';
import hemoglobinService from '../../services/hemoglobin.service';
import userServices from '../../services/user.service';
import './HemoglobinTestApp.css';

export default function HemoglobinTestApp() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdminAuth, auth } = useAuth();
  const [modalInfo, setModalInfo] = useState(null);
  const [initialValues, setInitialValues] = useState({
    _id: null,
    name: '',
    email: '',
    age: '',
    gender: 'M',
    hemo: '',
  });

  // ---- Floating blood cells ----
  useEffect(() => {
    const bg = document.getElementById('bgCells');
    if (!bg) return;
    const count = Math.min(26, Math.max(10, Math.round(window.innerWidth / 80)));
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
  }, [isAdminAuth, auth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = isAdminAuth
        ? await hemoglobinService.getPatients()
        : await hemoglobinService.getPatientsByUserId(auth.user.email);
      setPatients(data.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---- Helper: Determine age group ----
  const getAgeGroup = (age, gender) => {
    if (age === undefined || age === null || age === '') return 'Unknown';

    if (age < 0.5) return 'Newborn (0-6 months)';
    if (age < 1) return 'Infant (6-12 months)';
    if (age >= 1 && age < 6) return 'Young Children (1-6 years)';
    if (age >= 6 && age < 18) return 'Older Children (6-18 years)';
    if (age >= 18 && age < 60)
      return gender === 'M' ? 'Young Adult Male' : 'Young Adult Female';
    if (age >= 60)
      return gender === 'M' ? 'Older Adult Male' : 'Older Adult Female';
    return 'Unknown';
  };

  // ---- Classification ----
  const classifyHemoglobin = (item) => {
    const ageGroup = getAgeGroup(item.age, item.gender);
    const hemo = item.hemo;

    switch (ageGroup) {
      case 'Newborn (0-6 months)':
        if (hemo < 14) return 'Low';
        if (hemo > 24) return 'High';
        return 'Normal';

      case 'Infant (6-12 months)':
        if (hemo < 11) return 'Low';
        if (hemo > 17) return 'High';
        return 'Normal';

      case 'Young Children (1-6 years)':
        if (hemo < 9.5) return 'Low';
        if (hemo > 14) return 'High';
        return 'Normal';

      case 'Older Children (6-18 years)':
        if (hemo < 10) return 'Low';
        if (hemo > 15.5) return 'High';
        return 'Normal';

      case 'Young Adult Male':
        if (hemo < 13.8) return 'Low';
        if (hemo > 17.2) return 'High';
        return 'Normal';

      case 'Young Adult Female':
        if (hemo < 12.1) return 'Low';
        if (hemo > 15.1) return 'High';
        return 'Normal';

      case 'Older Adult Male':
        if (hemo < 12.4) return 'Low';
        if (hemo > 14.9) return 'High';
        return 'Normal';

      case 'Older Adult Female':
        if (hemo < 11.7) return 'Low';
        if (hemo > 13.8) return 'High';
        return 'Normal';

      default:
        return 'Unknown';
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
      await userServices.deleteUserByEmail(auth.user.email);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
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
    const email = `${patient.email}`;
    const password = `${patient.name}_${patient.age}`;

    const payload = {
      username,
      email,
      password,
      confirm_password: password,
    };

    try {
      const res = await authServices.signUp(payload);
      if (res) {
        setModalInfo({ email, password });
      } else {
        setModalInfo({ email: patient.email, password });
      }
    } catch (error) {
      console.error('Error generating credentials:', error);
      alert('Error generating credentials.');
    }
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
    email: Yup.string().required('Email is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setInitialValues({ ...values });
      const payload = {
        name: values.name,
        email: values.email,
        gender: values.gender,
        age: Number(values.age),
        hemo: Number(values.hemo),
        // ageGroup: getAgeGroup(values.age, values.gender),
        userId: auth.user.id,
      };
      try {
        if (values._id) {
          const updated = await hemoglobinService.updatePatient(values._id, payload);
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

  const previewAgeGroup = getAgeGroup(formik.values.age, formik.values.gender);
  const previewCategory = classifyHemoglobin(formik.values);

  const categoryCounts = useMemo(() => {
    const counts = { Low: 0, Normal: 0, High: 0 };
    patients.forEach((p) => counts[p.category]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  function CategoryBadge({ category }) {
    let className = '';
    if (category === 'Low') className = 'badge low';
    else if (category === 'High') className = 'badge high';
    else className = 'badge normal';
    return <span className={className}>{category}</span>;
  }

  return (
    <div className="relative min-h-screen">
      <div id="bgCells" className="bg-cells fixed inset-0 z-0 pointer-events-none overflow-hidden"></div>

      <div className="page-wrap relative z-10 flex justify-center items-start p-6 pt-12">
        <div className="container bg-white p-6 rounded-lg w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Interactive Hemoglobin Test Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {categoryCounts.map((c) => (
              <div key={c.name} className="bg-white shadow rounded p-4 text-center">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-3xl font-bold text-blue-700">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          {isAdminAuth && (
            <form onSubmit={formik.handleSubmit} className="bg-white shadow rounded p-6 mb-8 flex flex-col gap-4">
              <label className="flex flex-col">
                <span className="font-medium mb-1">Name</span>
                <input type="text" {...formik.getFieldProps('name')} className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />
                {formik.touched.name && formik.errors.name && <span className="text-red-600 text-sm">{formik.errors.name}</span>}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">Email</span>
                <input type="email" {...formik.getFieldProps('email')} className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />
                {formik.touched.email && formik.errors.email && <span className="text-red-600 text-sm">{formik.errors.email}</span>}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">Age</span>
                <input type="number" {...formik.getFieldProps('age')} className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />
                {/* {formik.touched.age && formik.errors.age && <span className="text-red-600 text-sm">{formik.errors.age}</span>} */}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">Gender</span>
                <select {...formik.getFieldProps('gender')} className="border p-2 rounded focus:ring-2 focus:ring-blue-400">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender && <span className="text-red-600 text-sm">{formik.errors.gender}</span>}
              </label>

              <label className="flex flex-col">
                <span className="font-medium mb-1">Hemoglobin Level (g/dL)</span>
                <input type="number" step="0.1" {...formik.getFieldProps('hemo')} className="border p-2 rounded focus:ring-2 focus:ring-blue-400" />
                {formik.touched.hemo && formik.errors.hemo && <span className="text-red-600 text-sm">{formik.errors.hemo}</span>}
              </label>

              {/* Preview */}
              <div className={`p-3 rounded mt-2 ${previewCategory.toLowerCase()}`}>
                <p><strong>Age Group:</strong> {previewAgeGroup}</p>
                <p>Classification: <CategoryBadge category={previewCategory} /></p>
                <p className="text-sm">{getSuggestion(previewCategory)}</p>
              </div>

              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded mt-2 hover:bg-blue-700 transition">
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
                  <th className="p-2 text-left">Age Group</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Suggestion</th>
                  {isAdminAuth && (
                    <>
                      <th className="p-2 text-left">Actions</th>
                      <th className="p-2 text-left">Generate Creds</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr key={p._id} className={`border-t hover:bg-gray-50 transition ${p.category?.toLowerCase()}`}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.age}</td>
                    <td className="p-2">{p.gender}</td>
                    <td className="p-2">{p.hemo}</td>
                    <td className="p-2">{getAgeGroup(p.age, p.gender)}</td>
                    <td className="p-2">
                      <CategoryBadge category={p.category} />
                    </td>
                    <td className="p-2">{getSuggestion(p.category)}</td>
                    {isAdminAuth && (
                      <>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800" title="Edit">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleGenerateCreds(p)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          >
                            <UserPlus size={16} /> Generate Credentials
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

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

          <footer className="text-xs text-gray-500 mt-6 text-center">
            Age-based thresholds are automatically applied.
          </footer>
        </div>
      </div>

      {/* Modal */}
      {modalInfo && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-xl font-bold mb-2">User Created!</h2>
            <p className="text-gray-700 mb-4">
              The user has been successfully created. Below are the credentials:
            </p>
            <div className="text-left mb-4">
              <p>
                <strong>Email:</strong> {modalInfo.email}
              </p>
              <p>
                <strong>Password:</strong> {modalInfo.password}
              </p>
            </div>
            <button
              onClick={() => setModalInfo(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}
