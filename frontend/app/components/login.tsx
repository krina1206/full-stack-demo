"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/v1/login", {
                email,
                password
            });

            if (response.status === 200) {
                localStorage.setItem("userEmail", response.data.user.email);
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful!");
                router.push("/employee");
            }
        }
        catch (error: any) {
            console.error("Login failed", error);
            const message = error.response?.data?.error || "Login failed. Please check your credentials.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Login</h1>
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <form onSubmit={handleLogin}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <small className="text-muted">Tip: Use postman to signup first or manually add a user to MongoDB.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}