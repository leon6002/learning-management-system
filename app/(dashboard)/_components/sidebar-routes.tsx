// use client to avoid SSR error
'use client';

import {
  ActivitySquare,
  BarChart,
  Compass,
  Layout,
  List,
  UserCog,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const learnerRoutes = [
  {
    icon: Layout,
    label: '我的课程',
    href: '/',
  },
  {
    icon: Compass,
    label: '浏览课程',
    href: '/search',
  },
  {
    icon: UserCog,
    label: '个人中心',
    href: '/personalization',
  },
  // {
  // 	icon: Phone,
  // 	label: 'Video Call',
  // 	href: '/channel',
  // },
];

const teacherRoutes = [
  {
    icon: List,
    label: '课程创作中心',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: '数据',
    href: '/teacher/analytics',
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');

  const routes = isTeacherPage ? teacherRoutes : learnerRoutes;

  return (
    <div className='flex flex-col w-full'>
      {routes.map((route) => {
        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        );
      })}
    </div>
  );
};

export default SidebarRoutes;
