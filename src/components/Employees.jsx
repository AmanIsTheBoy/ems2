import React, { useEffect, useState } from "react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(3); // Number of employees per page
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // Filter for role

  useEffect(() => {
    // Retrieve the employees data from localStorage
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Filter employees by search term and role
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate indices for current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Change current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new filter
  };

  return (
    <div className="container my-5">
      {/* Search and Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      <div className="accordion" id="accordionExample">
        {currentEmployees && currentEmployees.length > 0 ? (
          currentEmployees.map((employee) => (
            <div className="accordion-item" key={employee.employeeId}>
              <div className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${employee.employeeId}`}
                  aria-expanded="false"
                  aria-controls={`collapse${employee.employeeId}`}
                >
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <div className="display-6">{employee.name}</div>
                    <p className="my-0 text-muted">{employee.designation}</p>
                  </div>
                </button>
              </div>
              <div
                id={`collapse${employee.employeeId}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Name: <strong>{employee.name}</strong>
                  </p>
                  <p>
                    Designation: <strong>{employee.designation}</strong>
                  </p>
                  <p>
                    Email:{" "}
                    <a className="email text-decoration-none hover-pointer">
                      {employee.email}
                    </a>
                  </p>
                  {employee.role === "admin" && (
                    <p className="badge text-bg-danger">{employee.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found in local storage.</p>
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(filteredEmployees.length / employeesPerPage) },
            (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                {filteredEmployees.length > employeesPerPage && (
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )}
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Employees;
