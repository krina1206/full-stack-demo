"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';

type Employee = {
    id: number;
    name: string;
    division: string;
    roles: number[];
}

type FormType = {
    name: string;
    division: string;
    roles: number[];
}

type Role = {
    id: number;
    name: string;
}

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [form, setForm] = useState<FormType>({
        name: "",
        division: "",
        roles: []
    });
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev: FormType) => ({ ...prev, [name]: value }));
    }

    const handleRoleChange = (id: number) => {
        setForm((prev: FormType) => {
            if (prev.roles.includes(id)) {
                return { ...prev, roles: prev.roles.filter((r: number) => r !== id) };
            } else {
                return { ...prev, roles: [...prev.roles, id] };
            }
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.division || form.roles.length === 0) {
            toast.error("Please fill all fields and select at least one role");
            return;
        }

        setIsLoading(true);
        try {
            if (editId) {
                const response = await axios.post(`http://localhost:3000/api/v1/editemployees/${editId}`, form);
                if (response.status === 200) {
                    toast.success("Employee updated successfully!");
                    setEditId(null);
                    resetForm();
                    fetchEmployees();
                }
            } else {
                const response = await axios.post("http://localhost:3000/api/v1/addemployees", form);
                if (response.status === 201 || response.status === 200) {
                    toast.success("Employee added successfully!");
                    resetForm();
                    fetchEmployees();
                }
            }
        } catch (error: any) {
            console.error("Failed to save employee", error);
            toast.error(error.response?.data?.error || "Failed to save employee");
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        setForm({ name: "", division: "", roles: [] });
        setEditId(null);
    }

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/roles");
            if (response.data && response.data.data) {
                setAllRoles(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
            setAllRoles([
                { id: 1, name: "Admin" },
                { id: 2, name: "Manager" },
                { id: 3, name: "Employee" }
            ]);
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/employees");
            if (response.data && response.data.data) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    }

    const handleEdit = (emp: Employee) => {
        setForm({
            name: emp.name,
            division: emp.division,
            roles: emp.roles
        });
        setEditId(emp.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            const response = await axios.post("http://localhost:3000/api/v1/deleteemployees", { id });
            if (response.status === 200) {
                toast.success("Employee deleted successfully!");
                fetchEmployees();
            }
        } catch (error: any) {
            console.error("Failed to delete employee", error);
            toast.error(error.response?.data?.error || "Failed to delete employee");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("token");
        router.push("/");
    }

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (!storedEmail) {
            router.push("/");
            return;
        }
        setEmail(storedEmail);
        fetchRoles();
        fetchEmployees();
    }, [router]);

    return (
        <>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Employee Management</h2>
                    <div className="d-flex align-items-center">
                        <span className="me-3 text-muted">Logged in as: <strong>{email}</strong></span>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">{editId ? "Edit Employee" : "Add New Employee"}</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={form.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Division</label>
                                        <select 
                                            className="form-select" 
                                            name="division" 
                                            value={form.division} 
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Division</option>
                                            <option value="IT">IT</option>
                                            <option value="Account">Account</option>
                                            <option value="Payroll">Payroll</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label d-block">Roles</label>
                                        <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {allRoles.map((role) => (
                                                <div className="form-check" key={role.id}>
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        id={`role-${role.id}`}
                                                        onChange={() => handleRoleChange(role.id)} 
                                                        checked={form.roles.includes(role.id)} 
                                                    />
                                                    <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                                        {role.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                            {isLoading ? "Saving..." : (editId ? "Update Employee" : "Save Employee")}
                                        </button>
                                        {editId && (
                                            <button type="button" className="btn btn-light" onClick={resetForm}>
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Division</th>
                                                <th>Roles</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.length > 0 ? (
                                                employees.map((emp) => (
                                                    <tr key={emp.id}>
                                                        <td>{emp.id}</td>
                                                        <td><strong>{emp.name}</strong></td>
                                                        <td><span className="badge bg-secondary">{emp.division}</span></td>
                                                        <td>
                                                            {emp.roles.map(roleId => {
                                                                const role = allRoles.find(r => r.id === roleId);
                                                                return <span key={roleId} className="badge bg-info text-dark me-1">{role?.name || `Role ${roleId}`}</span>;
                                                            })}
                                                        </td>
                                                        <td className="text-end">
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(emp)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp.id)}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4 text-muted">No employees found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
