"use client";

import { Bot, Leaf, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { ChatMessage, ChatResponse } from "@/types/contracts";

function formatMessageTime(createdAt: string, now: number) {
  const sentAt = new Date(createdAt);
  const elapsedMinutes = Math.max(0, Math.floor((now - sentAt.getTime()) / 60_000));

  if (elapsedMinutes < 1) return "Vừa xong";
  if (elapsedMinutes <= 60) return `Đã gửi ${elapsedMinutes} phút trước`;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    hour12: false,
  }).format(sentAt);
}

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState<ChatResponse["provider"] | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!open || loaded) return;
    apiClient<ChatMessage[]>("/chat/history")
      .then((data) => {
        setMessages([...data].reverse());
        setLoaded(true);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [open, loaded]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [open]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const content = String(new FormData(form).get("message") || "").trim();
    if (!content) return;

    const localId = `local-${Date.now()}`;
    setSending(true);
    setError("");
    setMessages((current) => [
      ...current,
      { id: localId, userId: "local", role: "user", content, createdAt: new Date().toISOString() },
    ]);
    setNow(Date.now());
    form.reset();

    try {
      const response = await apiClient<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify({ message: content, include_context: true }),
      });
      setProvider(response.provider);
      setMessages((current) => [
        ...current.map((message) => (message.id === localId ? response.userMessage : message)),
        response.message,
      ]);
      setNow(Date.now());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="floating-chat">
      {open && (
        <Card className="floating-chat-panel">
          <header>
            <div>
              <span className="chat-brand"><Bot /></span>
              <div>
                <strong>Trợ lý HabiStride</strong>
                <Badge>{provider === "gemini" ? "Gemini" : provider === "local-fallback" ? "Dự phòng" : "Sẵn sàng"}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Đóng trợ lý"><X /></Button>
          </header>

          <div className="floating-messages">
            {messages.length ? messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <span>{message.role === "assistant" ? <Leaf /> : null}</span>
                <div>
                  <small>
                    {message.role === "assistant" ? "HabiStride" : "Bạn"} ·{" "}
                    <time dateTime={message.createdAt}>{formatMessageTime(message.createdAt, now)}</time>
                  </small>
                  <p>{message.content}</p>
                </div>
              </div>
            )) : (
              <div className="chat-empty">
                <span><MessageCircle /></span>
                <h2>Bạn cần hỗ trợ gì?</h2>
                <p>Hỏi về thói quen hoặc tiến độ gần đây.</p>
              </div>
            )}
            {sending && (
              <div className="message assistant">
                <span><Leaf /></span>
                <div><small>HabiStride · đang trả lời</small><p>Đang suy nghĩ...</p></div>
              </div>
            )}
          </div>

          {error && <div className="error-box chat-error">{error}</div>}
          <form className="floating-chat-input" onSubmit={send}>
            <Input name="message" placeholder="Nhập tin nhắn..." autoComplete="off" />
            <Button size="icon" disabled={sending} aria-label="Gửi"><Send /></Button>
          </form>
        </Card>
      )}

      {!open && (
        <Button
          className="floating-chat-trigger"
          size="icon"
          onClick={() => {
            setNow(Date.now());
            setOpen(true);
          }}
          aria-label="Mở trợ lý"
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
}
