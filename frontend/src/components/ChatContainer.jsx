import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const { messages, selectedUser, isMessagesLoading, getMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => { if (selectedUser?._id) getMessages(selectedUser._id); }, [selectedUser?._id, getMessages]);
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  return <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-base-100"><ChatHeader />{isMessagesLoading ? <MessageSkeleton /> : <div className="app-scrollbar flex-1 overflow-y-auto px-3 py-5 sm:px-6"><div className="mx-auto flex max-w-4xl flex-col gap-1">{messages.length === 0 && <div className="m-auto grid min-h-64 place-items-center text-center"><div><div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">+</div><h3 className="font-semibold">Start the conversation</h3><p className="mt-1 text-sm app-muted">Send a message to break the ice.</p></div></div>}{messages.map((message, index) => { const isSent = String(message.senderId) === String(authUser?._id); const showAvatar = index === 0 || String(messages[index - 1].senderId) !== String(message.senderId); const ReceiptIcon = message.readAt ? CheckCheck : message.deliveredAt ? CheckCheck : Check; return <div key={message._id || index} className={`animate-message-in flex items-end gap-2 ${showAvatar ? "mt-3" : "mt-0"} ${isSent ? "flex-row-reverse" : ""}`}><img src={(isSent ? authUser?.profilePic : selectedUser?.profilePic) || "/avatar.png"} alt="" className={`size-8 shrink-0 rounded-full object-cover ${showAvatar ? "opacity-100" : "opacity-0"}`} /><div className={`max-w-[78%] sm:max-w-[68%] ${isSent ? "items-end" : "items-start"} flex flex-col`}><div className={`min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${isSent ? "rounded-br-md bg-primary text-primary-content" : "rounded-bl-md bg-base-200 text-base-content"}`}>{message.image && <img src={message.image} alt="Shared attachment" className="mb-2 max-h-72 w-full max-w-80 rounded-xl object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}{message.text && <p className="break-words whitespace-pre-wrap">{message.text}</p>}</div><time className="mt-1 flex items-center gap-1 px-1 text-[11px] app-muted">{formatMessageTime(message.createdAt)}{isSent && <ReceiptIcon className={`size-3.5 ${message.readAt ? "text-sky-500" : ""}`} aria-label={message.readAt ? "Read" : message.deliveredAt ? "Delivered" : "Sent"} />}</time></div></div>; })}<div ref={messageEndRef} /></div></div>}<MessageInput /></div>;
};
export default ChatContainer;
