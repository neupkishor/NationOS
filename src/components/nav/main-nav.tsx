'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { NAV_LINKS, FOOTER_LINKS, SYSTEM_LINKS } from '@/lib/constants';
import { ShieldCheck, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function MainNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    // For setup, we want to match parent and all children
    if (path === '/setup') return pathname.startsWith('/setup');
    return pathname.startsWith(path) && (pathname.length === path.length || pathname[path.length] === '/');
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">NationOS</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>SYSTEM</SidebarGroupLabel>
          <SidebarMenu>
          {SYSTEM_LINKS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <Separator className="my-2" />
         <SidebarMenu>
          {FOOTER_LINKS.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="p-2 mt-4">
            <div className="flex items-center gap-3">
                 <Avatar className="h-9 w-9">
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">Admin</p>
                    <p className="text-xs text-muted-foreground">admin@nationos.gov</p>
                </div>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
