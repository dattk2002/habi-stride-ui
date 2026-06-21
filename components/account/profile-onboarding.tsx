"use client";
/* Avatar previews use blob/data URLs and intentionally bypass Next image optimization. */
/* eslint-disable @next/next/no-img-element */

import { Camera, Leaf, Upload } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";
import { getErrorMessage } from "@/lib/utils";
import type { User } from "@/types/contracts";

export function ProfileOnboarding({ user, onUpdated }: { user: User; onUpdated: (user: User) => void }) {
  const [open, setOpen] = useState(!user.profileCompleted);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function selectAvatar(file?: File) {
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = String(new FormData(event.currentTarget).get("displayName") || "").trim();
    if (!avatar && !user.avatarUrl) return setError("Vui lòng chọn ảnh đại diện.");
    setSaving(true); setError("");
    try {
      let updated = await apiClient<User>(`/users/${user.id}`, { method: "PATCH", body: JSON.stringify({ displayName }) });
      if (avatar) {
        const body = new FormData(); body.append("avatar", avatar);
        updated = await apiClient<User>(`/users/${user.id}/avatar`, { method: "POST", body });
      }
      session.updateUser(updated); onUpdated(updated); setOpen(false);
    } catch (reason) { setError(getErrorMessage(reason)); } finally { setSaving(false); }
  }

  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="profile-onboarding"><div className="onboarding-leaf" aria-hidden="true"><Leaf /></div><DialogHeader><p className="eyebrow">Thiết lập nhanh</p><DialogTitle>Để HabiStride gọi bạn đúng tên</DialogTitle><DialogDescription>Hoàn thiện hai thông tin cơ bản ngay tại đây. Bạn vẫn có thể thay đổi sau.</DialogDescription></DialogHeader><form className="profile-form" onSubmit={submit}><button className="avatar-uploader" type="button" onClick={() => fileRef.current?.click()}><span className="avatar-preview">{preview ? <img src={preview} alt="Ảnh đại diện đã chọn" /> : <Camera />}</span><span><strong>{avatar ? avatar.name : "Chọn ảnh đại diện"}</strong><small>JPEG, PNG hoặc WebP · tối đa 2 MB</small></span><Upload /></button><input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => selectAvatar(event.target.files?.[0])} /><Label>Tên thường gọi<Input name="displayName" defaultValue={user.displayName || ""} placeholder="Tên bạn muốn được gọi" required maxLength={60} /></Label>{error && <div className="error-box">{error}</div>}<div className="onboarding-actions"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Để sau</Button><Button disabled={saving}>{saving ? "Đang lưu..." : "Hoàn tất hồ sơ"}</Button></div></form></DialogContent></Dialog>;
}
