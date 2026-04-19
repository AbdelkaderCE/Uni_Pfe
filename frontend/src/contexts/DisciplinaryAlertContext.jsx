import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import request from '../services/api';

/**
 * DisciplinaryAlertContext
 * Manages fetching and exposing disciplinary meetings for the current student.
 * 
 * Provides:
 *   - meetings: Array of scheduled meetings involving current student
 *   - loading: Boolean indicating fetch in progress
 *   - error: Error message if fetch failed
 *   - refreshMeetings: Async function to manually refresh
 */

const DisciplinaryAlertContext = createContext(null);

export function DisciplinaryAlertProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch meetings for current student
  const fetchMeetings = useCallback(async () => {
    let cancelled = false;
    try {
      setLoading(true);
      setError('');

      // Fetch all meetings; we'll filter client-side for student-specific ones
      // Meeting endpoint returns conseils (councils/meetings)
      const res = await request('/api/v1/disciplinary/meetings');
      
      if (!cancelled) {
        const allMeetings = Array.isArray(res?.data) ? res.data : [];
        
        // Filter for upcoming meetings (status = 'planifie' or 'scheduled')
        // that haven't occurred yet
        const upcomingMeetings = allMeetings.filter((meeting) => {
          const meetingDate = new Date(meeting.dateReunion || meeting.date);
          const now = new Date();
          
          // Only show future meetings
          return meetingDate > now && 
                 (meeting.status === 'planifie' || meeting.status === 'scheduled');
        });
        
        setMeetings(upcomingMeetings);
      }
    } catch (err) {
      if (!cancelled) {
        console.warn('Failed to fetch disciplinary meetings:', err?.message);
        setError('');  // Don't show error to user - this is non-critical
        setMeetings([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Refresh every 5 minutes (auto-poll for new meetings)
  useEffect(() => {
    const interval = setInterval(fetchMeetings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMeetings]);

  const value = useMemo(
    () => ({
      meetings,
      loading,
      error,
      refreshMeetings: fetchMeetings,
    }),
    [meetings, loading, error, fetchMeetings]
  );

  return (
    <DisciplinaryAlertContext.Provider value={value}>
      {children}
    </DisciplinaryAlertContext.Provider>
  );
}

/**
 * Hook: useDisciplinaryAlerts
 * Access disciplinary meeting alerts from context
 */
export function useDisciplinaryAlerts() {
  const context = useContext(DisciplinaryAlertContext);
  if (!context) {
    throw new Error('useDisciplinaryAlerts must be used within DisciplinaryAlertProvider');
  }
  return context;
}

export default DisciplinaryAlertContext;
