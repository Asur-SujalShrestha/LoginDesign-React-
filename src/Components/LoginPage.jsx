import "./LoginPage.css";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaSlack } from "react-icons/fa";
import { MdOutlineRemoveRedEye, MdOutlineTextFields, MdOutlineAddLocationAlt, MdOutlineEmail,MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { SiNuget } from "react-icons/si";
import axios from "axios";
import toast from "react-hot-toast";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const user={
    email:email,
    password: password
  }

  const handelForm=async(e)=>{
    e.preventDefault();

    
    const URL = "http://localhost:8090/api/employee/loginToken";
    try{
      const response = await axios.post(URL, user);
      toast.success(response.data.userName);
      console.log(response);
      localStorage.setItem("Token", JSON.stringify(response.data.token))
      
    }
    catch(error){
      console.log("Login Failed excep");
      toast.error(error.response.data.message);
    }
}

  // const validateEmail = (e) => {
  //   const emailValue = e.target.value;
  //   setEmail(emailValue);

  //   // Simple email validation regex
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!emailValue) {
  //     setErrorMessage("Email is required");
  //   }

  //   else if (emailValue && !emailRegex.test(emailValue)) {
  //     setErrorMessage("Please enter a valid email address");
  //   } else {
  //     setErrorMessage("");
  //   }
  // };

  // const validatePassword = (e) => {
  //   const passwordValue = e.target.value;
  //   setPassword(passwordValue);

  //   if (passwordValue && passwordValue.length < 8 || passwordValue.length > 16) {
  //     setPasswordError("Password must be 8 character long and less than 16");
  //   }
  //   else {
  //     setPasswordError("");
  //   }
  // }

  const eye = (event) => {
    event.preventDefault();
    let eye = document.getElementById("password");
    if (eye.type === "password") {
      eye.type = "text";
    }
    else {
      eye.type = "password";
    }
  }

  

  return (

    <div className="main">
      <div className="subMain">
        <div className="leftDiv" style={{ flex: 1 }}>
          <form onSubmit={handelForm} id="loginForm" >
            <h2 style={{ color: "blue" }}>dotwork</h2>
            <h1 style={{ fontSize: "24px" }}>Log in to your Account</h1>
            <h4 style={{ fontWeight: "300", fontSize: "14px" }}>Welcome back! Select method to log in:</h4>

            <div className="methods">
              <button style={{ flex: 1 }}><FcGoogle style={{ fontSize: "20px", marginRight: "5px" }} />Google</button>
              <button style={{ flex: 1 }}><FaFacebookF style={{ fontSize: "20px", marginRight: "5px", color: "blue" }} />Facebook</button>
            </div>

            <hr />

            <p style={{ position: "absolute", top: "195px", left: "70px", fontSize: "14px", color: "gray", backgroundColor: "white" }}>or continue with email</p>

            <div className="forms">
              <div className="email">

              <MdOutlineEmail style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                <input type="email" id="email" placeholder=" " value={email} onChange={(e) => { setEmail(e.target.value)}} />
                <label htmlFor="email">Email</label>
                {errorMessage && <span className="error-message" style={{ color: "red", fontSize: "12px" }}>{errorMessage}</span>}
              </div>

              <div className="password" style={{ marginTop: "10px", position:"relative" }}>

              <MdLockOutline style={{ position: "absolute", top: "10px", left: "10px", fontSize: "18px" }} />
                <input type="password" id="password" placeholder=" " value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                <label htmlFor="password">Password</label>
                <button type="button" style={{position:"absolute", right:"15px", top:"11px",width: "fit-content", display: "flex", justifyConten: "center", alignItems: "center",
                   padding: "0", backgroundColor: "transparent"}} onClick={eye}><MdOutlineRemoveRedEye style={{ fontSize:"18px", color:"gray"}}/></button>
                {passwordError && <span className="error-message" style={{ color: "red", fontSize: "12px" }}>{passwordError}</span>}
              </div>

              <div className="remember">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" />
                  <label style={{ fontSize: "13px", fontWeight: 500 }}>Remember me</label>
                </div>

                <a href="#" style={{ fontSize: "14px" }}>Forget Password?</a>

              </div>

              <button type="submit" style={{ width: "100%", backgroundColor: "#3434a2", color: "white" }} className="submitButton">Log in</button>
              <p style={{}}>Don't have an account? <Link style={{cursor:"pointer"}} to="/register" >Create an account</Link></p>
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
