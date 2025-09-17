import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import authServices from "../../services/auth.service";
import { useAuth } from "../../context/auth-context";
import BaseLoading from "../../components/loader/config-loading";

function Login() {
    const { setIsAuth } = useAuth();

    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        email: "",
        password: ""
    });
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: async (values, { setStatus, setSubmitting, setFieldValue }) => {
            setLoading(true);
            try {
                const res = await authServices.login(values)
                if (res) {
                    setStatus(null);
                    setLoading(false);
                    setIsAuth(true);
                    return;
                }
                setStatus("Invalid credentials");
            } catch (error) {
                console.error(error);
                setStatus(error);

            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        },
    });

    return (
        <BaseLoading loading={loading}>
            <form
                className="w-full max-w-md p-2 lg:p-6 bg-gray-800 text-white rounded-lg shadow-md md:max-w-lg lg:max-w-xl"
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}
                noValidate
                id="kt_login_signin_form"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        Login In
                    </h1>
                    <div className="text-gray-400 text-sm">
                        New Here? {" "}
                        <Link
                            to={'/auth/signup'}
                            className="text-blue-500 font-bold"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>

                {formik.status && (
                    <div className="mb-4 text-red-500 font-medium">
                        <div>{formik.status}</div>
                    </div>
                )}

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            placeholder="Enter email"
                            {...formik.getFieldProps("email")}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring focus:ring-blue-500"
                            type="email"
                            name="email"
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <div className="flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...formik.getFieldProps("password")}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring focus:ring-blue-500"
                                autoComplete="off"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-2 text-gray-400 focus:outline-none hover:text-gray-200"
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                            </button>
                        </div>
                    </div>
                </div>
                <span className="text-sm text-gray-500">Forgotten Password?{" "}
                    <Link to={'/auth/forgot-password'} className="hover:underline text-blue-500">Click Here</Link>
                </span>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md transition duration-200 disabled:bg-gray-600"
                        disabled={formik.isSubmitting}
                        onClick={() => setIsButtonClicked(true)}
                    >
                        {loading && isButtonClicked ? (
                            <span>
                                Please wait...
                                <span className="ml-2 spinner-border spinner-border-sm"></span>
                            </span>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </form>

        </BaseLoading>
    );
}

export default Login;
