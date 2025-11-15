'use client';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/nav/main-nav';
import { Header } from '@/components/layout/header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Get cookie for default open state
  // const layout = cookies().get('react-resizable:layout');
  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <MainNav />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
