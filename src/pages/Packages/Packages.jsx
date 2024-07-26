import React, { useState } from "react";
import "./Packages.scss";

import AppointmentBooking from "../../Compents/Booking/AppointmentBooking";
import MySession from "../../Compents/MySession/MySession";

export default function Packages() {
  const [activeSection, setActiveSection] = useState("Book");
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };
  return (
    <section className="bookSession col-12 ">
      <div className="flexR col-12 Bar">
        <button
          onClick={() => handleSectionClick("Book")}
          className={`btn1 ${activeSection === "Book" ? "clicked" : "Mbtn"} `}
        >
          {" "}
          Book Session
        </button>
        <button
          onClick={() => handleSectionClick("mySession")}
          className={`btn1 ${activeSection === "mySession" ? "clicked" : "Mbtn"
            } `}
        >
          My sessions
        </button>
      </div>
      <div className=" col-10 mainL">
        {activeSection === "Book" && <AppointmentBooking />}
        {activeSection === "mySession" && <MySession />}
      </div>
    </section>
  );
}
