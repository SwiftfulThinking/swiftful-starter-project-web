'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Component, User, Sparkles, LogOut, Settings, PanelLeftClose, PanelLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const navigation = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Components",
    url: "/components",
    icon: Component,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "OpenAI",
    url: "/openai",
    icon: Sparkles,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { state } = useSidebar()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          {state === "expanded" && (
            <h2 className="text-lg font-semibold">Swiftful Starter</h2>
          )}
          <SidebarTrigger className={state === "collapsed" ? "mx-auto" : "-mr-1"}>
            {state === "collapsed" ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton 
                  className="w-full"
                  tooltip={state === "collapsed" ? user?.displayName || user?.email || "User" : undefined}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback>
                      {user?.displayName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <div className="flex flex-col flex-1 text-left text-xs">
                      <span className="font-medium truncate">
                        {user?.displayName || "User"}
                      </span>
                      <span className="text-muted-foreground truncate">
                        {user?.email || ""}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-56" side="top" align="start">
                <div className="flex flex-col gap-1">
                  <Link href="/profile">
                    <button className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}