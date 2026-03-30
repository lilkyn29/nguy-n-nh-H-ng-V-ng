/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getYear, getMonth, getDate } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarEvent } from './types';
import { internationalHolidays, lunarHolidays, vietnameseHolidays } from './constants';
import * as AmLich from 'amlich';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    isAnnual: false,
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    let eventsToSet: CalendarEvent[] = [];
    if (savedEvents) {
      eventsToSet = JSON.parse(savedEvents);
    }
    
    // Add holidays if not present
    let updated = false;
    [...internationalHolidays, ...vietnameseHolidays].forEach(holiday => {
      if (!eventsToSet.find(e => e.title === holiday.title && e.isAnnual)) {
        eventsToSet.push({ ...holiday, id: Date.now().toString() + Math.random() });
        updated = true;
      }
    });
    
    if (updated || !savedEvents) {
      setEvents(eventsToSet);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: CalendarEvent = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setEvents([...events, event]);
      setShowModal(false);
      setNewEvent({ title: '', date: '', startTime: '', endTime: '', description: '', isAnnual: false });
    }
  };

  const handleDeleteEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event && event.description === 'International holiday') {
      return;
    }
    setEvents(events.filter(e => e.id !== id));
  };

  const getLunarDate = (date: Date) => {
    try {
      // @ts-ignore
      const lunar = AmLich.convertSolar2Lunar(getDate(date), getMonth(date) + 1, getYear(date), 7.0);
      if (lunar && lunar.length >= 3) {
        return `${lunar[0]}/${lunar[1]}/${lunar[2]}`;
      }
      return 'Không xác định';
    } catch (e) {
      return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 text-sky-950">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light tracking-tight text-sky-900">Personal Calendar</h1>
        <div className="flex items-center gap-4 bg-white/50 p-2 rounded-full shadow-sm">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-sky-100 transition-colors"><ChevronLeft /></button>
          <span className="text-lg font-medium w-40 text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-sky-100 transition-colors"><ChevronRight /></button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentDate.toString()}
          className="grid grid-cols-7 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-sky-700 py-2">{day}</div>
          ))}
          {emptyDays.map(i => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const dayEvents = events.filter(e => {
              const eventDate = new Date(e.date);
              if (e.isAnnual) {
                return eventDate.getMonth() === day.getMonth() && eventDate.getDate() === day.getDate();
              }
              return isSameDay(eventDate, day);
            });
            
            return (
              <div
                key={day.toString()}
                className={`relative min-h-32 bg-white/70 p-2 rounded-2xl border ${isSameDay(day, new Date()) ? 'border-sky-500 bg-sky-50' : 'border-sky-100'} hover:border-sky-200 cursor-pointer transition-all shadow-sm hover:shadow-md hover:scale-[1.02]`}
                onClick={() => {
                  setNewEvent({ ...newEvent, date: format(day, 'yyyy-MM-dd') });
                  setShowModal(true);
                }}
              >
                <div className="text-base font-semibold text-sky-900 mb-2">{format(day, 'd')}</div>
                <div className="absolute top-2 right-2 text-[10px] text-sky-500 font-medium">{getLunarDate(day)}</div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {dayEvents.map(event => {
                    const isInternationalHoliday = event.isAnnual && event.description === 'International holiday';
                    const isVietnameseHoliday = event.isAnnual && event.description === 'Vietnamese holiday';
                    const isHoliday = isInternationalHoliday || isVietnameseHoliday;
                    
                    return (
                      <div key={event.id} className={`text-xs p-1.5 rounded-lg truncate flex justify-between items-center ${isInternationalHoliday ? 'bg-red-100 text-red-900' : isVietnameseHoliday ? 'bg-green-100 text-green-900' : 'bg-sky-200 text-sky-900'}`}>
                        {event.title}
                        {!isHoliday && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} className="hover:text-red-600"><Trash2 size={12} /></button>
                        )}
                      </div>
                    );
                  })}
                  {(() => {
                    // @ts-ignore
                    const lunar = AmLich.convertSolar2Lunar(getDate(day), getMonth(day) + 1, getYear(day), 7.0);
                    if (lunar && lunar.length >= 3) {
                      return lunarHolidays.filter(h => h.lunarDay === lunar[0] && h.lunarMonth === lunar[1]).map(h => (
                        <div key={h.title} className="text-xs p-1.5 rounded-lg truncate bg-green-100 text-green-900">
                          {h.title}
                        </div>
                      ));
                    }
                    return null;
                  })()}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sky-950/30 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-light mb-6 text-sky-950">Add Event</h2>
              <input type="text" placeholder="Title" className="w-full p-3 mb-4 border border-sky-100 rounded-xl bg-sky-50" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              <div className="flex gap-4 mb-4">
                <input type="time" className="w-full p-3 border border-sky-100 rounded-xl bg-sky-50" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                <input type="time" className="w-full p-3 border border-sky-100 rounded-xl bg-sky-50" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
              </div>
              <textarea placeholder="Description" className="w-full p-3 mb-6 border border-sky-100 rounded-xl bg-sky-50" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
              <div className="flex items-center gap-2 mb-6">
                <input type="checkbox" id="isAnnual" checked={newEvent.isAnnual} onChange={e => setNewEvent({...newEvent, isAnnual: e.target.checked})} />
                <label htmlFor="isAnnual" className="text-sm text-sky-900">Annual Event</label>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl bg-sky-100 text-sky-900 hover:bg-sky-200 transition-colors">Cancel</button>
                <button onClick={handleAddEvent} className="px-6 py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
