import { ChevronLeft, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  return <header className="flex shrink-0 items-center justify-between border-b border-base-300 bg-base-100 px-3 py-3 sm:px-5"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-square btn-sm md:hidden" aria-label="Back to conversations"><ChevronLeft className="size-5" /></button><div className="relative"><img src={selectedUser.profilePic || "/avatar.png"} alt="" className="size-10 rounded-full object-cover" />{isOnline && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 bg-emerald-500" />}</div><div className="min-w-0"><h2 className="truncate font-semibold">{selectedUser.fullName}</h2><p className="text-xs app-muted">{isOnline ? "Online now" : "Offline"}</p></div></div><button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-square btn-sm hidden md:inline-flex" aria-label="Close conversation"><X className="size-5" /></button></header>;
}
export default ChatHeader;
