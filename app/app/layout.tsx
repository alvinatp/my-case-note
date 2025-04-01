import type { ReactNode } from "react"
import Link from "next/link"
import { Bell, Home, LogOut, Menu, Search, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-[250px] md:flex-col md:fixed md:inset-y-0 bg-[#F5F5F5] border-r">
        <div className="flex flex-col h-full py-4">
          <div className="px-4 mb-6">
            <Link href="/app" className="flex items-center">
              <span className="font-bold text-xl text-[#333333]">MyCaseNote</span>
            </Link>
          </div>
          <nav className="flex-1 px-2 space-y-2">
            <Link
              href="/app"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
            >
              <Home className="h-6 w-6" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/app/resources"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
            >
              <Search className="h-6 w-6" />
              <span className="font-medium">Resources</span>
            </Link>
            <Link
              href="/app/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
            >
              <Settings className="h-6 w-6" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-[250px]">
        {/* Top Bar */}
        <header className="h-[60px] bg-white border-b shadow-sm flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] bg-[#F5F5F5] p-0">
                  <div className="flex flex-col h-full py-4">
                    <div className="px-4 mb-6 flex items-center justify-between">
                      <Link href="/app" className="font-bold text-xl text-[#333333]">
                        MyCaseNote
                      </Link>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </div>
                    <nav className="flex-1 px-2 space-y-2">
                      <Link
                        href="/app"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
                      >
                        <Home className="h-6 w-6" />
                        <span className="font-medium">Home</span>
                      </Link>
                      <Link
                        href="/app/resources"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
                      >
                        <Search className="h-6 w-6" />
                        <span className="font-medium">Resources</span>
                      </Link>
                      <Link
                        href="/app/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#333333] hover:bg-blue-50 hover:text-[#007BFF]"
                      >
                        <Settings className="h-6 w-6" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <Link href="/app" className="ml-3 font-bold text-[#333333]">
                MyCaseNote
              </Link>
            </div>
            <div className="hidden md:block">{/* Empty space on desktop since logo is in sidebar */}</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>CM</AvatarFallback>
                </Avatar>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#F5F5F5]">{children}</main>
      </div>
    </div>
  )
}

