import React from 'react';
import Icon from "../../assets/icon.png";
import Qr from "../../assets/Example-QR-code.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


import { faFacebook, faTiktok, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons';

import "./Footer.scss"
import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <div className='footer col-12'>
            {/* <div className='aboveDiv col-9'>
      <div className='part'></div>
      <div className='part'></div>
      <div className='part'></div>
    </div>*/}


            {/* <span>Your reliable partner for fast and secure global logistics solutions</span> 
       </div>  */}

            <div className='MainInfo col-11'>

                <div className='leftMain col-2'>
                    <div className='title1 col-9'>
                        <Link className='coll' to="/">
                            <img className='I33' src={Icon} />

                        </Link>
                    </div>
                </div>

                <div className='RightMain col-8'>
                    <div className=' colu col-12'>
                        <Link className='a' to="/">   <span>Home</span></Link>
                        <Link to="/AboutUs">      <span>About Us</span></Link>
                        <Link to="/ContactUs">  <span>Contact Us</span></Link>
                        <Link to="/Services">   <span>Packages </span></Link>
                        <Link to="/Packages">   <span>Booking </span></Link>
                        <Link to="/PolicyAndPrivacy">  <span>Policy And Privacy</span></Link>
                    </div>
                    {/* <div className=' coluIcon col-7 '>
                        <h5>Follow Us</h5>
                        <FontAwesomeIcon className='I22' icon={faFacebook} />
                        <FontAwesomeIcon className='I22' icon={faInstagramSquare} />
                        <FontAwesomeIcon className='I22' icon={faXTwitter} />
                        <FontAwesomeIcon className='I22' icon={faLinkedin} />
                        <FontAwesomeIcon className='I22' icon={faTiktok} />
                    </div> */}
                </div>
                <div className='MiddleQr col-2'>
                    <img src={Qr} />
                </div>
            </div>





            <div className='line col-12'></div>
            <div className='bottomDiv col-11'>
                <div className='leftBottom'>
                    <p>©All Rights Reserved @2024 Three angles portal services</p>

                </div>
                <div className='rightBottom '>
                    <p>| Do Not Sell or Share My Personal Information</p>

                </div>
            </div>
        </div>
    )
}
