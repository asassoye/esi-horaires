import FullCalendar, { EventApi, EventClickArg } from '@fullcalendar/react'
import ResourceSelector from './ResourceSelector'
import { useEffect, useState } from 'react'
import Footer from './Footer'
import CalLink from './CalLink'
import EventModal from './EventModal'
import { calendarData } from '../utils/fetchCalendars'
import defaultCalendarConfig from '../config/defaultCalendarConfig'
import { CalendarOptions } from '@fullcalendar/core'

interface AppProps {
  data?: calendarData
  default?: string
}

const App = (props: AppProps): JSX.Element => {
  const calendarsData = props.data
  const search = new URLSearchParams(location.search)

  const [selectedCategory, setSelectedCategory] = useState(
    calendarsData && search.has('type')
      ? calendarsData[search.get('type') ?? '']
      : (calendarsData && props.default
          ? calendarsData[props.default ?? '']
          : undefined)
  )

  const [selectedResource, setSelectedResource] = useState(
    search.has('ressource')
      ? selectedCategory?.items[search.get('ressource') ?? '']
      : undefined
  )

  const [selectedEvent, setSelectedEvent] = useState(
    undefined as EventApi | undefined)

  /**
   * Definition de l'État qui configure le calendrier
   */
  const [calendarConfig, setCalendarConfig] = useState({
    ...defaultCalendarConfig,
    eventSources: [
      {
        url: selectedResource?.calendar,
        format: 'ics'
      }],
    eventClick: (e: EventClickArg) => {
      e.jsEvent.preventDefault()
      setSelectedEvent(e.event)
    },
    eventDataTransform: (event) => {
      const eventProps = event.extendedProps
      const location = eventProps?.location
      if (location && !event.title?.endsWith(location)) {
        event.title = `${event.title} - ${location}`
      }

      return event
    }
  } as CalendarOptions)

  /**
   * Quand l'Utilisateur choisi une nouvelle ressource,
   * change l'État de configuration du calendrier
   */
  useEffect(() => {
    setCalendarConfig((oldState: CalendarOptions) => {
      return {
        ...oldState,
        eventSources: [
          {
            url: selectedResource?.calendar,
            format: 'ics'
          }]
      }
    })
  }, [selectedResource])

  /**
   * Quand l'Utilisateur choisi une ressource, change le titre de l'Onglet
   */
  useEffect(() => {
    const defaultTitle: string = 'ESI Horaires'

    document.title = selectedResource
      ? `${selectedResource.name} - ${defaultTitle}`
      : defaultTitle
  }, [selectedResource])

  /**
   * Si l'Utilisateur retourne à la page précédente, affiche le bon calendrier
   */
  window.addEventListener('popstate', (e) => {
    setSelectedCategory(e.state.category)
    setSelectedResource(e.state.ressource)
  })

  if (!calendarsData) {
    return <pre>Pas de chance, le site est cassé..</pre>
  }

  return (
    <>
      <main className={'container-fluid mt-3'}>
        <ResourceSelector items={calendarsData}
                          category={selectedCategory}
                          setCategory={setSelectedCategory}
                          selected={selectedResource}
                          setSelected={setSelectedResource}/>
        <FullCalendar {...calendarConfig} />
        <CalLink selectedResource={selectedResource}/>
      </main>

      {selectedEvent &&
      <EventModal selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}/>}

      <Footer/>
    </>
  )
}

export default App
