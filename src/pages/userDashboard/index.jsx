import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import ActiveBookings from "./activeBookings";
const UserDashboard = () => {
    const { user } = useContext(AuthContext)
    return (
        <>
            <div className="flex flex-col mx-auto px-6 py-6">

                <Link to="/"
                    className="flex items-center gap-2 font-mono text-xs text-black/90 hover:text-black tracking-widest uppercase mb-10 transition-colors duration-200">
                    <ArrowLeft size={14} /> Back to Home
                </Link>
                <p className="flex items-center gap-2 font-azeretMono text-xs text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">
                    Halo,
                </p>
                <h1 className="font-inter font-black text-[36px] md:text-[56px] uppercase leading-none text-black truncate">
                    {user ? user.name.split(" ").slice(0, 1) : "User"}
                </h1>
            </div>

            <div className="flex items-start gap-4 mx-6 mt-10 ">
                <div className="w-3 h-3 bg-secondary/70 mt-1"></div>
                <p className="font-azeretMono text-sm text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">Active Booking</p>
            </div>
            <ActiveBookings />

            <div className="flex items-start gap-4 mx-6 mt-10 ">
                <div className="w-3 h-3 bg-black/60 mt-1"></div>
                <p className="font-azeretMono text-sm text-black/90 hover:text-black tracking-widest uppercase mb-2 transition-colors duration-200">Booking History</p>
            </div>

            <div className="absolute bottom-5 right-6">
                <div className="p-2 bg-black flex items-center justify-center gap-2">
                    <Plus size={22} /> Book Now
                </div>

            </div>
        </>
    )

}
export default UserDashboard;