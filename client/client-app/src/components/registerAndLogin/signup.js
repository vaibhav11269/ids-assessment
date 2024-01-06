import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import backgroundImg from '../../images/bg_image.jpg';
import axios from 'axios';
import { config } from '../../config/config';
import { enqueueSnackbar } from 'notistack';

const SignupPage = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3, 'Name should be atleast 3 characters').required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: (values) => {
            console.log('Signup submitted:', values);
            let headers = {
                "Content-Type": "application/json",
                "applicationType": "web"
            }
            axios.post(config.apiEndpoint + 'auth/signup', values, { headers: headers })
                .then(response => {
                    enqueueSnackbar(response?.data?.message, { variant: "success" });
                    navigate("/")
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
                <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name:
                        </label>
                        <input
                            className={`border ${formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                            type="text"
                            id="name"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                        )}
                    </div>
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
                        className="bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 focus:outline-none"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/" className="text-blue-500 hover:underline">
                        Already have an account? Log in here.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;