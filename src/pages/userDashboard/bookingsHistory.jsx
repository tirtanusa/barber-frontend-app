const BookingHistory = ({ props }) => {

    return (
        <>
            <div className="mx-6 border-2 border-black p-3 text-black">
                <div className="text-black/70 font-azeretMono text-sm">
                    {props.booking_date.slice(0, 10)}
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-black font-inter font-bold text-md">
                        {props.service.name}
                    </div>
                    <div className="text-white bg-green-600 px-3 py-1 text-sm">
                        {props.status}
                    </div>
                </div>

            </div>
        </>
    )

}
export default BookingHistory;