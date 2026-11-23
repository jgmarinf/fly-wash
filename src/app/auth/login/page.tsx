"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug") !== "1") return;
    setDebugMode(true);
    document.cookie = "probe=1; path=/; SameSite=Lax";
    setDebugInfo(
      JSON.stringify(
        {
          userAgent: navigator.userAgent,
          cookieEnabled: navigator.cookieEnabled,
          cookies: document.cookie,
          hydrated: true,
        },
        null,
        2
      )
    );
  }, []);

  const handleDebugLogin = async () => {
    const info: Record<string, unknown> = {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      cookiesBefore: document.cookie,
    };
    try {
      document.cookie = "probe=2; path=/; SameSite=Lax";
      info.cookiesAfterWrite = document.cookie;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...form, email: form.email.trim() }),
      });
      info.loginStatus = res.status;
      info.loginBody = await res.text();
      const me = await fetch("/api/auth/me", { credentials: "same-origin" });
      info.meStatus = me.status;
      info.meBody = await me.text();
    } catch (error) {
      info.error = String(error);
    }
    setDebugInfo(JSON.stringify(info, null, 2));
  };

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
        credentials: "same-origin",
        body: JSON.stringify({ ...form, email: form.email.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ ...errors, general: data.error || "Error de autenticación" });
        setLoading(false);
        return;
      }
      // La cookie httpOnly `token` la establece el servidor en la respuesta.
      // No escribirla desde JavaScript: `data.token` no existe y crearía
      // una cookie `token=undefined` que bloquea el middleware (bucle de login).
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
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Correo electronico</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={form.email}
          onChange={handleChange}
          className="px-5 py-2 border bg-gray-200 rounded mb-1"
        />
        {errors.email && <span className="text-red-500 text-sm mb-2">{errors.email}</span>}
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
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
      {debugMode && (
        <div className="mt-5 rounded border border-gray-600 bg-black p-3 text-xs text-green-400">
          <p className="mb-2 font-bold">Diagnóstico de login</p>
          <button
            type="button"
            onClick={handleDebugLogin}
            className="btn-secondary mb-2 text-xs"
          >
            Probar login (debug)
          </button>
          <pre className="whitespace-pre-wrap break-all">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
}
