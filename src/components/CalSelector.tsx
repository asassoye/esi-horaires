import { calCategory, calendarJson, calItem } from './App'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import Select, { SelectItem } from './Select'

interface CalSelectorProps {
  items: calendarJson,
  category?: calCategory,
  setCategory: Dispatch<SetStateAction<calCategory | undefined>>
  selected?: calItem,
  setSelected: Dispatch<SetStateAction<calItem | undefined>>
}

const CalSelector = (props: CalSelectorProps): JSX.Element => {
  const {
    items,
    category,
    setCategory,
    selected,
    setSelected
  } = props

  const categorySelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const newCat = items.find(element => element.key == value)

    setCategory(newCat as calCategory)
    setSelected(undefined)
  }

  const calSelectionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    const newCal = category?.items.find(element => element.key == value)
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
                {category ? <div className="col-md-3 mb-md-0">
                  <Select name={'Ressource'} selected={selected as SelectItem}
                          selectionHandler={calSelectionHandler}
                          items={category.items}/>
                </div> : <></>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CalSelector
