import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BaseLoading from '../../components/loader/config-loading';
import { ROLE_MODE } from '../../constants';
import authServices from '../../services/auth.service';

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isAdminSignup = location.pathname === '/auth/registration/admin';

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const payload = {
          username: values.username,
          email: values.email,
          password: values.password,
          confirm_password: values.confirm_password,
          role: ROLE_MODE,
        };
        const response = await authServices.signUp(payload);
        if (response) {
          setLoading(false);
          navigate('/auth');
          return;
        }
        setStatus('Invalid credentials');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <BaseLoading loading={loading}>
      <form
        className="w-full max-w-md p-2 lg:p-6  text-black rounded-lg md:max-w-lg lg:max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        noValidate
        id="kt_login_signin_form"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <div className="text-gray-400 text-sm">
            Already have an Account?{' '}
            <Link to={'/auth'} className="text-blue-500 font-bold">
              Login
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
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              placeholder="Enter username"
              {...formik.getFieldProps('username')}
              className="w-full px-4 py-2  border border-gray-600 rounded-md text-black focus:ring focus:ring-blue-500"
              type="text"
              name="username"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              placeholder="Enter email"
              {...formik.getFieldProps('email')}
              className="w-full px-4 py-2  border border-gray-600 rounded-md text-black focus:ring focus:ring-blue-500"
              type="email"
              name="email"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                className="w-full px-4 py-2  border border-gray-600 rounded-md text-black focus:ring focus:ring-blue-500"
                autoComplete="off"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 focus:outline-none hover:text-gray-200"
              >
                <i
                  className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...formik.getFieldProps('confirm_password')}
              className="w-full px-4 py-2  border border-gray-600 rounded-md text-black focus:ring focus:ring-blue-500"
              autoComplete="off"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded-md shadow-md transition duration-200 disabled:bg-gray-600"
            disabled={formik.isSubmitting}
            onClick={() => setIsButtonClicked(true)}
          >
            {loading && isButtonClicked ? (
              <span>
                Please wait...
                <span className="ml-2 spinner-border spinner-border-sm"></span>
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </BaseLoading>
  );
}

export default SignUp;
