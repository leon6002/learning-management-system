// use client to avoid SSR error
'use client';

import {
  ActivitySquare,
  BarChart,
  Compass,
  Briefcase,
  Layout,
  List,
  UserCog,
  GraduationCap,
  NotebookTabs,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const routes = {
  mycourese: {
    icon: GraduationCap,
    label: '我的课程',
    href: '/mycourse',
    needPermission: [],
  },
  myNotes: {
    icon: NotebookTabs,
    label: '我的笔记',
    href: '/mynotes',
    needPermission: [],
  },
  searchCourse: {
    icon: Compass,
    label: '浏览课程',
    href: '/courses/search',
    needPermission: [],
  },
  searchJob: {
    icon: Compass,
    label: '浏览职位',
    href: '/',
    needPermission: [],
  },
  jobs: {
    icon: Briefcase,
    label: '岗位招聘',
    href: '/jobs',
    needPermission: [],
  },
  courseManage: {
    icon: List,
    label: '课程创作中心',
    href: '/teacher/courses',
    needPermission: [],
  },
  courseStatics: {
    icon: BarChart,
    label: '数据',
    href: '/teacher/analytics',
    needPermission: [],
  },
  hireManage: {
    icon: List,
    label: '招聘管理',
    href: '/hire/applicants',
  },
  jobManage: {
    icon: List,
    label: '职位发布',
    href: '/hire/jobs',
  },
  hireStatics: {
    icon: BarChart,
    label: '招聘数据',
    href: '/hire/analytics',
  },
  simpleCourse: {
    icon: GraduationCap,
    label: '公开课程',
    href: '/public-courses',
  },
  userManage: {
    icon: List,
    label: '用户管理',
    href: '/admin/users',
  },
  profile: {
    icon: UserCog,
    label: '我的资料',
    href: '/settings/profile',
  },
  personalization: {
    icon: Layout,
    label: '页面配置',
    href: '/settings/personalization',
    needPermission: [],
  },
};

const learnerRoutes = [routes.searchJob, routes.simpleCourse];

const teacherRoutes = [routes.courseManage];

const hireRoutes = [routes.jobManage];

const settingRoutes = [routes.profile];

const adminRoutes = [routes.userManage];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isHirePage =
    pathname?.startsWith('/hire') || pathname?.startsWith('/simple-course');
  const isAdminPage = pathname?.startsWith('/admin');
  const isSettingsPage = pathname?.startsWith('/settings');

  const routes = isTeacherPage
    ? teacherRoutes
    : isHirePage
      ? hireRoutes
      : isAdminPage
        ? adminRoutes
        : isSettingsPage
          ? settingRoutes
          : learnerRoutes;

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
