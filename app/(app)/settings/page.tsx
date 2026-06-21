"use client";
/* User avatars are validated data URLs returned by the API. */
/* eslint-disable @next/next/no-img-element */

import { CalendarDays, Camera, Flame, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";
import { getErrorMessage } from "@/lib/utils";
import type { UpdateUserRequest, User } from "@/types/contracts";

export default function SettingsPage() {
  const router = useRouter(); const fileRef = useRef<HTMLInputElement>(null); const [user, setUser] = useState<User | null>(null); const [error, setError] = useState(""); const [success, setSuccess] = useState(false); const [deleteOpen, setDeleteOpen] = useState(false); const [deleting, setDeleting] = useState(false);
  useEffect(() => { const current = session.user(); if (!current) return; apiClient<User>(`/users/${current.id}`).then(value => { session.updateUser(value); setUser(value); }).catch(reason => setError(getErrorMessage(reason))); }, []);

  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!user) return; setError(""); const form = new FormData(event.currentTarget); const payload: UpdateUserRequest = { email: String(form.get("email")), displayName: String(form.get("displayName")) }; const password = String(form.get("password") || ""); if (password) payload.password = password; try { const updated = await apiClient<User>(`/users/${user.id}`, { method: "PATCH", body: JSON.stringify(payload) }); updateUser(updated); setSuccess(true); } catch (reason) { setError(getErrorMessage(reason)); } }
  async function upload(file?: File) { if (!file || !user) return; setError(""); const body = new FormData(); body.append("avatar", file); try { updateUser(await apiClient<User>(`/users/${user.id}/avatar`, { method: "POST", body })); setSuccess(true); } catch (reason) { setError(getErrorMessage(reason)); } }
  async function remove(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!user) return; const email = String(new FormData(event.currentTarget).get("confirmEmail") || "").trim(); setDeleting(true); setError(""); try { await apiClient(`/users/${user.id}`, { method: "DELETE", body: JSON.stringify({ email }) }); session.clear(); router.replace("/register"); } catch (reason) { setError(getErrorMessage(reason)); setDeleting(false); } }
  function updateUser(value: User) { session.updateUser(value); setUser(value); }
  function logout() { session.clear(); router.replace("/login"); }
  if (!user) return <LoadingState />;
  const joined = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(user.createdAt));

  return <div className="view-stack"><PageHeader eyebrow="Tài khoản cá nhân" title="Hồ sơ của bạn" description="Thông tin nhận diện, nhịp đăng nhập và bảo mật tài khoản." /><div className="profile-summary"><button className="profile-avatar" type="button" onClick={() => fileRef.current?.click()}>{user.avatarUrl ? <img src={user.avatarUrl} alt="Ảnh đại diện" /> : <span>{(user.displayName || user.email)[0].toUpperCase()}</span>}<i><Camera /></i></button><input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => upload(event.target.files?.[0])} /><div><h2>{user.displayName || user.email.split("@")[0]}</h2><p>{user.email}</p><Badge>{user.authProvider === "google" ? "Google" : "Email"}</Badge></div><div className="profile-stat"><CalendarDays /><span>Tham gia</span><strong>{joined}</strong></div><div className="profile-stat"><Flame /><span>Chuỗi đăng nhập</span><strong>{user.stat?.currentLoginStreak || 0} ngày</strong><small>{user.stat?.totalLoginDays || 0} ngày đăng nhập</small></div></div><Card className="settings-card"><CardContent><form onSubmit={save}><div className="settings-section"><span className="section-label">THÔNG TIN CƠ BẢN</span><Label>Tên thường gọi<Input name="displayName" defaultValue={user.displayName || ""} required maxLength={60} /></Label><Label>Email<Input name="email" type="email" defaultValue={user.email} required /></Label><Label>Mật khẩu mới<Input name="password" type="password" placeholder="Để trống nếu không đổi" minLength={8} /></Label></div>{error && <div className="error-box">{error}</div>}<div className="settings-actions"><Button>Lưu thay đổi</Button><Button type="button" variant="outline" onClick={logout}><LogOut />Đăng xuất</Button></div></form><div className="settings-section danger-zone"><div><strong>Xóa tài khoản</strong><p>Toàn bộ thói quen, lịch sử, cây tiến bộ và tin nhắn sẽ bị xóa vĩnh viễn.</p></div><Button variant="outline" onClick={() => setDeleteOpen(true)}><Trash2 />Xóa tài khoản</Button></div></CardContent></Card><Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent className="delete-dialog"><DialogHeader><DialogTitle>Xác nhận xóa tài khoản</DialogTitle><DialogDescription>Nhập lại chính xác email <strong>{user.email}</strong>. Thao tác này không thể hoàn tác.</DialogDescription></DialogHeader><form onSubmit={remove}><Label>Email xác nhận<Input name="confirmEmail" type="email" autoComplete="off" required /></Label>{error && <div className="error-box">{error}</div>}<div className="dialog-actions"><Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>Hủy</Button><Button className="danger-button" disabled={deleting}>{deleting ? "Đang xóa..." : "Xóa vĩnh viễn"}</Button></div></form></DialogContent></Dialog><SuccessDialog open={success} onOpenChange={setSuccess} title="Đã cập nhật hồ sơ" description="Thông tin tài khoản của bạn đã được lưu thành công." /></div>;
}
