import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../../assets/logo1.svg";
import GoogleSvg from "../../assets/Google1.svg";
import { CSSTransition } from "react-transition-group";
import Api from "../../api";


const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: ""
    });
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };


    const clearError = (field) => {
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleSignIn = async () => {

        setErrors({ email: "", password: "", general: "" });

   
        let hasError = false;
        if (!email) {
            setErrors(prev => ({ ...prev, email: "Email is required" }));
            hasError = true;
        } else if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
            hasError = true;
        }

        if (!password) {
            setErrors(prev => ({ ...prev, password: "Password is required" }));
            hasError = true;
        } else if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
            hasError = true;
        }

        if (hasError) return;

        setOverlayVisible(true);
        
        try {
            const response = await Api.post("/login", {
                email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);

                if (response.data.user.email === "superadmin@gmail.com") {
                    navigate("/admin/overview");
                } else if (response.data.user.email !== "superadmin@gmail.com") {
                    navigate("/user/overview-user");
                } else {
                    setErrors(prev => ({
                        ...prev,
                        general: "You don't have permission to access this area"
                    }));
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: "Invalid email or password"
                }));
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                general: err.response?.data?.message || "An error occurred during login"
            }));
        } finally {
            setOverlayVisible(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row relative">
            <CSSTransition
                in={isOverlayVisible}
                timeout={500}
                classNames="page-overlay"
                unmountOnExit
            >
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-500" />
            </CSSTransition>

            <div className="w-full lg:w-1/2 min-h-screen bg-white flex justify-center items-center">
                <div className="w-full max-w-md p-4 sm:p-8 bg-white rounded-lg">
                    <div className="mb-6 text-center">
                        <img src={Logo} alt="Logo" className="mx-auto w-32" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>
                        <p className="text-gray-500 mb-4">Please enter your details</p>

                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError('email');
                                    }}
                                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border 
                                        ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-600'}
                                        focus:outline-none`}
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 left-1
                                        ${errors.email ? 'text-red-500' : 'text-gray-500'}`}
                                >
                                    Email
                                </label>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearError('password');
                                    }}
                                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border 
                                        ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-600'}
                                        focus:outline-none pr-10`}
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="password"
                                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 left-1
                                        ${errors.password ? 'text-red-500' : 'text-gray-500'}`}
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleSignIn}
                                className="w-full p-3 bg-blue-600 text-white rounded-lg mb-2 hover:bg-blue-700 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                className="w-full p-3 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                                <img src={GoogleSvg} alt="Google" className="w-6 h-6 mr-2" />
                                Log In with Google
                            </button>
                        </form>

                        <div className="mt-4">
                            <p className="text-sm">
                                Don't have an account?{" "}
                                <span
                                    className="text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                        setOverlayVisible(true);
                                        setTimeout(() => {
                                            navigate("/signup");
                                        }, 500);
                                    }}
                                >
                                    Sign Up
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block w-full lg:w-1/2 min-h-screen relative overflow-hidden">
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
                    Welcome back!
                    <br />
                    Please login to continue.
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
