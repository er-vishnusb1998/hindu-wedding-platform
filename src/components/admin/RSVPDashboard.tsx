import React, { useState, useEffect } from 'react';
import { RSVP } from '../../types';
import { weddingService } from '../../services/weddingService';
import { exportRsvpsToCsv } from '../../utils/csvExport';
import { MessageSquareCheck, Download, Search, Users, CheckCircle2, XCircle } from 'lucide-react';

interface RSVPDashboardProps {
  weddingId: string;
  weddingTitle: string;
}

export const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ weddingId, weddingTitle }) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    weddingService.getRsvps(weddingId).then((data) => {
      setRsvps(data);
      setLoading(false);
    });
  }, [weddingId]);

  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch = r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone_number.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || r.attending_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAttendingGuests = rsvps
    .filter((r) => r.attending_status === 'attending')
    .reduce((sum, r) => sum + (r.number_of_guests || 1), 0);

  const totalDeclined = rsvps.filter((r) => r.attending_status === 'not_attending').length;

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 border-bottom pb-3 gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <MessageSquareCheck className="text-warning" size={22} />
            <span>Guest RSVP Dashboard</span>
          </h4>
          <p className="text-muted small mb-0">View all guest responses and export guest lists to CSV.</p>
        </div>

        <button
          onClick={() => exportRsvpsToCsv(rsvps, weddingTitle)}
          className="btn btn-outline-success rounded-pill px-3.5 fw-semibold d-flex align-items-center gap-2"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="p-3 bg-light border rounded-3 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small">Total Responses</div>
              <div className="fs-3 fw-bold text-dark">{rsvps.length}</div>
            </div>
            <MessageSquareCheck className="text-primary opacity-50" size={32} />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 bg-light border rounded-3 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small">Total Attending Guests</div>
              <div className="fs-3 fw-bold text-success">{totalAttendingGuests}</div>
            </div>
            <CheckCircle2 className="text-success opacity-50" size={32} />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-3 bg-light border rounded-3 d-flex align-items-center justify-content-between">
            <div>
              <div className="text-muted small">Declines</div>
              <div className="fs-3 fw-bold text-danger">{totalDeclined}</div>
            </div>
            <XCircle className="text-danger opacity-50" size={32} />
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by guest name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="attending">Attending Only</option>
            <option value="not_attending">Declined Only</option>
          </select>
        </div>
      </div>

      {/* RSVP Table */}
      {loading ? (
        <div className="text-center py-4">Loading RSVP responses...</div>
      ) : filteredRsvps.length === 0 ? (
        <div className="text-center py-5 border rounded-3 bg-light text-muted">
          No RSVP responses match your search criteria.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th>Guest Name</th>
                <th>Status</th>
                <th>Count</th>
                <th>Phone</th>
                <th>Meal Preference</th>
                <th>Message</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredRsvps.map((r) => (
                <tr key={r.id}>
                  <td className="fw-semibold text-dark">{r.guest_name}</td>
                  <td>
                    <span className={`badge ${r.attending_status === 'attending' ? 'bg-success' : 'bg-danger'}`}>
                      {r.attending_status === 'attending' ? 'Attending' : 'Declined'}
                    </span>
                  </td>
                  <td className="fw-bold">{r.number_of_guests}</td>
                  <td className="small text-muted">{r.phone_number}</td>
                  <td className="small">{r.meal_preference || 'N/A'}</td>
                  <td className="small text-muted fst-italic max-w-xs text-truncate" style={{ maxWidth: '200px' }}>
                    {r.message || '—'}
                  </td>
                  <td className="small text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
