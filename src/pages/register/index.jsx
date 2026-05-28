import { Link } from "react-router-dom";
import { PenLine, Mail, Lock, User, Smartphone, ArrowLeft } from "lucide-react";
import loginImage from '../../assets/login-pattern.jpg';
import useReveal from '../../hooks/useReveal';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LABEL_CLASS = "font-inter text-xs text-black/50 tracking-widest uppercase";

const InputField = ({ label, type = "text", placeholder, icon: Icon, value, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>{label}</label>
        <div className="flex items-center border-b border-black/20 focus-within:border-black transition-colors duration-200">
            <input type={type} placeholder={placeholder} className="outline-none py-2 font-inter text-black text-sm bg-transparent w-full" value={value} onChange={onChange} />
            <Icon size={16} className="text-black/30 shrink-0 ml-2" />
        </div>
    </div>
);

const Register = () => {
    useReveal();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setConfirmPassword] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
                name,
                email,
                password,
                password_confirmation,
                phone_number,
            });
            navigate("/login");

        } catch (err) {
            setError(err.response?.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Full Name", type: "text", placeholder: "John Doe", icon: User, value: name, onChange: (e) => setName(e.target.value) },
        { label: "Email Address", type: "email", placeholder: "you@example.com", icon: Mail, value: email, onChange: (e) => setEmail(e.target.value) },
        { label: "Password", type: "password", placeholder: "••••••••", icon: Lock, value: password, onChange: (e) => setPassword(e.target.value) },
        { label: "Password Confirmation", type: "password", placeholder: "••••••••", icon: Lock, value: password_confirmation, onChange: (e) => setConfirmPassword(e.target.value) },
        { label: "Phone Number", type: "tel", placeholder: "+62 812-3456-7890", icon: Smartphone, value: phone_number, onChange: (e) => setPhoneNumber(e.target.value) },
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
                        <PenLine size={22} className="text-black" />
                    </div>

                    <h1 className="font-inter text-[28px] font-bold text-black mb-2 reveal" style={{ transitionDelay: "150ms" }}>Create Account</h1>
                    <p className="font-inter text-sm text-black/50 mb-10 reveal" style={{ transitionDelay: "200ms" }}>Register to get started</p>
                    {error && (
                        <p className="font-inter text-xs text-red-500 text-center">{error}</p>
                    )}

                    <div className="flex flex-col w-full gap-5 reveal" style={{ transitionDelay: "280ms" }}>
                        {fields.map((field) => (
                            <InputField key={field.label} {...field} />
                        ))}

                        <button
                            type="submit"
                            className="mt-2 bg-black text-white font-inter text-sm tracking-widest py-3 hover:bg-neutral transition-colors duration-200"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Submitting...." : "Create Account"}
                        </button>

                        <p className="font-inter text-xs text-black/40 text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-black font-semibold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Kanan — Image */}
                <div className="hidden md:block w-1/2 relative reveal-right" style={{ transitionDelay: "100ms" }}>
                    <img src={loginImage} alt="Register visual" className="w-full h-full object-cover" />

                </div>
            </div>
        </div>
    );
};

export default Register;