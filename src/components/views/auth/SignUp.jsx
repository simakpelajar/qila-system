import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../../../assets/logo1.svg";
import GoogleSvg from "../../../assets/Google1.svg";
import { CSSTransition } from "react-transition-group";
import Api from "../../../api/index";
import axios from "axios";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {
        try {
            const response = await Api.post("/verify-email", { email });
            if (response.status === 200) {
                setShowSuccessPopup(false);
                navigate("/signin");
            }
        } catch (error) {
            console.error("Error verifying email:", error);
        }
    };

    const handleSignUp = async () => {
        setErrors({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    
        if (!fullName) {
            setErrors((prev) => ({
                ...prev,
                fullName: "Nama lengkap tidak boleh kosong.",
            }));
            return;
        }
    
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            setErrors((prev) => ({
                ...prev,
                email: "Email tidak valid.",
            }));
            return;
        }
    
        if (password !== confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Password dan konfirmasi password tidak cocok.",
            }));
            return;
        }
    
        const data = {
            name: fullName,
            email: email,
            password: password,
            password_confirmation: confirmPassword,
        };
    
        try {
            setOverlayVisible(true);
            const response = await Api.post("/register", data);
    
            if (response.status === 200) {
                setShowSuccessPopup(true); // Menampilkan popup sukses
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data.errors;
    
                if (errorData?.email) {
                    setErrors((prev) => ({
                        ...prev,
                        email: "Email sudah terdaftar.",
                    }));
                } else {
                    setErrors({
                        fullName: errorData?.name || "",
                        email: errorData?.email || "",
                        password: errorData?.password || "",
                        confirmPassword: errorData?.password_confirmation || "",
                    });
                }
            } else {
                console.error("Error registrasi:", error);
                alert("Terjadi kesalahan, coba lagi.");
            }
        } finally {
            setOverlayVisible(false);
        }
    };
        
    return (
        <div className="h-screen flex relative">
            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-center mb-4">
                            Selamat!
                        </h3>
                        <p className="text-center text-gray-600 mb-6">
                            Akun Anda berhasil didaftarkan. Silakan verifikasi email Anda untuk melanjutkan.
                        </p>
                        <button
                            onClick={handleVerifyEmail}
                            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Verifikasi Email
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay */}
            <CSSTransition
                in={isOverlayVisible}
                timeout={500}
                classNames="page-overlay"
                unmountOnExit
            >
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-500" />
            </CSSTransition>

            {/* Left Side with New Gradient and Blur Effect */}
            <div className="w-1/2 h-full relative overflow-hidden">
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
                <div className="absolute left-20 top-48 text-white text-5xl font-poppins italic font-thin leading-[67px] z-10">
                    Join us.
                    <br />
                    Create your account now!
                </div>
            </div>

            {/* Right Side */}
            <div className="w-1/2 h-full bg-white flex justify-center items-center">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    {/* Logo */}
                    <div className="mb-6 text-center">
                        <img src={Logo} alt="Logo" className="mx-auto w-32" />
                    </div>

                    {/* Sign Up Form */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
                        <p className="text-gray-500 mb-4">Sign up to get started</p>

                        <form>
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
                                type="button"
                                onClick={handleSignUp}
                                className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="my-4 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <a href="/signin" className="text-blue-600 font-medium">Sign in</a>
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