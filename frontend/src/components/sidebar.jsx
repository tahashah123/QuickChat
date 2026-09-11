import { useEffect, useMemo, useState } from "react";
import { Search, Users, Wifi } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => { getUsers(); }, [getUsers]);
  const filteredUsers = useMemo(() => users
    .filter((user) => user.fullName.toLowerCase().includes(query.toLowerCase()) && (activeFilter === "all" || onlineUsers.includes(user._id)))
    .sort((first, second) => {
      const onlineDifference = Number(onlineUsers.includes(second._id)) - Number(onlineUsers.includes(first._id));
      return onlineDifference || first.fullName.localeCompare(second.fullName);
    }), [users, query, activeFilter, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  const onlineCount = Math.max(onlineUsers.length - 1, 0);

  return <aside className="app-surface flex h-full w-full flex-col border-r border-base-300 md:w-80 lg:w-88">
    <div className="border-b border-base-300 px-4 py-4 sm:px-5">
      <div className="mb-4 flex items-center justify-between"><div><div className="flex items-center gap-2"><Users className="size-5 text-primary" /><h1 className="font-semibold">Messages</h1></div><p className="mt-1 text-xs app-muted">{onlineCount} {onlineCount === 1 ? "person" : "people"} online</p></div><span className="grid size-9 place-items-center rounded-xl bg-base-200 text-primary"><Wifi className="size-4" /></span></div>
      <label className="input input-bordered flex h-10 items-center gap-2 rounded-xl bg-base-100 px-3"><Search className="size-4 app-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 grow" placeholder="Search conversations" aria-label="Search conversations" /></label>
      <div className="relative mt-3 grid w-full grid-cols-2 rounded-xl bg-base-200 p-1" role="tablist" aria-label="Conversation filters"><span className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-primary shadow-sm transition-transform duration-200 ease-out ${activeFilter === "online" ? "translate-x-full" : "translate-x-0"}`} aria-hidden="true" /><button type="button" role="tab" aria-selected={activeFilter === "all"} onClick={() => setActiveFilter("all")} className={`relative z-10 h-8 rounded-lg text-sm font-semibold transition-colors duration-200 ${activeFilter === "all" ? "text-primary-content" : "app-muted hover:text-base-content"}`}>All <span className="ml-1 text-xs opacity-70">{users.length}</span></button><button type="button" role="tab" aria-selected={activeFilter === "online"} onClick={() => setActiveFilter("online")} className={`relative z-10 h-8 rounded-lg text-sm font-semibold transition-colors duration-200 ${activeFilter === "online" ? "text-primary-content" : "app-muted hover:text-base-content"}`}>Online <span className="ml-1 text-xs opacity-70">{onlineCount}</span></button></div>
    </div>
    <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id); const isSelected = selectedUser?._id === user._id; const unreadCount = unreadCounts[user._id] || 0;
        return <button key={user._id} onClick={() => setSelectedUser(user)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${isSelected ? "bg-primary text-primary-content shadow-sm" : "hover:bg-base-200"}`}><div className="relative shrink-0"><img src={user.profilePic || "/avatar.png"} alt="" className="size-11 rounded-full object-cover" />{isOnline && <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 bg-emerald-500 ${isSelected ? "border-primary" : "border-base-100"}`} />}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{user.fullName}</p><p className={`mt-0.5 text-xs ${isSelected ? "text-primary-content/70" : "app-muted"}`}>{isOnline ? "Online" : "Offline"}</p></div>{unreadCount > 0 && !isSelected && <span className="grid min-w-5 h-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-content">{unreadCount > 99 ? "99+" : unreadCount}</span>}</button>;
      })}
      {filteredUsers.length === 0 && <div className="grid place-items-center px-5 py-14 text-center"><div className="mb-3 grid size-11 place-items-center rounded-full bg-base-200"><Users className="size-5 app-muted" /></div><p className="font-medium">No conversations found</p><p className="mt-1 text-sm app-muted">{activeFilter === "online" ? "No contacts are online right now." : "Try another search."}</p></div>}
    </div>
  </aside>;
};
export default Sidebar;
