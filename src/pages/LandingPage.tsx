import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Globe, Shield, Smartphone, ArrowRight, Eye, UserCheck } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-vh-100 bg-dark text-white d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1A0B13 0%, #30101F 100%)' }}>
      {/* Header */}
      <header className="border-bottom border-secondary border-opacity-25 py-3">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Sparkles className="text-warning" size={24} />
            <span className="font-heading gold-text-gradient fw-bold fs-4">Mangalyam Invite</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/w/vishnu-vijisha" className="btn btn-outline-warning btn-sm rounded-pill px-3">
              View Demo Invitation
            </Link>
            <Link to="/admin/login" className="btn btn-warning btn-sm rounded-pill px-3 fw-bold">
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container text-center py-4">
          <span className="badge bg-warning text-dark rounded-pill px-3 py-1 text-uppercase tracking-wider fw-semibold mb-3">
            Luxury Indian &amp; Hindu Digital Wedding Platform
          </span>

          <h1 className="font-heading gold-text-gradient fw-bold display-4 mb-3">
            Craft Royal, Mobile-First Hindu Wedding Invitations
          </h1>

          <p className="lead text-light opacity-75 max-w-2xl mx-auto mb-4" style={{ fontSize: '1.15rem' }}>
            Personalized, interactive digital wedding invitations with dual-language support (English &amp; Malayalam), live countdowns, background music, instant RSVPs, and loginless guest access.
          </p>

          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-5">
            <Link to="/w/vishnu-vijisha" className="btn btn-warning btn-lg rounded-pill px-4 fw-bold shadow-lg d-inline-flex align-items-center gap-2">
              <Eye size={20} />
              <span>Explore Demo Invitation</span>
            </Link>

            <Link to="/admin/login" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2">
              <UserCheck size={20} />
              <span>Organizer Admin Portal</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="row g-4 justify-content-center text-start mt-4">
            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-secondary border-opacity-25 h-100">
                <Smartphone className="text-warning mb-3" size={32} />
                <h5 className="font-heading text-warning fw-bold mb-2">Mobile First &amp; Loginless</h5>
                <p className="small text-light opacity-75 mb-0">
                  Guests open invitations directly via clean URLs (`/w/vishnu-vijisha`) with zero login popups.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-secondary border-opacity-25 h-100">
                <Globe className="text-warning mb-3" size={32} />
                <h5 className="font-heading text-warning fw-bold mb-2">Malayalam &amp; English Dual Language</h5>
                <p className="small text-light opacity-75 mb-0">
                  Native font support for Malayalam titles, event descriptions, and traditional rituals.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-secondary border-opacity-25 h-100">
                <Shield className="text-warning mb-3" size={32} />
                <h5 className="font-heading text-warning fw-bold mb-2">Full Admin Control</h5>
                <p className="small text-light opacity-75 mb-0">
                  Customize themes, reorder sections, manage gallery, track RSVPs, and export guest CSVs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-top border-secondary border-opacity-25 py-3 text-center text-muted small">
        &copy; {new Date().getFullYear()} Hindu Wedding Invitation Platform. Production Ready &amp; Mobile Optimized.
      </footer>
    </div>
  );
};
