"use client";
import { Bot, Expand, Leaf, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { ChatMessage, ChatResponse } from "@/types/contracts";
import { usePreferences } from "@/components/providers/preferences-provider";

export function V2FloatingChat() {
  const { locale, t } = usePreferences(); const [open, setOpen] = useState(false); const [focus, setFocus] = useState(false); const [loaded, setLoaded] = useState(false); const [messages, setMessages] = useState<ChatMessage[]>([]); const [sending, setSending] = useState(false); const [provider, setProvider] = useState<ChatResponse["provider"] | null>(null); const [error, setError] = useState(""); const [now, setNow] = useState(0); const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open || loaded) return; apiClient<ChatMessage[]>("/chat/history").then(data => { setMessages([...data].reverse()); setLoaded(true); }).catch(err => setError(getErrorMessage(err))); }, [open, loaded]);
  useEffect(() => { if (!open) return; const timer = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(timer); }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const content = String(new FormData(form).get("message") || "").trim(); if (!content) return;
    const localId = `local-${Date.now()}`; setSending(true); setError(""); setMessages(current => [...current, { id: localId, userId: "local", role: "user", content, createdAt: new Date().toISOString() }]); form.reset();
    try { const response = await apiClient<ChatResponse>("/chat", { method: "POST", body: JSON.stringify({ message: `[Reply in ${locale === "vi" ? "Vietnamese" : "English"}] ${content}`, include_context: true }) }); setProvider(response.provider); setMessages(current => [...current.map(message => message.id === localId ? { ...response.userMessage, content } : message), response.message]); setNow(Date.now()); } catch (err) { setError(getErrorMessage(err)); } finally { setSending(false); }
  }
  function time(createdAt: string) { const sent = new Date(createdAt); const minutes = Math.max(0, Math.floor((now - sent.getTime()) / 60_000)); if (minutes < 1) return t("justNow"); if (minutes <= 60) return t("sentMinutes", { count: minutes }); return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(sent); }
  return <div className={`v2-chat ${focus ? "focus" : ""}`}>
    {open && <section className="v2-chat-panel" role="dialog" aria-label={t("assistantName")}>
      <header><div className="v2-chat-identity"><span><Bot /></span><div><strong>{t("assistantName")}</strong><Badge>{provider === "local-fallback" ? t("fallback") : t("ready")}</Badge></div></div><div className="v2-chat-actions"><Button variant="ghost" size="icon" onClick={() => setFocus(value => !value)} aria-label={focus ? t("exitFocus") : t("focusMode")}>{focus ? <Minimize2 /> : <Expand />}</Button><Button variant="ghost" size="icon" onClick={() => { setOpen(false); setFocus(false); }} aria-label={t("close")}><X /></Button></div></header>
      <div className="v2-messages">{messages.length ? messages.map(message => <article key={message.id} className={`v2-message ${message.role}`}><span>{message.role === "assistant" && <Leaf />}</span><div><small>{message.role === "assistant" ? "HabiStride" : t("you")} · <time>{time(message.createdAt)}</time></small><p>{message.content}</p></div></article>) : <div className="v2-chat-empty"><span><MessageCircle /></span><h2>{t("assistantEmpty")}</h2><p>{t("assistantEmptyDescription")}</p></div>}{sending && <article className="v2-message assistant"><span><Leaf /></span><div><small>HabiStride · {t("replying")}</small><p className="v2-typing"><i /><i /><i /></p></div></article>}<div ref={endRef} /></div>
      {error && <div className="error-box v2-chat-error">{error}</div>}
      <form onSubmit={send}><Input name="message" placeholder={t("messagePlaceholder")} autoComplete="off" /><Button size="icon" disabled={sending} aria-label={t("send")}><Send /></Button></form>
    </section>}
    {!open && <Button className="v2-chat-trigger" size="icon" onClick={() => { setNow(Date.now()); setOpen(true); }} aria-label={t("openAssistant")}><MessageCircle /></Button>}
  </div>;
}
