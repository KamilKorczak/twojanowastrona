"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  
  // POPRAWIONE: Jedna czysta definicja powitania
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Cześć, jestem wirtualnym asystentem agencji twojanowastrona24.pl. W czym mogę Ci dzisiaj pomóc?" }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim().slice(0, 400);
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Wystąpił błąd techniczny. Prosimy o kontakt bezpośredni pod numerem 518 496 254." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Błąd połączenia. Proszę sprawdzić połączenie internetowe." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "sans-serif" }}>
      {!isOpen && (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {/* Plakietka "Asystent AI" */}
          <div style={{ 
            marginRight: "12px", 
            backgroundColor: "#0f172a", 
            border: "1px solid #1e293b", 
            color: "#e2e8f0", 
            padding: "6px 12px", 
            borderRadius: "8px", 
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 0.5s ease-out"
          }}>
            Asystent AI
          </div>

          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              position: "relative"
            }}
          >
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: "#60a5fa", opacity: 0.3, animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}></span>
            
            <svg style={{ width: "28px", height: "28px", position: "relative", zIndex: 10 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div style={{ width: "360px", maxWidth: "90vw", height: "500px", maxHeight: "80vh", backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ backgroundColor: "#0f172a", padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: "#34d399", animation: "ping 1.5s infinite", opacity: 0.7 }}></div>
              </div>
              <div>
                <h3 style={{ color: "#ffffff", margin: 0, fontSize: "14px", fontWeight: "bold" }}>Asystent AI</h3>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "11px" }}>twojanowastrona24.pl</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}>
              <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#0b0f19" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "16px", fontSize: "13px", lineHeight: "1.4", color: msg.role === "user" ? "#ffffff" : "#e2e8f0", backgroundColor: msg.role === "user" ? "#2563eb" : "#0f172a", border: msg.role === "user" ? "none" : "1px solid #1e293b", borderBottomRightRadius: msg.role === "user" ? "0px" : "16px", borderBottomLeftRadius: msg.role === "user" ? "16px" : "0px", wordBreak: "break-word" }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", padding: "10px 14px", borderRadius: "16px", display: "flex", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2563eb", animation: "bounce 1.4s infinite" }}></span>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2563eb", animation: "bounce 1.4s infinite 0.2s" }}></span>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2563eb", animation: "bounce 1.4s infinite 0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: "12px", backgroundColor: "#0f172a", borderTop: "1px solid #1e293b", display: "flex", gap: "8px" }}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Napisz wiadomość..." maxLength={400} style={{ flex: 1, backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "10px 14px", color: "#ffffff", fontSize: "16px", outline: "none" }} />
            <button type="submit" disabled={isLoading || !input.trim()} style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "12px", padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isLoading || !input.trim() ? 0.5 : 1 }}>
              <svg style={{ width: "16px", height: "16px", transform: "rotate(90deg)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}