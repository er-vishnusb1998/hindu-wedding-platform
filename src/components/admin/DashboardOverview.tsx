import React, { useState, useEffect } from 'react';
import { WeddingFullData, RSVP } from '../../types';
import { weddingService } from '../../services/weddingService';
import { formatDateString, calculateTimeRemaining } from '../../utils/formatters';
import { analytics } from '../../lib/analytics';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Share2,
  Eye,
  Calendar,
  MessageSquareCheck,
} from 'lucide-react';

interface DashboardOverviewProps {
  data: WeddingFullData;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, onNavigateTab }) => {
  const [rsvps, setRsvps] = useState<RSVP[]>(data.rsvps || []);
  const [stats, setStats] = useState({ totalViews: 0, calendarAdds: 0, shares: 0 });

  useEffect(() => {
    weddingService.getRsvps(data.wedding.id).then(setRsvps);
    setStats(analytics.getStats(data.wedding.id));
  }, [data.wedding.id]);

  const attendingCount = rsvps
    .filter((r) => r.attending_status === 'attending')
    .reduce((sum, r) => sum + (r.number_of_guests || 1), 0);

  const declinesCount = rsvps.filter((r) => r.attending_status === 'not_attending').length;
  const time = calculateTimeRemaining(data.wedding.wedding_date, data.wedding.wedding_time);

  return (
    <div className="animate-fade-in-up">
      {/* Top Banner Status */}
      <div className="admin-card bg-primary text-white border-0 shadow-sm position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <span className="badge bg-warning text-dark mb-2 font-monospace">
              STATUS: {data.wedding.status.toUpperCase()}
            </span>
            <h2 className="font-heading gold-text-gradient fw-bold display-6 mb-2">
              {data.wedding.groom_name} &amp; {data.wedding.bride_name}
            </h2>
            <p className="text-light opacity-75 small mb-3">
              <Calendar size={16} className="me-1" />
              {formatDateString(data.wedding.wedding_date)} • {data.wedding.location}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button onClick={() => onNavigateTab('preview')} className="btn btn-warning btn-sm rounded-pill font-semibold">
                <Eye size={14} className="me-1" /> Live Preview
              </button>
              <button onClick={() => onNavigateTab('theme')} className="btn btn-outline-light btn-sm rounded-pill">
                Customize Theme
              </button>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center mt-3 mt-md-0 border-start border-light border-opacity-25 py-2">
            <Clock size={28} className="text-warning mb-1" />
            <div className="small text-uppercase tracking-wider text-light opacity-75">Time to Wedding</div>
            <div className="fs-3 font-heading fw-bold text-warning">
              {time.isPassed ? 'Celebration Begun' : `${time.days}d ${time.hours}h ${time.minutes}m`}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & RSVP Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small">Total RSVPs</div>
              <div className="stat-number">{rsvps.length}</div>
            </div>
            <MessageSquareCheck size={32} className="text-primary opacity-50" />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small">Attending Guests</div>
              <div className="stat-number text-success">{attendingCount}</div>
            </div>
            <Users size={32} className="text-success opacity-50" />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small">Declined</div>
              <div className="stat-number text-danger">{declinesCount}</div>
            </div>
            <XCircle size={32} className="text-danger opacity-50" />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card">
            <div>
              <div className="text-muted small">Invitation Views</div>
              <div className="stat-number text-info">{stats.totalViews}</div>
            </div>
            <Globe size={32} className="text-info opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="admin-card h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Calendar size={18} className="text-warning" />
              <span>Events Summary</span>
            </h5>
            {data.events.length === 0 ? (
              <p className="text-muted small">No events added yet. Add your wedding ceremonies!</p>
            ) : (
              <div className="list-group list-group-flush">
                {data.events.map((ev) => (
                  <div key={ev.id} className="list-group-item px-0 d-flex align-items-center justify-content-between">
                    <div>
                      <strong className="d-block text-dark">{ev.title}</strong>
                      <small className="text-muted">{ev.event_date} • {ev.event_time}</small>
                    </div>
                    <span className="badge bg-light text-dark border">{ev.venue_name}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNavigateTab('events')} className="btn btn-outline-primary btn-sm mt-3 w-100">
              Manage Events
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="admin-card h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <MessageSquareCheck size={18} className="text-warning" />
              <span>Recent RSVP Responses</span>
            </h5>
            {rsvps.length === 0 ? (
              <p className="text-muted small">No RSVP responses received yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {rsvps.slice(0, 4).map((r) => (
                  <div key={r.id} className="list-group-item px-0 d-flex align-items-center justify-content-between">
                    <div>
                      <strong className="d-block text-dark">{r.guest_name}</strong>
                      <small className="text-muted">{r.phone_number} • {r.number_of_guests} guest(s)</small>
                    </div>
                    <span className={`badge ${r.attending_status === 'attending' ? 'bg-success' : 'bg-danger'}`}>
                      {r.attending_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNavigateTab('rsvp')} className="btn btn-outline-primary btn-sm mt-3 w-100">
              View All RSVPs &amp; Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
