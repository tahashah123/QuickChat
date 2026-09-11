import { useEffect } from "react";
import Sidebar from "../components/sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Homepage = () => {
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { socket } = useAuthStore();
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);
  return <main className="app-shell bg-base-200 p-0 md:p-4 lg:p-5"><section className="app-surface h-[calc(100vh-4rem)] overflow-hidden border-base-300 md:rounded-2xl md:border md:shadow-sm"><div className="flex h-full min-w-0"><div className={selectedUser ? "hidden h-full md:block" : "block h-full w-full md:w-auto"}><Sidebar /></div><div className={selectedUser ? "flex min-w-0 flex-1" : "hidden min-w-0 flex-1 md:flex"}>{selectedUser ? <ChatContainer /> : <NoChatSelected />}</div></div></section></main>;
}

export default Homepage;
