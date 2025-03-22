import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import emailicon from "../assets/email.png";
import passwordicon from "../assets/password.png";
import usernameicon from "../assets/username.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const axiosBaseURL = "https://employee-management-server-f7k2.onrender.com/api";
  
  // Added isAdmin field (default false)
  const initialValues = {
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // isAdmin is a boolean, so no validation is needed unless required by your logic
  });

  const handleSignup = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const options = {
        name: values.username.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        isAdmin: values.isAdmin,
      };

      const response = await axios.post(`${axiosBaseURL}/user/register`, options, {
        validateStatus: (status) => {
          return status < 500; // Reject only if the status code is 500 or greater
        }
      });
      
      if (response.status === 201) {
       
        if(options.isAdmin){
          localStorage.setItem("adminEmail",options.email)
          localStorage.setItem("adminPassword",options.password);
          localStorage.setItem("isAdmin",true);
       }
       else{
          
          localStorage.setItem("isAdmin",false);
       }
        toast.success("User registered successfully, proceed to Login", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
        resetForm();
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.toString(), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        <Form className="container d-flex flex-column justify-content-center align-items-center form">
          <div className="col-12 my-4 fs-5 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="username" className="col-1">
                <img src={usernameicon} alt="usernameicon" className="icon" />
              </label>
              <Field
                type="text"
                className="ms-4 col-10 rounded p-1 ps-2"
                name="username"
                placeholder="username"
              />
            </div>
            <ErrorMessage name="username" component="span" className="text-danger" />
          </div>
          <div className="col-12 my-4 fs-5 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="email" className="col-1">
                <img src={emailicon} alt="emailicon" className="icon" />
              </label>
              <Field
                type="email"
                className="ms-4 col-10 rounded p-1 ps-2"
                name="email"
                placeholder="email"
              />
            </div>
            <ErrorMessage name="email" component="span" className="text-danger" />
          </div>
          <div className="col-12 my-4 fs-5 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex col-12">
              <label htmlFor="password" className="col-1">
                <img src={passwordicon} alt="passwordicon" className="icon" />
              </label>
              <Field
                type="password"
                className="col-10 ms-4 rounded p-1 ps-2"
                name="password"
                placeholder="password"
              />
            </div>
            <ErrorMessage name="password" component="p" className="text-danger" />
          </div>
          <div className="col-12 my-4 fs-5 d-flex justify-content-center align-items-baseline">
            {/* Changed name to "isAdmin" to reflect its purpose */}
            <Field type="checkbox" className="me-2" name="isAdmin" />
            <div>Register me as Admin</div>
          </div>
          <button
            type="submit"
            className="col-6 align-self-center btn btn-custom my-2 fs-5"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </Form>
      </Formik>
      <ToastContainer />
    </>
  );
};

export default Signup;
