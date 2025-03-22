import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const AddEmployee = () => {
  const initialValues = {
    name: "",
    email: "",
    work: "",
    salary: "",
    phone: "",
    address: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    work: Yup.string().required("Work is required"),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .required("Salary is required"),
    phone: Yup.string()
      .matches(/^\d{10,}$/, "Phone must be at least 10 digits")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    try {
      // Retrieve existing employees from localStorage
      const storedEmployees = localStorage.getItem("employees");
      const employees = storedEmployees ? JSON.parse(storedEmployees) : [];

      // Add the new employee to the list
      employees.push(values);

      // Save the updated list back to localStorage
      localStorage.setItem("employees", JSON.stringify(employees));

      toast.success("Employee added successfully", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      resetForm();
      console.log("Submitted values:", values);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h1>Add Employee</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group my-3">
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            <div className="form-group my-3">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="form-group my-3">
              <label htmlFor="work">Work</label>
              <Field type="text" name="work" className="form-control" />
              <ErrorMessage name="work" component="div" className="text-danger" />
            </div>

            <div className="form-group my-3">
              <label htmlFor="salary">Salary</label>
              <Field type="text" name="salary" className="form-control" />
              <ErrorMessage name="salary" component="div" className="text-danger" />
            </div>

            <div className="form-group my-3">
              <label htmlFor="phone">Phone Number</label>
              <Field type="text" name="phone" className="form-control" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>

            <div className="form-group my-3">
              <label htmlFor="address">Address</label>
              <Field type="text" name="address" className="form-control" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-custom" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Employee"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
