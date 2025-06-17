'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuItem,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

import {
  Antenna,
  Bell,
  Book,
  BotMessageSquare,
  Calendar,
  ChevronRight,
  Clapperboard,
  FileChartLineIcon,
  Handshake,
  Home,
  List,
  LogOut,
  Monitor,
  Settings,
  Tv,
  Tv2,
  User,
} from 'lucide-react';

import Link from 'next/link';
import { Separator } from './ui/separator';

const data = {
  user: {
    name: 'avalynndev',
    email: 'm@example.com',
    avatar: '/avalynndev.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'interviews',
      url: '/interviews',
      icon: Calendar,
    },
    {
      title: 'Reports',
      url: '/interview/report',
      icon: FileChartLineIcon,
    },
    {
      title: 'Notification',
      url: '/dashboard',
      icon: Bell,
    },
  ],
  settings: [
    {
      title : "Profile",
      url : "/profile",
      icon : User
    },
    {
      title : "Settings",
      url : "/setting",
      icon : Settings
    }
  ],

  navSecondary : [
    {
      title : "Logout",
      url : "/Logout",
      icon : LogOut
    }
  ]
  
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon"  className="bg-gray-100 dark:bg-black w-[283px]" variant='inset'>
      <SidebarHeader className="mb-3 rounded-xl bg-white dark:bg-[#151515]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <BotMessageSquare className="pl-0.5 group-data-[collapsible=icon]:size-6" />
                {state === 'collapsed' ? (
                  <></>
                ) : (
                  <span className="text-base font-semibold">Interview AI</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mb-3 rounded-xl bg-white dark:bg-[#151515]">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator></Separator>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
          {data.settings.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="rounded-xl bg-white dark:bg-[#151515] p-3">
        <h1>
          User Button
        </h1>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}