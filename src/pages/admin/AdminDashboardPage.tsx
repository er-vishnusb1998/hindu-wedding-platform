import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { weddingService } from '../../services/weddingService';
import { WeddingFullData, Wedding } from '../../types';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardOverview } from '../../components/admin/DashboardOverview';
import { BasicInfoEditor } from '../../components/admin/BasicInfoEditor';
import { ThemeEditor } from '../../components/admin/ThemeEditor';
import { SectionManager } from '../../components/admin/SectionManager';
import { EventsEditor } from '../../components/admin/EventsEditor';
import { GalleryManager } from '../../components/admin/GalleryManager';
import { FamilyEditor } from '../../components/admin/FamilyEditor';
import { RSVPDashboard } from '../../components/admin/RSVPDashboard';
import { MusicManager } from '../../components/admin/MusicManager';
import { SettingsEditor } from '../../components/admin/SettingsEditor';
import { LivePreviewModal } from '../../components/admin/LivePreviewModal';
import { QRCodeModal } from '../../components/admin/QRCodeModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [weddingData, setWeddingData] = useState<WeddingFullData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      weddingService.getAdminWeddings(user.id).then(async (weddings) => {
        if (weddings.length > 0) {
          const full = await weddingService.getWeddingBySlug(weddings[0].slug);
          setWeddingData(full);
        }
        setLoading(false);
      });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return <LoadingSpinner message="Loading Admin Dashboard..." />;
  }

  if (!weddingData) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light text-center p-4">
        <h4>No wedding invitation found.</h4>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-warning rounded-pill mt-3"
        >
          Initialize Demo Wedding
        </button>
      </div>
    );
  }

  const handleWeddingUpdated = (updatedWedding: Wedding) => {
    setWeddingData((prev) => (prev ? { ...prev, wedding: updatedWedding } : null));
  };

  const handleReload = async () => {
    if (weddingData) {
      const full = await weddingService.getWeddingBySlug(weddingData.wedding.slug);
      setWeddingData(full);
    }
  };

  const getTabTitle = (tab: AdminTab): string => {
    switch (tab) {
      case 'overview': return 'Dashboard Overview';
      case 'basic_info': return 'Couple & Wedding Details';
      case 'theme': return 'Theme & Aesthetics';
      case 'sections': return 'Invitation Sections Builder';
      case 'events': return 'Wedding Events Timeline';
      case 'gallery': return 'Photo Gallery';
      case 'family': return 'Family Blessings';
      case 'rsvp': return 'Guest RSVP Dashboard';
      case 'music': return 'Background Music & Card Opening';
      case 'settings': return 'Settings, Slug & Privacy';
      case 'preview': return 'Live Preview';
      case 'qrcode': return 'Invitation QR Code';
      default: return 'Admin Dashboard';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPublished={weddingData.wedding.status === 'published'}
        slug={weddingData.wedding.slug}
      />

      <main className="admin-main-content">
        <AdminHeader
          wedding={weddingData.wedding}
          onWeddingUpdated={handleWeddingUpdated}
          activeTabTitle={getTabTitle(activeTab)}
        />

        {activeTab === 'overview' && (
          <DashboardOverview data={weddingData} onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'basic_info' && (
          <BasicInfoEditor wedding={weddingData.wedding} onUpdated={handleWeddingUpdated} />
        )}

        {activeTab === 'theme' && (
          <ThemeEditor wedding={weddingData.wedding} onUpdated={handleWeddingUpdated} />
        )}

        {activeTab === 'sections' && (
          <SectionManager
            sections={weddingData.sections}
            onUpdated={(updatedSections) =>
              setWeddingData((prev) => (prev ? { ...prev, sections: updatedSections } : null))
            }
          />
        )}

        {activeTab === 'events' && (
          <EventsEditor
            weddingId={weddingData.wedding.id}
            events={weddingData.events}
            onUpdated={handleReload}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryManager
            weddingId={weddingData.wedding.id}
            gallery={weddingData.gallery}
            onUpdated={handleReload}
          />
        )}

        {activeTab === 'family' && (
          <FamilyEditor
            weddingId={weddingData.wedding.id}
            family={weddingData.family}
            onUpdated={handleReload}
          />
        )}

        {activeTab === 'rsvp' && (
          <RSVPDashboard
            weddingId={weddingData.wedding.id}
            weddingTitle={weddingData.wedding.title}
          />
        )}

        {activeTab === 'music' && (
          <MusicManager wedding={weddingData.wedding} onUpdated={handleWeddingUpdated} />
        )}

        {activeTab === 'settings' && (
          <SettingsEditor wedding={weddingData.wedding} onUpdated={handleWeddingUpdated} />
        )}

        {activeTab === 'preview' && (
          <LivePreviewModal slug={weddingData.wedding.slug} />
        )}

        {activeTab === 'qrcode' && (
          <QRCodeModal slug={weddingData.wedding.slug} title={weddingData.wedding.title} />
        )}
      </main>
    </div>
  );
};
