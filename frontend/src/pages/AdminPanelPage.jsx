import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Settings2,
  UserCog,
  Users,
} from 'lucide-react';
import AdminSectionCard from '../components/admin/AdminSectionCard';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../theme/ThemeProvider';

const SIDEBAR_THEME_KEYS = ['slate', 'blue', 'indigo', 'emerald', 'rose'];

const CARD_THEME_STYLES = {
  slate: {
    card: 'border-edge bg-surface hover:bg-surface-200',
    iconWrap: 'bg-surface-200',
    icon: 'text-ink-secondary',
    title: 'text-ink',
    description: 'text-ink-secondary',
    action: 'text-ink-tertiary group-hover:text-ink-secondary',
    actionButton: 'border-edge bg-surface text-ink-tertiary hover:bg-surface-200 hover:border-edge',
  },
  blue: {
    card: 'border-edge bg-surface hover:bg-surface-200',
    iconWrap: 'bg-surface-200',
    icon: 'text-ink-secondary',
    title: 'text-ink',
    description: 'text-ink-secondary',
    action: 'text-ink-tertiary group-hover:text-ink-secondary',
    actionButton: 'border-edge bg-surface text-ink-tertiary hover:bg-surface-200 hover:border-edge',
  },
  indigo: {
    card: 'border-edge bg-surface hover:bg-surface-200',
    iconWrap: 'bg-surface-200',
    icon: 'text-ink-secondary',
    title: 'text-ink',
    description: 'text-ink-secondary',
    action: 'text-ink-tertiary group-hover:text-ink-secondary',
    actionButton: 'border-edge bg-surface text-ink-tertiary hover:bg-surface-200 hover:border-edge',
  },
  emerald: {
    card: 'border-edge bg-surface hover:bg-surface-200',
    iconWrap: 'bg-surface-200',
    icon: 'text-ink-secondary',
    title: 'text-ink',
    description: 'text-ink-secondary',
    action: 'text-ink-tertiary group-hover:text-ink-secondary',
    actionButton: 'border-edge bg-surface text-ink-tertiary hover:bg-surface-200 hover:border-edge',
  },
  rose: {
    card: 'border-edge bg-surface hover:bg-surface-200',
    iconWrap: 'bg-surface-200',
    icon: 'text-ink-secondary',
    title: 'text-ink',
    description: 'text-ink-secondary',
    action: 'text-ink-tertiary group-hover:text-ink-secondary',
    actionButton: 'border-edge bg-surface text-ink-tertiary hover:bg-surface-200 hover:border-edge',
  },
};

function getStoredThemeColor() {
  if (typeof window === 'undefined') return 'blue';
  const stored = localStorage.getItem('themeColor');
  return SIDEBAR_THEME_KEYS.includes(stored) ? stored : 'blue';
}

const MAIN_SECTIONS = [
  {
    key: 'users',
    title: 'User Management',
    description: 'Create accounts, assign roles, and supervise access across the platform.',
    to: '/dashboard/admin/users',
    icon: Users,
  },
  {
    key: 'students',
    title: 'Student Management',
    description: 'Maintain student records, onboarding, and academic profile data.',
    to: '/dashboard/admin/users',
    icon: GraduationCap,
  },
  {
    key: 'teachers',
    title: 'Teacher Management',
    description: 'Manage teacher profiles, permissions, and instructional responsibilities.',
    to: '/dashboard/admin/users',
    icon: UserCog,
  },
  {
    key: 'academic-assignment',
    title: 'Academic Assignment',
    description: 'Handle affectation academique and align classes with faculty resources.',
    to: '/dashboard/admin/academic/assignments',
    icon: Settings2,
  },
  {
    key: 'pfe-management',
    title: 'PFE Management',
    description: 'Create subjects, assign groups, validate choices, and set jury composition.',
    to: '/dashboard/admin/pfe',
    icon: BookOpen,
  },
  {
    key: 'disciplinary',
    title: 'Disciplinary Management',
    description: 'Review cases, apply decisions, and keep disciplinary workflows compliant.',
    to: '/dashboard/disciplinary',
    icon: ShieldAlert,
  },
];

export default function AdminPanelPage() {
  const { user } = useAuth();
  const { sidebarColor } = useTheme();

  const resolvedThemeColor = SIDEBAR_THEME_KEYS.includes(sidebarColor)
    ? sidebarColor
    : getStoredThemeColor();
  const cardThemeStyle = CARD_THEME_STYLES[resolvedThemeColor] || CARD_THEME_STYLES.blue;

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-edge bg-surface p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-brand/5 blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-tertiary">Administration</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">Admin Control Center</h1>
          <p className="mt-2 max-w-3xl text-sm text-ink-secondary">Manage your system efficiently with a modern, centralized control panel.</p>
          <p className="mt-1 text-xs text-ink-tertiary">Signed in as {user?.prenom} {user?.nom}</p>
        </div>
      </header>

      <section className="rounded-3xl border border-edge bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-ink">Main Sections</h2>
            <p className="mt-1 text-sm text-ink-secondary">Choose a section to continue administration tasks.</p>
          </div>
          <Link
            to="/dashboard/admin/site-settings"
            className={`inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${cardThemeStyle.actionButton}`}
          >
            Site Configuration
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MAIN_SECTIONS.map((section) => (
            <AdminSectionCard
              key={section.key}
              to={section.to}
              title={section.title}
              description={section.description}
              Icon={section.icon}
              themeStyle={cardThemeStyle}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
