import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCalendar } from '@/contexts';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events, addEvent, updateEvent, deleteEvent, getUpcomingEvents } = useCalendar();

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    type: 'meeting',
    description: '',
    location: '',
    attendees: ''
  });

  const eventStyleGetter = useCallback((event) => {
    const eventTypes = {
      meeting: { backgroundColor: '#3b82f6', color: 'white' },
      deadline: { backgroundColor: '#ef4444', color: 'white' },
      presentation: { backgroundColor: '#10b981', color: 'white' },
      workshop: { backgroundColor: '#8b5cf6', color: 'white' },
      default: { backgroundColor: '#6b7280', color: 'white' }
    };

    return {
      style: eventTypes[event.type] || eventTypes.default
    };
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start,
      end,
      title: '',
      description: '',
      location: '',
      attendees: ''
    });
    setSelectedEvent(null);
    setShowEventDialog(true);
  }, [newEvent]);

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      updateEvent(selectedEvent);
    } else {
      // Add new event
      addEvent(newEvent);
    }
    setShowEventDialog(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      type: 'meeting',
      description: '',
      location: '',
      attendees: ''
    });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setShowEventDialog(false);
      setSelectedEvent(null);
    }
  };

  const getEventTypeBadge = (type) => {
    const variants = {
      meeting: 'bg-blue-100 text-blue-800',
      deadline: 'bg-red-100 text-red-800',
      presentation: 'bg-green-100 text-green-800',
      workshop: 'bg-purple-100 text-purple-800',
    };
    return variants[type] || 'bg-gray-100 text-gray-800';
  };

  const upcomingEvents = getUpcomingEvents(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">Manage your events and appointments</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {events.filter(e => e.type === 'meeting').length} Meeting
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  {events.filter(e => e.type === 'deadline').length} Deadline
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {events.filter(e => e.type === 'presentation').length} Presentation
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                  {events.filter(e => e.type === 'workshop').length} Workshop
                </Badge>
              </div>
            </div>
          </div>
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedEvent(null);
                setNewEvent({
                  title: '',
                  start: new Date(),
                  end: new Date(),
                  type: 'meeting',
                  description: '',
                  location: '',
                  attendees: ''
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedEvent ? 'Edit Event' : 'Add New Event'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={selectedEvent ? selectedEvent.title : newEvent.title}
                    onChange={(e) => {
                      if (selectedEvent) {
                        setSelectedEvent({ ...selectedEvent, title: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, title: e.target.value });
                      }
                    }}
                    placeholder="Event title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start">Start Date</Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      value={moment(selectedEvent ? selectedEvent.start : newEvent.start).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, start: date });
                        } else {
                          setNewEvent({ ...newEvent, start: date });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Date</Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      value={moment(selectedEvent ? selectedEvent.end : newEvent.end).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, end: date });
                        } else {
                          setNewEvent({ ...newEvent, end: date });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={selectedEvent ? selectedEvent.type : newEvent.type}
                    onValueChange={(value) => {
                      if (selectedEvent) {
                        setSelectedEvent({ ...selectedEvent, type: value });
                      } else {
                        setNewEvent({ ...newEvent, type: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={selectedEvent ? selectedEvent.location : newEvent.location}
                    onChange={(e) => {
                      if (selectedEvent) {
                        setSelectedEvent({ ...selectedEvent, location: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, location: e.target.value });
                      }
                    }}
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedEvent ? selectedEvent.description : newEvent.description}
                    onChange={(e) => {
                      if (selectedEvent) {
                        setSelectedEvent({ ...selectedEvent, description: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, description: e.target.value });
                      }
                    }}
                    placeholder="Event description"
                  />
                </div>

                <div>
                  <Label htmlFor="attendees">Attendees (comma separated)</Label>
                  <Input
                    id="attendees"
                    value={selectedEvent ? 
                      (Array.isArray(selectedEvent.attendees) ? selectedEvent.attendees.join(', ') : selectedEvent.attendees) :
                      newEvent.attendees
                    }
                    onChange={(e) => {
                      if (selectedEvent) {
                        setSelectedEvent({ ...selectedEvent, attendees: e.target.value.split(',').map(a => a.trim()) });
                      } else {
                        setNewEvent({ ...newEvent, attendees: e.target.value });
                      }
                    }}
                    placeholder="John, Jane, Mike"
                  />
                </div>

                <div className="flex justify-between">
                  <div>
                    {selectedEvent && (
                      <Button variant="destructive" onClick={handleDeleteEvent}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEvent}>
                      {selectedEvent ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {moment(date).format('MMMM YYYY')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDate(moment(date).subtract(1, view).toDate())}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDate(moment(date).add(1, view).toDate())}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 lg:h-[600px]">
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  className="rbc-calendar"
                  views={['month', 'week', 'day', 'agenda']}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                       onClick={() => handleSelectEvent(event)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {moment(event.start).format('MMM DD, HH:mm')}
                        </div>
                        {event.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className={`ml-2 ${getEventTypeBadge(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;
