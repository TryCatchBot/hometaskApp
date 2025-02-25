import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import type { Event } from '@/types/calendar';

interface CalendarGridProps {
  selectedDate: Date;
  events: Event[];
  onDayPress: (date: Date) => void;
  onEventPress: (event: Event) => void;
}

export function CalendarGrid({ 
  selectedDate, 
  events, 
  onDayPress, 
  onEventPress 
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay();
    
    // Add padding days from previous month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const today = new Date();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.weekDays}>
        {weekDays.map(day => (
          <ThemedText key={day} style={styles.weekDay}>{day}</ThemedText>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.day} />;
          }

          const dayEvents = events.filter(event => 
            event.date.toDateString() === date.toDateString()
          );

          const isPast = date < today;
          const isToday = date.toDateString() === today.toDateString();

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.day,
                isToday && styles.today,
                isPast && styles.pastDay
              ]}
              onPress={() => onDayPress(date)}
              disabled={isPast}
            >
              <ThemedText>{date.getDate()}</ThemedText>
              {dayEvents.length > 0 && (
                <View style={styles.eventIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  today: {
    backgroundColor: '#e6e6e6',
  },
  pastDay: {
    opacity: 0.5,
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 2,
  },
}); 