import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../ThemedView';
import { EventModal } from './EventModal';
import type { Event } from '@/types/calendar';

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const markedDates = useMemo(() => {
    const dates: { [key: string]: { marked: boolean; dotColor: string } } = {};
    events.forEach(event => {
      const dateStr = new Date(event.date).toISOString().split('T')[0];
      dates[dateStr] = {
        marked: true,
        dotColor: '#007AFF',
      };
    });
    return dates;
  }, [events]);

  const saveEvent = async (event: Event) => {
    try {
      // Check for overlapping events
      const hasOverlap = events.some((e) => {
        if (e.id === event.id) return false;
        if (new Date(e.date).toDateString() !== new Date(event.date).toDateString()) return false;
        
        const eventStart = new Date(`${event.date.toDateString()} ${event.startTime}`);
        const eventEnd = new Date(`${event.date.toDateString()} ${event.endTime}`);
        const existingStart = new Date(`${e.date.toDateString()} ${e.startTime}`);
        const existingEnd = new Date(`${e.date.toDateString()} ${e.endTime}`);
        
        return (eventStart < existingEnd && eventEnd > existingStart);
      });

      if (hasOverlap) {
        throw new Error('Event overlaps with existing events');
      }

      const updatedEvents = selectedEvent
        ? events.map(e => e.id === event.id ? event : e)
        : [...events, event];

      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      setModalVisible(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      // Handle error (show error message to user)
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const updatedEvents = events.filter(e => e.id !== eventId);
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      setModalVisible(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const onDayPress = (day: DateData) => {
    const selectedDateEvents = events.filter(
      event => new Date(event.date).toISOString().split('T')[0] === day.dateString
    );
    
    setSelectedDate(day.dateString);
    
    if (selectedDateEvents.length > 0) {
      setSelectedEvent(selectedDateEvents[0]);
    } else {
      setSelectedEvent(null);
    }
    
    const selectedDateTime = new Date(day.dateString);
    if (selectedDateTime >= new Date()) {
      setModalVisible(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <RNCalendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: '#007AFF',
          },
        }}
        theme={{
          todayTextColor: '#007AFF',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
        }}
      />
      <EventModal
        visible={isModalVisible}
        event={selectedEvent}
        selectedDate={new Date(selectedDate)}
        onClose={() => {
          setModalVisible(false);
          setSelectedEvent(null);
        }}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 