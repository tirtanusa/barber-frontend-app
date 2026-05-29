import BarberCard from "./BarberCard";
import ServiceTable from "./ServiceTable";
import logo from "../../assets/logo-polos.png";
import heroImage from "../../assets/hero-image.jpg";
import OurWorks from "./OurWorks";
import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

const base_url = import.meta.env.VITE_BASE_URL;


const heroNavLinks = [
  { label: "Home", href: "#hero" },
  { label: "Service", href: "#service" },
  { label: "Our Work", href: "#our-works" },
  { label: "The Artist", href: "#the-artist" },
];

const handleNavClick = (e, href) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};



const Dashboard = () => {
  useReveal();
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const { isLoggedin, user, logout } = useContext(AuthContext)


  useEffect(() => {
    axios.get(base_url + '/barber')
      .then((res) => {
        setBarbers(res.data.data.data)
      })
      .catch((err) => console.log(err))

    axios.get(base_url + "/services")
      .then((res) => {
        setServices(res.data.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      {/* Hero */}
      <section
        id="hero"
        className="min-h-[calc(100vh-4rem)] flex flex-col justify-between"
      >
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-center sm:items-start mb-6 md:mb-2 gap-4 sm:gap-0 reveal">
          <div className="flex h-fit md:h-[293px]">
            <img
              src={logo}
              alt="Logo Barber"
              className="w-[100px] md:w-[155px] object-fill"
            />
            <div className="h-fit md:h-[293px] flex flex-col justify-between py-2 md:pt-7 md:pb-14 gap-4 md:gap-0">
              <div className="flex flex-col gap-0 space-y-0">
                {heroNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="nav-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <Link
                to='/booking'
                className="nav-link"
              >
                Book Now
              </Link>
            </div>
          </div>
          {user ? (
            <div className="flex items-end gap-4 mx-6 my-6">
              <p className="text-black font-inter text-3xl font-semibold">
                Halo, <span className="underline">{user.name}</span>
              </p>
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                className="nav-link border-2 border-black p-2.5 px-4 text-black hover:text-white hover:bg-black transition-colors duration-300 font-mono text-xs uppercase tracking-wider font-bold"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="nav-link border-2 p-3 text-black hover:text-white hover:bg-red-600 transition-colors duration-300 cursor-pointer"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8 mt-2 md:mt-4 px-4 md:px-6">
              <Link to='/register' className="cursor-pointer nav-link">Sign Up</Link>
              <Link to="/login" className="cursor-pointer nav-link text-white bg-black  w-fit px-8 py-2">Login</Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end flex-1 mt-17 md:mt-8 lg:mt-auto gap-8 lg:gap-4 w-full">
          <h1
            className="text-black text-[40px] sm:text-[64px] md:text-[80px] lg:text-[96px] w-full lg:w-[853px] px-4 md:px-6 leading-tight uppercase font-inter reveal-left"
            style={{ transitionDelay: "100ms" }}
          >
            PREMIUM CUTS FOR MODERN MEN
          </h1>
          <div
            className="w-full lg:max-w-[1022px] flex flex-col gap-6 px-4 md:px-0 reveal-right"
            style={{ transitionDelay: "200ms" }}
          >
            <p className="text-[14px] md:text-[15px] text-black w-full lg:w-[873px] leading-relaxed">
              Founded in 2026, we are committed to delivering premium grooming
              experiences with modern style, professional barbers, and
              personalized services for every customer. We believe that a
              haircut is more than just appearance. It is about confidence,
              comfort, and self-expression. Through our online barber platform,
              we make booking easier, faster, and more convenient so you can
              enjoy quality grooming anytime you need.
            </p>
            <div className="overflow-clip h-[300px] md:h-[550px] w-full">
              <img
                src={heroImage}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service */}
      <section id="service" className="mb-12">
        <h1 className="section-title my-6 w-full text-center reveal">SERVICE</h1>
        <div className="reveal" style={{ transitionDelay: "150ms" }}>
          <ServiceTable services={services} />
        </div>
      </section>

      <div id="our-works" className="reveal-scale">
        <OurWorks />
      </div>

      {/* The Artisans */}
      <section id="the-artist" className="bg-neutral reveal">
        <BarberCard barbers={barbers} />
      </section>
    </>
  );
};

export default Dashboard;