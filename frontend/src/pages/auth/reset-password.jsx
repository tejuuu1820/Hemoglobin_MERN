import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authServices from "../../services/auth.service";
import { Info } from "lucide-react";
import BaseLoading from "../../components/loader/config-loading";

function ResetPassword() {
    const { token } = useParams()
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        password: "",
        confirm_password: '',
        token: ''
    });
    const navigate = useNavigate()
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('')


    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            try {
                const payload = {
                    password: values.password,
                    confirm_password: values.confirm_password,
                    token: token
                }
                const res = await authServices.resetPassword(payload);
                if (res) {
                    setStatus(null);
                    setLoading(false);
                    setMessage("Password updated successfully")
                    // return navigate('/auth')
                }
            } catch (error) {
                console.error(error);
                setStatus(error.response.data.message)

            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        },
    });

    return (
        <BaseLoading loading={loading}>
            <form
                className="w-full max-w-md p-6 bg-gray-800 text-white rounded-lg shadow-md md:max-w-lg lg:max-w-xl"
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}
                noValidate
                id="kt_login_signin_form"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        Forgot your password
                    </h1>
                    <div className="text-gray-400 text-sm">
                        <div className="text-gray-400 text-sm">
                            New Here? {" "}
                            <Link
                                to={'/auth/registration/customer'}
                                className="text-blue-500 font-bold"
                            >
                                Create an Account
                            </Link>
                        </div>
                    </div>
                </div>

                {formik.status && (
                    <div className="mb-4 text-red-500 font-medium">
                        <div>{formik.status}</div>
                    </div>
                )}

                {message && <div className="text-blue-300 mb-4 flex gap-4 items-center">
                    <Info />
                    {message}
                </div>}


                <div className="space-y-4">
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

                    <div>
                        <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...formik.getFieldProps("confirm_password")}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring focus:ring-blue-500"
                            autoComplete="off"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>

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

export default ResetPassword;
