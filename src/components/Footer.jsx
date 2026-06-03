import logo from "../assets/logo-putih.png";

const Footer = () => {
    return (
        <>
            <div className="bg-tertiary px-6 md:px-12 pt-8 pb-6 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8">
                {/* Logo */}
                <img src={logo} alt="Logo Barber" className="h-32 md:h-40 object-contain shrink-0" />

                {/* Info grid — 1 kolom di mobile, 2 kolom di md+ */}
                <div className="text-white grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 w-full lg:w-auto">
                    {/* Contact */}
                    <div>
                        <p className="font-bold text-lg mb-4">Contact</p>
                        <p className="font-azeretMono text-sm">info@barber.id</p>
                        <p className="font-azeretMono text-sm">Jl. AMBArawa No. 42</p>
                        <p className="font-azeretMono text-sm">+62 812-3456-7890</p>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <p className="font-bold text-lg mb-4">Working Hours</p>
                        <p className="font-azeretMono text-sm">Monday - Friday : 09.00 - 22.00</p>
                        <p className="font-azeretMono text-sm">Saturday - Sunday : 09.00 - 23.00</p>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <p className="text-white font-azeretMono text-xs md:text-sm bg-tertiary w-full py-3 text-center border-t border-white/10">
                Copyright © 2024 Barber.id All rights reserved.
            </p>
        </>
    );
};

export default Footer;