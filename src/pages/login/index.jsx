import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import loginImage from '../../assets/login-pattern.jpg';
import useReveal from '../../hooks/useReveal';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'

const INPUT_CLASS = "border-b border-black/20 focus:border-black outline-none py-2 font-inter text-sm bg-transparent transition-colors duration-200 w-full";
const LABEL_CLASS = "font-inter text-xs text-black/50 tracking-widest uppercase";

const InputField = ({ label, type = "text", placeholder, icon: Icon, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>{label}</label>
        <div className="flex items-center border-b border-black/20 focus-within:border-black transition-colors duration-200">
            <input type={type} placeholder={placeholder} className="outline-none py-2 font-inter text-sm text-black bg-transparent w-full" value={value} onChange={onChange} />
            <Icon size={16} className="text-black/30 shrink-0 ml-2" />
        </div>
    </div>
);

const Login = () => {
    useReveal();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                email,
                password,
            });

            await login(res.data.data.access_token); // AuthProvider handle sisanya
            navigate("/");

        } catch (err) {
            setError(err.response?.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Email", type: "email", placeholder: "you@example.com", icon: Mail, onChange: (e) => setEmail(e.target.value), value: email },
        { label: "Password", type: "password", placeholder: "••••••••", icon: Lock, onChange: (e) => setPassword(e.target.value), value: password },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div
                className="flex w-full max-w-4xl border-2 border-neutral overflow-hidden"
                style={{ boxShadow: "-18px 10px 31px -1px var(--color-neutral)" }}
            >
                {/* Kiri — Form */}
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-12 bg-white reveal-left">
                    {/* Back to home */}
                    <Link to="/" className="flex items-center gap-1 text-black/40 hover:text-black font-inter text-xs tracking-widest self-start mb-8 transition-colors duration-200">
                        <ArrowLeft size={14} />
                        BACK TO HOME
                    </Link>

                    {/* Icon */}
                    <div className="mb-4 reveal" style={{ transitionDelay: "100ms" }}>
                        <LogIn size={22} className="text-black" />
                    </div>

                    <h1 className="font-inter text-[28px] font-bold text-black mb-2 reveal" style={{ transitionDelay: "150ms" }}>Welcome Back</h1>
                    <p className="font-inter text-sm text-black/50 mb-10 reveal" style={{ transitionDelay: "200ms" }}>Login to your account</p>

                    {error && (
                        <p className="font-inter text-xs text-red-500 text-center">{error}</p>
                    )}


                    <div className="flex flex-col w-full gap-5 reveal" style={{ transitionDelay: "280ms" }}>
                        {fields.map((field) => (
                            <InputField key={field.label} {...field} />
                        ))}

                        <div className="flex justify-end">
                            <Link to="/forgot" className="font-inter text-xs text-black/40 hover:text-black transition-colors duration-200">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-2 bg-black text-white font-inter text-sm tracking-widest py-3 hover:bg-neutral transition-colors duration-200 cursor-pointer"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>


                        <p className="font-inter text-xs text-black/40 text-center">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-black font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Kanan — Image */}
                <div className="hidden md:block w-1/2 relative reveal-right" style={{ transitionDelay: "100ms" }}>
                    <img src={loginImage} alt="Login visual" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Login;