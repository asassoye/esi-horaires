import axios from 'axios'

interface calendarCategoryItem {
  key: string
  name: string,
  calendar: string
}

interface calendarCategoryItems {
  [key: string]: calendarCategoryItem
}

interface calendarCategory {
  key: string,
  name: string,
  items: calendarCategoryItems
}

interface calendarData {
  [key: string]: calendarCategory
}

interface calendarConfig {
  default?: string,
  data: calendarData
}

const fetchCalendars = async () => {
  return axios({
    method: 'get',
    url: `${location.origin}/config/calendars.json`,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache'
    }
  }).then(value => value.data)
}

export {
  calendarCategoryItem,
  calendarCategoryItems,
  calendarCategory,
  calendarData,
  calendarConfig
}

export default fetchCalendars
