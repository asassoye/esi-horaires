import { calItem } from './App'
import { useState } from 'react'

interface CalLinkProps {
  selected?: calItem
}

const CalLink = (props: CalLinkProps): JSX.Element => {
  const { selected } = props

  if (selected) {
    const url: string = `${location.host}/${selected?.calendar}`
    const gogoleUrl: string = `www.google.com/calendar/render?cid=webcal://${url}`
    const [copied, setCopied] = useState(false)

    const copyHandler = async () => {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    }

    return (<div className={'mt-2'}>
      <label>Lien vers le calendrier</label>
      <div className="input-group">
        <input className="form-control" value={`https://${url}`} id="ical"
               readOnly/>
        <button id="icalbutton" className="btn btn-dark ml-1"
                aria-label="Copier le lien" onClick={copyHandler}>
          <i className="fa fa-clipboard fa-fw" aria-hidden="true"/>
          Copier le lien
        </button>
        <a id="addToCalendar" className="btn btn-dark ml-1"
           href={`//${gogoleUrl}`}
           target="_blank" aria-label="Ajouter au calendrier">
          <i className="fa fa-google fa-fw" aria-hidden="true"/> Ajouter au
          calendrier
        </a>

        {copied
          ? <div className="valid-feedback d-block">Le lien a été copié vers
            votre
            presse-papier avec success.
          </div>
          : <></>
        }

      </div>
    </div>)
  }

  return <></>
}

export default CalLink
