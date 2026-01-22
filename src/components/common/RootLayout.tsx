import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

export default function RootLayout() {
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}