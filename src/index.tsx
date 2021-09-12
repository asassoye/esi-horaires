import 'bootstrap'
import ReactDOM from 'react-dom'
import App from './components/App'
import fetchCalendars, { calendarConfig } from './utils/fetchCalendars'

(async () => {
  const data: calendarConfig = await fetchCalendars()

  ReactDOM.render(
    <App data={data?.data} default={data?.default}/>,
    document.getElementById('root')
  )
})()
