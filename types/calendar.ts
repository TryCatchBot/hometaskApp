export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  repeatOption?: 'weekly' | 'bi-weekly' | 'monthly' | 'none';
  createdAt: Date;
}

export interface CalendarDay {
  date: Date;
  events: Event[];
  isToday: boolean;
  isPast: boolean;
} 