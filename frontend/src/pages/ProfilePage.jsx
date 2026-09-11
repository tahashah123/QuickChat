import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User, CalendarDays, ShieldCheck } from 'lucide-react'

function ProfilePage() {
  const {authUser,isUpdatingProfile,updateProfile} = useAuthStore()
  const [selectedImg,setSelectedImg] = useState(null)
  const handleImageUpload = async (e)=>{
    const image = e.target.files[0]
    if(!image) return;
    const reader = new FileReader();
    reader.readAsDataURL(image)
    reader.onload = async()=>{
      const base64Img = reader.result
      await updateProfile({profilePic:base64Img})
      setSelectedImg(base64Img)
    }
  }
  return (
     <main className="app-shell bg-base-200 px-4 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-8 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
            <p className="mt-2 text-sm app-muted">Manage the information visible to your contacts.</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 border-base-100 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary text-primary-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm app-muted">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="text-sm app-muted flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-3 bg-base-200 rounded-xl border border-base-300 break-words">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm app-muted flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-3 bg-base-200 rounded-xl border border-base-300 break-words">{authUser?.email}</p>
            </div>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-200/50 p-5">
            <h2 className="text-lg font-semibold mb-4">Account information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="flex items-center gap-2 app-muted"><CalendarDays className="size-4" />Member since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2 app-muted"><ShieldCheck className="size-4" />Account status</span>
                <span className="text-emerald-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
