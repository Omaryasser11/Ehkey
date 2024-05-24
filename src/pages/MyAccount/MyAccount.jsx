import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import axios from "axios";
import "./MyAccount.scss";
import useAccountData from "../../hooks/account/useAccountData";
import useUpdateAccount from "../../hooks/account/useUpdateAccount";
import CreditCardPage from "../../Compents/MyAccountCompents/CreditCardPage/CreditCardPage.jsx"
import Swal from 'sweetalert2'
import MyOrders from "../../Compents/MyAccountCompents/MyOrders/MyOrders.jsx";
export default function MyAccount() {
  const { data, getAccountData } = useAccountData();
  const { success, error, updateAccount } = useUpdateAccount();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    role: "",
    status: "",
    totalSessions: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("information");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      getAccountData(token);
    }
  }, [token]);

  useEffect(() => {
    if (data && !isEditing) {
      const [firstName, lastName] = data.name.split(" ");
      setUser({ ...data, firstName, lastName });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const requestBody = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        country: user.country,
      };
      updateAccount(requestBody, token);

      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Bad Request:", error.response.data);
      } else {
        console.error("Error saving user data:", error.message);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logged Out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout !"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: "Logout",
          text: "Your is Logged Out",
          icon: "success"
        });
        auth.logout();
        navigate("/");
      }
    });




  };

  return (
    <div className="MyAccount col-12 flex">
      <h2 className="col-10">MyAccount</h2>
      <div className="col-10 MainInfo3">

        <div className="col-3 Lefto">
          <span className="welcome col-9" style={{ color: '#25634c', textAlign: 'center', fontSize: '1.25rem' }}>
            Welcome {auth.user}
          </span>
          <button
            onClick={() => handleSectionClick("information")}
            className={`Information ${activeSection === "information" ? "clicked" : "Mbtn" } col-9`}
          >
            My Information
          </button>
          <button
            onClick={() => handleSectionClick("myOrders")}
            className={`Information ${activeSection === "myOrders" ? "clicked5" : "Mbtn"
              } col-9`}
          >
            My Orders
          </button>
          <button
            onClick={() => handleSectionClick("payment")}
            className={`Information ${activeSection === "payment" ? "clicked" : "Mbtn"
              } col-9`}
          >
            Payment Info
          </button>

          <button
            onClick={() => handleSectionClick("remove")}
            className={`Information ${activeSection === "remove" ? "clicked3" : "MbtnR"
              } col-9`}
          >
            Remove My Account
          </button>
          <button
            onClick={handleLogout}
            className={`Information ${activeSection === "Logout" ? "clicked4" : "Mbtn"
              } col-9`}
          >
            Logout
          </button>
        </div>
        <div className="col-8 mainAcc">
          {activeSection === "information" && (
            <div className="user-profile col-12">
              <table className="col-10">
                <tbody>
                  <tr>
                    <td>ID:</td>
                    <td>{user.id}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>First Name:</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleChange}
                        />
                      ) : (
                        <span>{user.firstName}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Name:</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleChange}
                        />
                      ) : (
                        <span>{user.lastName}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Phone:</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={user.phone}
                          onChange={handleChange}
                        />
                      ) : (
                        <span>{user.phone}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={user.country}
                          onChange={handleChange}
                        />
                      ) : (
                        <span>{user.country}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Sessions:</td>
                    <td>{user.totalSessions}</td>
                  </tr>
                </tbody>
              </table>
              {isEditing ? (
                <div className="col-10 flex">
                  <button onClick={handleSave}>Save</button>
                </div>
              ) : (
                <div className="col-10 flex">
                  <button onClick={handleEdit}>Edit</button>
                </div>
              )}
            </div>
          )}
          {activeSection === "payment" &&

            (
              <>

                <CreditCardPage />

              </>

            )
          }
          {activeSection === "remove" &&
            (
              <div className="flex col-12">
                <h2>Delete my Account</h2>
                <span className="Warring"> Mr.{auth.user} ,Do you want to Remove Your Account </span>
                <div className="col-10 flexR buttons">
                  <button className="btn">Yes</button>
                  <button className="btn">No</button>
                </div>
              </div>


            )
          }
          {
            activeSection === "myOrders" &&
            (
              <div className="flex col-12">
                <MyOrders />
              </div>
            )
          }

        </div>

      </div>


    </div >
  );
}
