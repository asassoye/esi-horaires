import { Dispatch, SetStateAction } from 'react'
import { EventApi } from '@fullcalendar/react'
import parseDescription from '../utils/parseDescription'

interface EventModalProps {
  selectedEvent?: EventApi,
  setSelectedEvent: Dispatch<SetStateAction<EventApi | undefined>>
}

const EventModal = (props: EventModalProps): JSX.Element => {
  const {
    selectedEvent,
    setSelectedEvent
  } = props

  const description = selectedEvent?.extendedProps.description
  const eventAttributes = parseDescription(description)

  return (
    <div className="offcanvas offcanvas-start show" tabIndex={-1} id="offcanvas"
         style={{ visibility: 'visible' }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title"
            id="offcanvasLabel">{selectedEvent?.title}</h5>
        <button type="button" className="btn-close text-reset"
                data-bs-dismiss="offcanvas" aria-label="Close"
                onClick={() => { setSelectedEvent(undefined) }}/>
      </div>
      <div className="offcanvas-body">
        <table className={'table'}>
          <tbody>
          {eventAttributes.aa &&
          <tr>
            <th scope={'row'}>Matière</th>
            <td><p>{eventAttributes.aa}</p></td>
          </tr>}

          {eventAttributes.lieux &&
          <tr>
            <th scope={'row'}>Locaux</th>
            <td>{eventAttributes.lieux.map(
              (lieu) => <p key={lieu}>{lieu}</p>)}</td>
          </tr>}

          {eventAttributes.profs &&
          <tr>
            <th scope={'row'}>Professeurs</th>
            <td>{eventAttributes.profs.map(
              (prof) => <p key={prof}>{prof}</p>)}</td>
          </tr>}

          {eventAttributes.groupes &&
          <tr>
            <th scope={'row'}>Groupes</th>
            <td>{eventAttributes.groupes.map(
              (groupe) => <p key={groupe}>{groupe}</p>)}</td>
          </tr>}

          {eventAttributes.type &&
          <tr>
            <th scope={'row'}>Type</th>
            <td><p>{eventAttributes.type}</p></td>
          </tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EventModal
