import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Heart,
  Palette,
  Layers,
  Calendar,
  Image as ImageIcon,
  Users,
  MessageSquareCheck,
  Music,
  Settings,
  Eye,
  QrCode,
  LogOut,
  Sparkles,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'basic_info'
  | 'theme'
  | 'sections'
  | 'events'
  | 'gallery'
  | 'family'
  | 'rsvp'
  | 'music'
  | 'settings'
  | 'preview'
  | 'qrcode';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isPublished: boolean;
  slug: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isPublished,
  slug,
}) => {
  const { logout } = useAuth();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'basic_info', label: 'Couple Details', icon: <Heart size={18} /> },
    { id: 'theme', label: 'Customize Theme', icon: <Palette size={18} /> },
    { id: 'sections', label: 'Section Builder', icon: <Layers size={18} /> },
    { id: 'events', label: 'Wedding Events', icon: <Calendar size={18} /> },
    { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon size={18} /> },
    { id: 'family', label: 'Family Members', icon: <Users size={18} /> },
    { id: 'rsvp', label: 'RSVP Responses', icon: <MessageSquareCheck size={18} /> },
    { id: 'music', label: 'Background Music', icon: <Music size={18} /> },
    { id: 'settings', label: 'Settings & Privacy', icon: <Settings size={18} /> },
    { id: 'preview', label: 'Live Preview', icon: <Eye size={18} /> },
    { id: 'qrcode', label: 'Download QR Code', icon: <QrCode size={18} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="bg-warning text-dark p-2 rounded-circle d-flex align-items-center justify-content-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h5 className="font-heading gold-text-gradient mb-0 fw-bold">Wedding Admin</h5>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            /w/{slug}
          </small>
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-3 py-2 border-bottom border-secondary border-opacity-25">
        <div className="d-flex align-items-center justify-content-between bg-dark bg-opacity-50 p-2 rounded-3">
          <span className="small text-light">Status:</span>
          <span className={`badge ${isPublished ? 'bg-success' : 'bg-secondary'}`}>
            {isPublished ? 'PUBLISHED' : 'DRAFT'}
          </span>
        </div>
      </div>

      <nav className="flex-grow-1 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-3 border-top border-secondary border-opacity-25">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
