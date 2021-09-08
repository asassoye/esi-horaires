import FullCalendar, { EventApi, EventClickArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import iCalendarPlugin from '@fullcalendar/icalendar'
import frLocale from '@fullcalendar/core/locales/fr'
import CalSelector from './CalSelector'
import { useState } from 'react'
import Footer from './Footer'
import CalLink from './CalLink'
import CalDescription from './CalDescription'

const json = require('../config/calendars.json') as calendarJson

interface calItem {
  key: string,
  name: string,
  calendar: string
}

interface calCategory {
  key: string,
  name: string,
  items: calItem[]
}

interface calendarJson extends Array<calCategory> {}

const App = (): JSX.Element => {

  const search = new URLSearchParams(location.search)

  const [category, setCategory] = useState(
    search.has('type')
      ? json.find(element => element.key == search.get('type'))
      : undefined
  )
  const [selected, setSelected] = useState(
    search.has('ressource')
      ? category?.items.find(element => element.key == search.get('ressource'))
      : undefined
  )
  const [selectedEvent, setSelectedEvent] = useState(
    undefined as EventApi | undefined)

  const selectEventHandler = (e: EventClickArg) => {
    e.jsEvent.preventDefault()
    setSelectedEvent(e.event)
  }

  /**
   * Si l'utilisateur retourne à la page précédente, affiche le bon calendrier
   */
  window.addEventListener('popstate', (e) => {
    setCategory(e.state.category)
    setSelected(e.state.ressource)
  })

  return (
    <>
      <main className={'container-fluid mt-3'}>
        <CalSelector items={json} category={category} setCategory={setCategory}
                     selected={selected} setSelected={setSelected}/>

        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, iCalendarPlugin]}
          initialView={'timeGridWeek'}
          weekends={true}
          hiddenDays={[0]}
          headerToolbar={{
            start: 'prev today next',
            center: 'title',
            end: 'dayGridMonth timeGridWeek timeGridDay'
          }}
          slotMinTime={'08:00:00'}
          slotMaxTime={'22:00:00'}
          businessHours={{
            dayOfWeek: [1, 2, 3, 4, 5],
            startTime: '08:15',
            endTime: '18:00'
          }}
          fixedWeekCount={false}
          showNonCurrentDates={false}
          locale={frLocale}
          events={selected ?
            {
              url: selected.calendar ?? '',
              format: 'ics'
            } : undefined
          }
          contentHeight={'75vh'}
          stickyHeaderDates={true}
          eventClick={selectEventHandler}
        />

        <CalLink selected={selected}/>
      </main>

      {selectedEvent ? <CalDescription event={selectedEvent}
                                       set={setSelectedEvent}/> : <></>}

      <Footer/>
    </>
  )
}

export { calItem, calCategory, calendarJson }

export default App
