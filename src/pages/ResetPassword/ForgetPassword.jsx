import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { emailState } from '../../store/index'; // Path to your Recoil atoms file
import { Link, useNavigate } from 'react-router-dom';
import "./ForgetPassword.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import APIClient from '../../services/api-service'; // Adjust the path accordingly
import { ThreeDots } from 'react-loader-spinner';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useRecoilState(emailState);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const apiClient = new APIClient('/account/send-email-reset-password');

        try {
            const response = await apiClient.post({ email }, '', 'application/json');

            Swal.fire({
                title: `Good job`,
                text: "Password reset email sent successfully!",
                icon: "success"
            });
            navigate('/EnterOTP');
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to send password reset email!",
            });
            console.error('Error occurred while sending password reset request:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="containerForm col-12">
      {loading && (
                <div className="loader">
                    <ThreeDots
                        color="#25634c"
                        height={80}
                        width={80}
                    />
                </div>
            )}
            {!loading && (
                <div className="text-center col-12">
                    <FontAwesomeIcon className='icon' icon={faLock} />
                    <h2 className="text-center">Forgot Password?</h2>
                    <p className='pr'>You can reset your password here.</p>
                    <div className="panel-body col-12">
                        <form id="register-form" role="form" autoComplete="off" className="formo col-6" onSubmit={handleSubmit}>
                            <div className="form-group col-12">
                                <div className='backInput col-12'>
                                    <TextField 
                                        id="outlined-basic"
                                        label="Email"
                                        variant="outlined"
                                        name="email"
                                        className="col-12"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn col-12" type="submit">
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
