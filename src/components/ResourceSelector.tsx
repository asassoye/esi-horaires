import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import Select, { SelectItem } from './Select'
import {
  calendarCategory,
  calendarCategoryItem,
  calendarData
} from '../utils/fetchCalendars'

interface CalSelectorProps {
  items: calendarData,
  category?: calendarCategory,
  setCategory: Dispatch<SetStateAction<calendarCategory | undefined>>
  selected?: calendarCategoryItem,
  setSelected: Dispatch<SetStateAction<calendarCategoryItem | undefined>>
}

const ResourceSelector = (props: CalSelectorProps): JSX.Element => {
  const {
    items,
    category,
    setCategory,
    selected,
    setSelected
  } = props

  const categorySelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCat = items[e.target.value]

    setCategory(newCat as calendarCategory)
    setSelected(undefined)
  }

  const calSelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCal = category?.items[e.target.value]
    setSelected(newCal)
    history.pushState({
      category: category,
      ressource: newCal
    }, `Horaires ${newCal?.name}`,
      `/?type=${category?.key}&ressource=${newCal?.key}`)
  }

  return (
    <>
      <div className="accordion mb-3" id="calSelector">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
              <strong>
                {selected ? selected.name : 'Parcourir les horaires..'}
              </strong>
            </button>
          </h2>
          <div id="collapseOne"
               className={`accordion-collapse collapse ${!selected
                 ? 'show'
                 : ''}`}
               aria-labelledby="headingOne" data-bs-parent="#calSelector">
            <div className="accordion-body">
              <div className="row">
                <div className="col-md-3 mb-md-0">
                  <Select name={'Type'} selected={category as SelectItem}
                          selectionHandler={categorySelectionHandler}
                          items={items}/>
                </div>
                {category &&
                <div className="col-md-3 mb-md-0">
                  <Select
                    name={`Choisissez parmi les ${category.name.toLowerCase()}`}
                    selected={selected as SelectItem}
                    selectionHandler={calSelectionHandler}
                    items={category.items}/>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResourceSelector
