import { Outlet, useLocation } from 'react-router';
import { DynamicsSidebar } from './DynamicsSidebar';
import { DynamicsTopbar } from './DynamicsTopbar';
import { ShellProvider } from '../shell/ShellProvider';

export function Layout() {
  const { pathname } = useLocation();

  if (pathname === '/' || pathname === '/demo-access') {
    return (
      <div className="h-screen overflow-y-auto">
        <Outlet />
      </div>
    );
  }

  return (
    <ShellProvider>
      <div className="flex h-screen bg-[#faf9f8] dark:bg-gray-900">
        <DynamicsSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DynamicsTopbar />

          <main className="flex-1 overflow-y-auto bg-[#faf9f8] dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </ShellProvider>
  );
}
