import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import iCalendarPlugin from '@fullcalendar/icalendar'
import frLocale from '@fullcalendar/core/locales/fr'
import { CalendarOptions } from '@fullcalendar/core'

const defaultCalendarConfig : CalendarOptions = {
  plugins: [timeGridPlugin, dayGridPlugin, iCalendarPlugin],
  initialView: 'timeGridWeek',
  weekends: true,
  hiddenDays: [0],
  headerToolbar: {
    start: 'prev today next',
    center: 'title',
    end: 'dayGridMonth timeGridWeek timeGridDay'
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  businessHours: {
    dayOfWeek: [1, 2, 3, 4, 5],
    startTime: '08:15',
    endTime: '18:00'
  },
  fixedWeekCount: false,
  showNonCurrentDates: false,
  locale: frLocale,
  contentHeight: '75vh',
  stickyHeaderDates: true
}

export default defaultCalendarConfig
