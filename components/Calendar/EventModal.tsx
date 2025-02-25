import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import type { Event } from '@/types/calendar';

interface EventModalProps {
  visible: boolean;
  event: Event | null;
  selectedDate: Date;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const REPEAT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'bi-weekly' },
  { label: 'Monthly', value: 'monthly' },
] as const;

export function EventModal({ 
  visible, 
  event, 
  selectedDate, 
  onClose, 
  onSave, 
  onDelete 
}: EventModalProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(event?.startTime || '09:00');
  const [endTime, setEndTime] = useState(event?.endTime || '10:00');
  const [repeatOption, setRepeatOption] = useState(event?.repeatOption || 'none');

  useEffect(() => {
    if (visible) {
      setTitle(event?.title || '');
      setStartTime(event?.startTime || '09:00');
      setEndTime(event?.endTime || '10:00');
      setRepeatOption(event?.repeatOption || 'none');
    }
  }, [visible, event]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      title: title.trim(),
      date: selectedDate,
      startTime,
      endTime,
      repeatOption,
      createdAt: event?.createdAt || new Date(),
    };
    onSave(newEvent);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>
            {event ? 'Edit Event' : 'New Event'}
          </ThemedText>
          
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Event Title"
          />
          
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Start Time (HH:MM)"
              keyboardType="numbers-and-punctuation"
            />
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="End Time (HH:MM)"
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View style={styles.repeatContainer}>
            <ThemedText>Repeat:</ThemedText>
            {REPEAT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.repeatOption,
                  repeatOption === option.value && styles.repeatOptionSelected
                ]}
                onPress={() => setRepeatOption(option.value)}
              >
                <ThemedText>{option.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onClose}
            >
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            
            {event && (
              <TouchableOpacity 
                style={[styles.button, styles.deleteButton]} 
                onPress={() => onDelete(event.id)}
              >
                <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '48%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  repeatContainer: {
    marginVertical: 10,
  },
  repeatOption: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  repeatOptionSelected: {
    backgroundColor: '#007AFF',
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  saveButtonText: {
    color: '#ffffff',
  },
}); 