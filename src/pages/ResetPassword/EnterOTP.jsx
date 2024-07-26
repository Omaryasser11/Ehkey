import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { emailState } from '../../store/index';  // Path to your Recoil atoms file
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './EnterOTP.scss';  // Ensure you have the correct path to your SCSS file
import APIClient from '../../services/api-service';  // Update the path to the APIClient

export default function EnterOTP() {
    const navigate = useNavigate();
    const email = useRecoilValue(emailState);
    const [formData, setFormData] = useState({
        email: email,
        otp: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const client = new APIClient('/account/reset-password');

        try {
            const response = await client.post({
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            });

            const authToken = response.token;
            localStorage.setItem('authToken', authToken);

            Swal.fire({
                title: `Good job `,
                text: "Password Changed successfully!",
                icon: "success"
            });
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Big col-12">
            {loading && (
                <div className="loader">
                    <ThreeDots color="#25634c" height={80} width={80} />
                </div>
            )}
            {!loading && (
                <>
                    <h1>Enter Verification Code</h1>
                    <p>OTP sent to {formData.email}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="otp-field">
                            <input
                                type="text"
                                name="otp"
                                placeholder="OTP"
                                value={formData.otp}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="otp-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn">Enter</button>
                    </form>
                </>
            )}
        </div>
    );
}
