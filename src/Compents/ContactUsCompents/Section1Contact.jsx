import React, { useState } from "react";
import "./Section1Contact.scss";
import useContact from "../../hooks/contact/useContact";
import Spiner from "../../Spinner/Spinner";

export default function Section1Contact() {
  const { success, error, submitContactForm } = useContact();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await submitContactForm(formData);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission failed", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section className="col-12 section1Contact">
      <div className="container">
        <div className="row">
          <h1 className="H1">Contact us</h1>
        </div>
        <div className="row">
          <h4 className="H4" style={{ textAlign: "center" }}>
            We'd love to hear from you!
          </h4>
        </div>
        <form className="row" onSubmit={handleSubmit}>
          <div className="row flexR col-12">
            <div className="col-6 flex">
              <div className="col-12">
                <div className="styled-input wide">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label>Name</label>
                </div>
              </div>
              <div className="col-12 flexRSB1">
                <div className="col-6 v">
                  <div className="styled-input col-12">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label>Email</label>
                  </div>
                </div>
                <div className="col-6 v">
                  <div className="styled-input col-12">
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                    <label>Phone Number</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 msg">
              <div className="col-xs-12">
                <div className="styled-input wide">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label>Message</label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 btn-C">
              <button type="submit" className="btn-lrg submit-btn col-2" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>

          {success && (
            <div className="col-xs-12 success-message">
              Your message has been sent successfully!
            </div>
          )}
          {error && <div className="col-xs-12 error-message">{error}</div>}
        </form>
        {loading && (
          <div className="loader">
            <Spiner />
          </div>
        )}
      </div>
    </section>
  );
}
