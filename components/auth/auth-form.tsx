"use client";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";
import { getErrorMessage } from "@/lib/utils";
import type { AuthResponse, GoogleLoginRequest, LoginRequest, RegisterRequest, RequestEmailOtpResponse, VerifyEmailOtpResponse } from "@/types/contracts";

type FieldErrors = Partial<Record<"email" | "password" | "code", string>>;
type PendingRegistration = { email: string; password: string };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const [fieldErrors, setFieldErrors] = useState<FieldErrors>({}); const [formError, setFormError] = useState(""); const [loading, setLoading] = useState(false); const [pending, setPending] = useState<PendingRegistration | null>(null); const [resendIn, setResendIn] = useState(0);
  useEffect(() => { if (session.token() && !session.isExpired()) router.replace("/dashboard"); }, [router]);
  useEffect(() => { if (resendIn <= 0) return; const timer = window.setInterval(() => setResendIn(value => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, [resendIn]);

  function validate(email: string, password: string) {
    const errors: FieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email không đúng định dạng.";
    if (password.length < 8) errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    else if (mode === "register" && !/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) errors.password = "Mật khẩu phải có ít nhất một chữ cái và một chữ số.";
    setFieldErrors(errors); return Object.keys(errors).length === 0;
  }

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(""); const form = new FormData(event.currentTarget); const email = String(form.get("email") || "").trim().toLowerCase(); const password = String(form.get("password") || ""); if (!validate(email, password)) return; setLoading(true);
    try {
      if (mode === "login") return completeAuth(await apiClient<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password } satisfies LoginRequest) }));
      await apiClient<RequestEmailOtpResponse>("/auth/verification-email/request", { method: "POST", body: JSON.stringify({ email }) });
      setPending({ email, password }); setResendIn(60);
    } catch (error) { setFormError(getErrorMessage(error)); } finally { setLoading(false); }
  }

  async function verifyAndRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!pending) return; const code = String(new FormData(event.currentTarget).get("code") || "").trim(); if (!/^\d{6}$/.test(code)) { setFieldErrors({ code: "Mã OTP phải gồm đúng 6 chữ số." }); return; } setLoading(true); setFormError(""); setFieldErrors({});
    try {
      const verification = await apiClient<VerifyEmailOtpResponse>("/auth/verification-email/verify", { method: "POST", body: JSON.stringify({ email: pending.email, code }) });
      const request: RegisterRequest = { ...pending, verificationToken: verification.verificationToken };
      completeAuth(await apiClient<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(request) }));
    } catch (error) { setFormError(getErrorMessage(error)); } finally { setLoading(false); }
  }

  async function resendCode() { if (!pending || resendIn > 0) return; setLoading(true); setFormError(""); try { await apiClient("/auth/verification-email/request", { method: "POST", body: JSON.stringify({ email: pending.email }) }); setResendIn(60); } catch (error) { setFormError(getErrorMessage(error)); } finally { setLoading(false); } }
  async function googleSuccess(response: CredentialResponse) { if (!response.credential) return setFormError("Google không trả về thông tin đăng nhập."); setLoading(true); setFormError(""); try { const request: GoogleLoginRequest = { credential: response.credential }; completeAuth(await apiClient<AuthResponse>("/auth/google", { method: "POST", body: JSON.stringify(request) })); } catch (error) { setFormError(getErrorMessage(error)); } finally { setLoading(false); } }
  function completeAuth(auth: AuthResponse) { session.save(auth); router.replace("/dashboard"); }

  return <main className="auth-page"><section className="auth-story"><Brand /><div className="auth-copy"><p className="eyebrow">Tiến từng bước, đều mỗi ngày</p><h1>Thói quen nhỏ.<br />Thay đổi <em>bền lâu.</em></h1><p>Ghi lại những việc quan trọng, duy trì chuỗi ngày và nhìn cây tiến bộ lớn lên cùng bạn.</p></div><small>Hôm nay chỉ cần tốt hơn hôm qua một chút.</small></section><section className="auth-panel"><div className="auth-form"><div className="mobile-brand"><Brand /></div>{pending ? <form onSubmit={verifyAndRegister}><MailCheck className="otp-icon" /><p className="eyebrow">Xác minh email</p><h2>Nhập mã OTP</h2><p className="muted">Mã 6 chữ số đã được gửi đến <strong>{pending.email}</strong>.</p><Label>Mã xác minh<Input name="code" inputMode="numeric" maxLength={6} placeholder="000000" aria-invalid={!!fieldErrors.code} autoFocus /><FieldError>{fieldErrors.code}</FieldError></Label>{formError && <div className="error-box">{formError}</div>}<Button className="w-full" size="lg" disabled={loading}>{loading ? "Đang xác minh..." : "Xác minh và đăng ký"}<ArrowRight /></Button><div className="otp-actions"><Button type="button" variant="ghost" onClick={() => { setPending(null); setFieldErrors({}); setFormError(""); }}><ArrowLeft />Đổi email</Button><Button type="button" variant="ghost" disabled={resendIn > 0 || loading} onClick={resendCode}>{resendIn > 0 ? `Gửi lại sau ${resendIn}s` : "Gửi lại mã"}</Button></div></form> : <form onSubmit={submitCredentials}><p className="eyebrow">{mode === "login" ? "Chào mừng trở lại" : "Tạo hành trình mới"}</p><h2>{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h2><p className="muted">{mode === "login" ? "Đăng nhập để xem tiến độ hôm nay." : "Email cần được xác minh trước khi tạo tài khoản."}</p><Label>Email<Input name="email" type="email" placeholder="ban@example.com" aria-invalid={!!fieldErrors.email} autoComplete="email" /><FieldError>{fieldErrors.email}</FieldError></Label><Label>Mật khẩu<Input name="password" type="password" placeholder="Tối thiểu 8 ký tự" aria-invalid={!!fieldErrors.password} autoComplete={mode === "login" ? "current-password" : "new-password"} /><FieldError>{fieldErrors.password}</FieldError></Label>{formError && <div className="error-box">{formError}</div>}<Button className="w-full" size="lg" disabled={loading}>{loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Gửi mã xác minh"}<ArrowRight /></Button>{mode === "login" && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && <><div className="auth-divider"><span>hoặc</span></div><div className="google-login"><GoogleLogin onSuccess={googleSuccess} onError={() => setFormError("Không thể đăng nhập với Google.")} width="360" shape="pill" text="continue_with" /></div></>}<p className="switch-mode">{mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"} <Link href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Đăng ký" : "Đăng nhập"}</Link></p></form>}</div></section></main>;
}

function FieldError({ children }: { children?: string }) { return children ? <span className="field-error">{children}</span> : null; }
