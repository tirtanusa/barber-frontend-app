import { Calendar, Clock } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
const ActiveBookings = ({ props }) => {
    const [bookings, setBookings] = useState([])
    const { token } = useContext(AuthContext)
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/bookings/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log("Booking :", res.data.data.data)
                setBookings(res.data)
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <>
            <div className="mx-6 border-2 border-black p-3">
                <div className="text-black/80 font-azeretMono text-sm">
                    Barber
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-black font-bold font-inter">
                        Barber Name
                    </div>
                    <div className="text-black/80 font-azeretMono text-sm w-1/2 text-right truncate">Service Name</div>
                </div>


                <div className="flex justify-between mt-4">

                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-black font-bold" />
                        <div className="flex flex-col">
                            <div className="text-black/80 font-azeretMono text-sm">Date</div>
                            <p className="text-black font-azeretMono font-bold">2026-5-30</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-black font-bold" />
                        <div className="flex flex-col">
                            <div className="text-black/80 font-azeretMono text-sm">Time</div>
                            <p className="text-black font-azeretMono font-bold">10:00</p>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end mt-4 ">
                    <button className="cursor-pointer font-azeretMono text-sm text-black border-2 border-black bg-white hover:bg-black hover:text-white hover:border-white p-2">Cancel</button>
                </div>
            </div>

        </>
    )
}
export default ActiveBookings