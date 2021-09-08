import { Dispatch, SetStateAction } from 'react'
import { EventApi } from '@fullcalendar/react'
import parseDescription from '../utils/parseDescription'

interface CalDescriptionProps {
  event?: EventApi,
  set: Dispatch<SetStateAction<EventApi | undefined>>
}

const CalDescription = (props: CalDescriptionProps): JSX.Element => {
  const {
    event,
    set
  } = props

  const description = event?.extendedProps.description
  const eventAttributes = parseDescription(description)

  return (
    <div className="offcanvas offcanvas-start show" tabIndex={-1} id="offcanvas"
         style={{ visibility: 'visible' }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasLabel">{event?.title}</h5>
        <button type="button" className="btn-close text-reset"
                data-bs-dismiss="offcanvas" aria-label="Close"
                onClick={() => {set(undefined)}}/>
      </div>
      <div className="offcanvas-body">
        <table className={'table'}>
          {eventAttributes.aa ? <tr>
            <th scope={'row'}>Matière</th>
            <td>{eventAttributes.aa}</td>
          </tr> : <></>}
          {eventAttributes.lieux ? <tr>
            <th scope={'row'}>Locaux</th>
            <td>{eventAttributes.lieux}</td>
          </tr> : <></>}
          {eventAttributes.profs ? <tr>
            <th scope={'row'}>Professeurs</th>
            <td>{eventAttributes.profs}</td>
          </tr> : <></>}
          {eventAttributes.groupes ? <tr>
            <th scope={'row'}>Groupes</th>
            <td>{eventAttributes.groupes}</td>
          </tr> : <></>}
          {eventAttributes.type ? <tr>
            <th scope={'row'}>Type</th>
            <td>{eventAttributes.type}</td>
          </tr> : <></>}
        </table>
      </div>
    </div>
  )
}

export default CalDescription
