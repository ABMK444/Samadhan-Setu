import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  User,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  Search,
  CheckCheck,
  Inbox,
  ArrowRight,
} from "lucide-react";
import AnimatedButton from "../AnimatedButton";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ToastContext";

export default function MessagesView({ currentRole = "Citizen", onNavigateExplore }) {
  const { chatThreads, activeThreadId, setActiveThreadId, sendChatMessage } = useApp();
  const { addToast } = useToast();
  const [inputText, setInputText] = useState("");

  const activeThread =
    chatThreads.find((t) => t.id === activeThreadId) || chatThreads[0] || null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    sendChatMessage(activeThread.id, inputText.trim(), currentRole);
    setInputText("");
    addToast({
      title: "Message Sent! 💬",
      message: `Delivered to ${activeThread.uploaderName}`,
      type: "sparkle",
    });
  };

  const quickReplies = [
    "Can you share more photos of the site?",
    "Our university team can visit tomorrow morning.",
    "Has the local municipal engineer inspected this?",
    "We have approved CSR sponsorship for this project.",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Direct Civic Messaging</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
              {chatThreads.length} Discussions
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time chat between Problem Uploaders, University Technical Teams, and Industry Sponsors.
          </p>
        </div>

        {onNavigateExplore && (
          <AnimatedButton
            size="sm"
            variant="outline"
            onClick={onNavigateExplore}
            popupText="Explore Grid"
          >
            Find Problem to Discuss
          </AnimatedButton>
        )}
      </div>

      {chatThreads.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0f1422] text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <MessageSquare className="w-8 h-8 opacity-60" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Discussions Started Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              When a University or Industry partner wants to adopt or clarify an uploaded issue, they can click{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">"Message Uploader"</strong> on that problem card to start a direct conversation here.
            </p>
          </div>
          {onNavigateExplore && (
            <AnimatedButton variant="violet" onClick={onNavigateExplore} popupText="🔍 Explore">
              Explore Uploaded Problems
            </AnimatedButton>
          )}
        </div>
      ) : (
        /* Active Chat Workspace */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1422] shadow-sm overflow-hidden min-h-[500px]">
          {/* Threads List Sidebar */}
          <div className="border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Active Discussions ({chatThreads.length})
            </div>

            <div className="space-y-2">
              {chatThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-sm"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {thread.uploaderName}
                      </span>
                      <span className="text-[10px] text-slate-400">{lastMsg?.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate mb-1">
                      Re: {thread.problemTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {lastMsg?.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          {activeThread && (
            <div className="md:col-span-2 flex flex-col justify-between p-4 sm:p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {activeThread.uploaderName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {activeThread.uploaderName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Role: {activeThread.uploaderRole}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-rose-500">
                          <MapPin className="w-3 h-3" /> {activeThread.district}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Topic: {activeThread.problemTitle}
                  </span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[260px] max-h-[380px]">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <span>{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.isMe
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Quick reply:</span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(qr)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap cursor-pointer transition-colors border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Send Input Bar */}
              <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeThread.uploaderName} regarding ${activeThread.problemTitle}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <AnimatedButton
                  type="submit"
                  variant="violet"
                  size="sm"
                  icon={Send}
                  popupText="Sent!"
                >
                  Send
                </AnimatedButton>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
