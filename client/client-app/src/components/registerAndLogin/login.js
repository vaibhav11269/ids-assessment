import backgroundImg from '../../images/bg_image.jpg';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { config } from '../../config/config';
import { enqueueSnackbar } from 'notistack';

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Login submitted:', values);
            let headers = {
                "Content-Type": "application/json",
                "applicationType": "web"
            }
            axios.post(config.apiEndpoint + 'auth/login', values, { headers: headers })
                .then(response => {
                    enqueueSnackbar(response?.data?.message, { variant: "success" });
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", response.data.user);
                    // navigate("/")
                })
                .catch(error => {
                    enqueueSnackbar(error?.response?.data?.error, { variant: "error" })
                })
        },
    });

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className={`border ${formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                            type="email"
                            id="email"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className={`border ${formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                            type="password"
                            id="password"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 focus:outline-none"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/signup" className="text-green-500 hover:underline">
                        Don't have an account? Sign up here.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
