import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./index.scss";
import { useAuth } from "../../store/auth";
import useLogin from "../../hooks/account/useLogin"; // Import useLogin hook
import appLogo from "../../assets/icon.png";

const LoginForm = () => {
  const { login1 } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.from?.pathname || "/";
  const { login, error } = useLogin(); // Use the useLogin hook

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { success, data, error } = await login({
          email: formData.email,
          password: formData.password,
        });

        if (success) {
          const { token, name, role } = data;
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", name);
          localStorage.setItem("role", role);

          login1(token, name);

          if (role === "SuperAdmin" || role === "FinanceAdmin" || role === "OperationAdmin") {
            navigate("/SA");
          } else {
            navigate(redirectPath);
          }
        } else {
          setLoginError(error || "An error occurred during login");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("An error occurred during login");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="col-12" id="LoginPage">
      <div className="content">
        <div className="col-12 col-md-7" id="imageSection">
          <div className="filter">
            <div className="col-12">
              <img className="LogoLogin" src={appLogo} alt="App Logo" />
            </div>
            <div className="col-12" id="mainContent">
              <h1 className="col-12">Welcome back!</h1>
              <p className="col-12">
                Get access to your Orders, Wishlist and Recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="col-6" id="formSection">
          <div>
            {" "}
            <h2 className="H2">Login</h2>
          </div>
          <form onSubmit={handleSubmit} className="col-10 login12">
            <div className=" col-10">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                className="input2 col-12"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error_Msg">{errors.email}</span>
              )}
            </div>
            <div className=" col-10">
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                className="input2 col-12"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error_Msg">{errors.password}</span>
              )}
            </div>
            {loginError && <div>{loginError}</div>}
            <div className="col-10">
              <button type="submit" className="col-12 btn">
                Login
              </button>
            </div>
          </form>
          <div className="col-12">
            <span className="Forget col-12">
              <Link className="Linko" to="/Forget">
                Forget Password
              </Link>
              <span className="margin">Or</span>
              <Link className="Linko" to="/SignUp">
                Not Have An Account ?
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;