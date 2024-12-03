import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../../assets/logo1.svg";
import GoogleSvg from "../../assets/Google1.svg";
import Api from "../../api";
import { toast } from "react-toastify";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        if (pass.length < 8) return "Password harus minimal 8 karakter.";
        if (!/[A-Z]/.test(pass)) return "Password harus mengandung huruf besar.";
        if (!/[a-z]/.test(pass)) return "Password harus mengandung huruf kecil.";
        if (!/[0-9]/.test(pass)) return "Password harus mengandung angka.";
        return "";
    };

    const validateForm = () => {
        const newErrors = {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!fullName.trim()) newErrors.fullName = "Nama lengkap harus diisi.";
        if (!email.trim()) newErrors.email = "Email harus diisi.";
        if (!password) newErrors.password = "Password harus diisi.";
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Password tidak cocok.";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    };

    const checkIfUserExists = async (email) => {
        try {
            const response = await Api.post("/check-user", { email });
            return response.data.exists;
        } catch (error) {
            console.error("Error checking user existence:", error);
            return false;
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Mohon lengkapi semua field dengan benar.");
            return;
        }

        try {
            setIsLoading(true);

            const userExists = await checkIfUserExists(email);
            if (userExists) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: "Email sudah terdaftar.",
                }));
                setIsLoading(false);
                return;
            }

            const formData = {
                name: fullName,
                email: email,
                password: password,
                password_confirmation: confirmPassword,
            };

            const response = await Api.post("/register", formData);

            if (response.data.success) {
                toast.success("Registrasi berhasil!");
                navigate('/signin');
            }
        } catch (error) {
            if (error.response?.data) {
                toast.error("Registrasi gagal Gmail sudah tersedia. ");
            } else {
                toast.error("Registrasi gagal. Silakan coba lagi.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative bg-gray-100 lg:bg-white">
            {/* Gradient Section - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 min-h-screen relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(180deg, #00040F 0%, #214D76 100%)",
                    }}
                />
                <div className="absolute inset-0">
                    <div
                        className="absolute -top-1/4 left-1/4 w-96 h-96 rounded-full"
                        style={{
                            background: "rgba(33, 77, 118, 0.4)",
                            filter: "blur(80px)",
                        }}
                    />
                    <div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
                        style={{
                            background: "rgba(33, 77, 118, 0.4)",
                            filter: "blur(80px)",
                        }}
                    />
                </div>
                <div className="absolute left-4 lg:left-20 top-1/2 -translate-y-1/2 text-white text-3xl lg:text-5xl font-poppins italic font-thin leading-relaxed lg:leading-[67px] z-10 p-4">
                    Join us.
                    <br />
                    Create your account now!
                </div>
            </div>

            {/* Form Section - Show first on mobile */}
            <div className="w-full lg:w-1/2 min-h-screen flex justify-center items-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
                    {/* Logo */}
                    <div className="mb-6 text-center">
                        <img src={Logo} alt="Logo" className="mx-auto w-32" />
                    </div>

                    {/* Sign Up Form */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
                        <p className="text-gray-500 mb-4">Sign up to get started</p>

                        <form onSubmit={handleSignUp}>
                            {/* Form fields remain the same */}
                            {/* Full Name Input */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="fullName"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Full Name
                                </label>
                                {errors.fullName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="relative mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Email
                                </label>
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Password
                                </label>
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                )}
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Confirm Password
                                </label>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 mt-4 ${
                                    isLoading ? 'bg-blue-400' : 'bg-blue-600'
                                } text-white font-semibold rounded-lg`}
                            >
                                {isLoading ? 'Loading...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="my-4 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <span
                                    className="text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                        navigate("/signin");
                                    }}
                                >
                                    Sign In
                                </span>
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button className="w-full py-2 px-4 bg-white border rounded-lg flex items-center justify-center gap-2">
                                <img src={GoogleSvg} alt="Google Logo" className="w-5 h-5" />
                                Sign up with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;