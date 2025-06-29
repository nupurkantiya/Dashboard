import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      start: new Date(2025, 5, 30, 10, 0), // Updated to current month
      end: new Date(2025, 5, 30, 11, 0),
      type: 'meeting',
      description: 'Weekly team standup meeting',
      location: 'Conference Room A',
      attendees: ['John', 'Jane', 'Mike']
    },
    {
      id: 2,
      title: 'Project Deadline',
      start: new Date(2025, 6, 2, 9, 0),
      end: new Date(2025, 6, 2, 17, 0),
      type: 'deadline',
      description: 'Final project submission',
      location: 'Office',
      attendees: ['All Team']
    },
    {
      id: 3,
      title: 'Client Presentation',
      start: new Date(2025, 6, 5, 14, 0),
      end: new Date(2025, 6, 5, 15, 30),
      type: 'presentation',
      description: 'Present quarterly results to client',
      location: 'Zoom',
      attendees: ['Sales Team', 'Management']
    },
    {
      id: 4,
      title: 'React Workshop',
      start: new Date(2025, 6, 1, 13, 0),
      end: new Date(2025, 6, 1, 16, 0),
      type: 'workshop',
      description: 'Advanced React development workshop',
      location: 'Training Room',
      attendees: ['Development Team']
    },
    {
      id: 5,
      title: 'Product Review',
      start: new Date(2025, 6, 3, 15, 0),
      end: new Date(2025, 6, 3, 16, 0),
      type: 'meeting',
      description: 'Monthly product review session',
      location: 'Conference Room B',
      attendees: ['Product Team', 'Stakeholders']
    }
  ]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
      attendees: Array.isArray(event.attendees) ? event.attendees : event.attendees.split(',').map(a => a.trim()).filter(a => a)
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getUpcomingEvents = (limit = 5) => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, limit);
  };

  return (
    <CalendarContext.Provider value={{
      events,
      setEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      getUpcomingEvents
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
