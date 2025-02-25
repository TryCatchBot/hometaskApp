import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

interface CalendarHeaderProps {
  selectedDate: Date;
  onMonthChange: (date: Date) => void;
}

export function CalendarHeader({ selectedDate, onMonthChange }: CalendarHeaderProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    onMonthChange(newDate);
  };

  return (
    <ThemedView style={styles.container} variant="primary">
      <TouchableOpacity onPress={() => changeMonth(-1)}>
        <ThemedText>{'<'}</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.title}>
        {`${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
      </ThemedText>
      <TouchableOpacity onPress={() => changeMonth(1)}>
        <ThemedText>{'>'}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 