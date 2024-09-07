import "./LoginPage.css";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaSlack } from "react-icons/fa";
import { SiNuget } from "react-icons/si";
import { MdOutlineRemoveRedEye, MdOutlineTextFields, MdOutlineAddLocationAlt, MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { RiContactsBook2Line } from "react-icons/ri";
import axios from 'axios';
import { Link, useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';



const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [password, setPassword] = useState("");

    const [registerPassword, setRegisterPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const validateEmail = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValue) {
            setErrorMessage("Email is required");
        }

        else if (emailValue && !emailRegex.test(emailValue)) {
            setErrorMessage("Please enter a valid email address");
        } else {
            setErrorMessage("");
        }
    };



    const eye = () => {
        event.preventDefault();
        let eye = document.getElementById("password");
        if (eye.type === "password") {
            eye.type = "text";
        }
        else {
            eye.type = "password";
        }
    }



    const handelSubmit = async (e) => {
        e.preventDefault();
        const user = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            contactNumber: contact,
            email: email,
            password: registerPassword
        }

        if (registerPassword === confirmPassword) {
            console.log(user);

            const URL = "https://6y2en536ea.execute-api.us-east-1.amazonaws.com/dev/register"
            try {
                const response = await axios.post(URL, user);
                console.log(response);


                if (response.data.success) {
                    toast.success(response.data.message);
                   
                    navigate("/login");
                }
                else {
                    // If the response indicates failure, log it and show an error toast
                    console.log("Registration Failed hai", response.data.message);
                    toast.error(response.data.message);
                }






            }
            catch (error) {
                console.log("Registration Failed hai", error?.response?.data?.message);
                toast.error(error);
            }
        }
        // else{
        //     toast.error('Password must be same');
        // }


    }


    return (

        <div className="main">
            <div className="subMain">
                <div className="leftDiv" style={{ flex: 1 }}>


                    {/* Registration Form  */}

                    <form onSubmit={handelSubmit} id="RegistrationForms">
                        <h2 style={{ color: "blue" }}>dotwork</h2>
                        <h1 style={{ fontSize: "24px" }}>Register your Account</h1>


                        <div className="forms">
                            <div className="email">
                                <MdOutlineTextFields style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />

                                <input type="text" placeholder=" " value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                                <label htmlFor="">First Name</label>
                            </div>

                            <div className="email" style={{ marginTop: "10px", position: "relative" }}>

                                <MdOutlineTextFields style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="text" placeholder=" " value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                                <label htmlFor="">Last Name</label>
                            </div>

                            <div className="email" style={{ marginTop: "10px", position: "relative" }}>
                                <MdOutlineEmail style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="email" id="Remail" placeholder=" " value={email} onChange={validateEmail} />
                                <label htmlFor="Remail">Email</label>
                                {errorMessage && <span className="error-message" style={{ color: "red", fontSize: "12px" }}>{errorMessage}</span>}
                            </div>

                            <div className="email" style={{ marginTop: "10px", position: "relative" }}>
                                <RiContactsBook2Line style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="number" placeholder=" " value={contact} onChange={(e) => { setContact(e.target.value) }} />
                                <label htmlFor="">Contact Number</label>
                            </div>

                            <div className="email" style={{ marginTop: "10px", position: "relative" }}>
                                <MdOutlineAddLocationAlt style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="text" placeholder=" " value={address} onChange={(e) => { setAddress(e.target.value) }} />
                                <label htmlFor="">Address</label>
                            </div>

                            <div className="password" style={{ marginTop: "10px", position: "relative" }}>
                                <MdLockOutline style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="password" id="password" placeholder=" " value={registerPassword} onChange={(e) => { setRegisterPassword(e.target.value) }} onClick={eye} />
                                <label htmlFor="password">Password</label>
                                <button style={{
                                    position: "absolute", right: "15px", top: "11px", width: "fit-content", display: "flex", justifyContent: "center", alignItems: "center",
                                    padding: "0", backgroundColor: "transparent"
                                }} onClick={eye}><MdOutlineRemoveRedEye style={{ fontSize: "18px", color: "gray" }} /></button>
                            </div>

                            <div className="password" style={{ marginTop: "10px", position: "relative" }}>
                                <MdLockOutline style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                                <input type="password" id="passwords" placeholder=" " value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                <label htmlFor="password"> Confirm Password</label>
                                <button style={{
                                    position: "absolute", right: "15px", top: "11px", width: "fit-content", display: "flex", justifyContent: "center", alignItems: "center",
                                    padding: "0", backgroundColor: "transparent"
                                }} onClick={eye}><MdOutlineRemoveRedEye style={{ fontSize: "18px", color: "gray" }} /></button>
                            </div>





                            <button type="submit" style={{ width: "100%", backgroundColor: "#3434a2", color: "white", marginTop: "10px" }} className="submitButton">Sign up</button>
                            <p style={{}}>Already have an account? <Link to="/login" style={{ cursor: "pointer" }}>Log into your account</Link></p>



                        </div>

                    </form>
                </div>

                {/* Right Div  */}

                <div className="rightDiv" style={{ backgroundColor: "#3434a2", flex: 1, justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column", position: "relative" }}>
                    <div style={{ height: "350px", width: "350px", borderRadius: "50%", backgroundColor: "#bbdefb29", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ height: "240px", width: "240px", borderRadius: "50%", backgroundColor: "#5e5eef80", position: "relative" }}>
                            <img src="src\assets\image.png" alt="error" style={{ width: "150px", position: "absolute", right: "-30px", top: "30px" }} />

                            <div style={{
                                width: "50px", height: "50px", backgroundColor: "#ffffff52", position: "absolute", top: "165px", left: "10px",
                                borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"
                            }}>
                                <FcGoogle style={{
                                    width: "30px", backgroundColor: "white", height: "30px", padding: "5px", borderRadius: "50%"

                                }} />
                            </div>

                            <div style={{
                                width: "50px", height: "50px", backgroundColor: "#ffffff52", position: "absolute", top: "90px", left: "-25px",
                                borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"
                            }}>
                                <SiNuget style={{
                                    width: "30px", backgroundColor: "white", height: "30px", padding: "5px 7px 5px 4px", borderRadius: "50%", color: "blue",

                                }} />
                            </div>

                            <div style={{
                                width: "50px", height: "50px", backgroundColor: "#ffffff52", position: "absolute", top: "15px", left: "10px",
                                borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"
                            }}>
                                <FaSlack style={{
                                    width: "30px", backgroundColor: "white", height: "30px", padding: "5px", borderRadius: "50%",

                                }} />
                            </div>


                        </div>

                    </div>

                    <div style={{ position: "absolute", bottom: "10px", color: "white", }}>
                        <h3 style={{ textAlign: "center", marginBottom: "0px" }}>Connect with every application</h3>
                        <h5 style={{ fontWeight: "200", textAlign: "center", margin: "10px 0 20px" }}>Everything you need in an easily customizable dashboard</h5>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage
