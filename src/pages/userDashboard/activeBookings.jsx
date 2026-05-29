import { Calendar, Clock } from "lucide-react"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";



const ActiveBookings = ({ props }) => {

    const { token } = useContext(AuthContext)

    const handleCancel = () => {
        axios.patch(`${import.meta.env.VITE_BASE_URL}/bookings/${props.id}/cancel`, {
            status: "cancelled"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

    }
    return (
        <>
            <div className="mx-6 border-2 border-black p-3">
                <div className="text-black/80 font-azeretMono text-sm">
                    Barber
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-black font-bold font-inter">
                        {props.barber.name}
                    </div>
                    <div className="text-black/80 font-azeretMono text-sm w-1/2 text-right truncate">{props.service.name}</div>
                </div>


                <div className="flex justify-between mt-4">

                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-black font-bold" />
                        <div className="flex flex-col">
                            <div className="text-black/80 font-azeretMono text-sm">Date</div>
                            <p className="text-black font-azeretMono font-bold">{props.booking_date.slice(0, 10)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-black font-bold" />
                        <div className="flex flex-col">
                            <div className="text-black/80 font-azeretMono text-sm">Time</div>
                            <p className="text-black font-azeretMono font-bold">{props.start_time.slice(0, 5)}</p>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end mt-4 " onClick={() => handleCancel()}>
                    <button className="cursor-pointer font-azeretMono text-sm text-black border-2 border-black bg-white hover:bg-black hover:text-white hover:border-white p-2">Cancel</button>
                </div>
            </div>

        </>
    )
}
export default ActiveBookings