import { useAuthStore } from '../store/useAuthStore'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const {authUser,logout} = useAuthStore()
  const location = useLocation()
  if (!authUser) return null
  const navButton = (path) => `btn btn-ghost btn-sm gap-2 ${location.pathname === path ? "bg-base-200 text-primary" : ""}`
  return (
   <header className="sticky top-0 z-40 h-16 border-b border-base-300 bg-base-100">
      <div className="mx-auto h-full w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-xl bg-primary text-primary-content flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold">QuickChat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={navButton("/settings")}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={navButton("/profile")}>
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-error" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
   </header>
  )
}

export default Navbar
