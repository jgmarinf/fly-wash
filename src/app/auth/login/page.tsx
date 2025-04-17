"use client";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "", general: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = { email: "", password: "", general: "" };
      result.error.errors.forEach(err => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ ...errors, general: data.error || "Error de autenticación" });
        setLoading(false);
        return;
      }
      // Store JWT in cookie (client-side example, for demo only)
      document.cookie = `token=${data.token}; path=/;`;
      window.location.href = "/";
    } catch  {
      setErrors({ ...errors, general: "Error de red o del servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className="text-4xl mb-5">Ingresar</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electronico</label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
        />
        {errors.email && <span className="text-red-500 text-sm mb-2">{errors.email}</span>}
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
        />
        {errors.password && <span className="text-red-500 text-sm mb-2">{errors.password}</span>}
        <button
          type="submit"
          className="flex items-center justify-center btn-primary mt-3 mb-2"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        {errors.general && <span className="text-red-500 text-sm mb-2">{errors.general}</span>}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-sm text-gray-800">0</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        <Link href="/auth/new-account" className="btn-secondary text-center">
          Crear una cuenta
        </Link>
      </form>
    </div>
  );
}
