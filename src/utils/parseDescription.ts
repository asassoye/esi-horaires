interface EventAttributes {
  aa?: string,
  groupes?: string,
  profs?: string,
  profacro?: string,
  lieux?: string,
  type?: string
}

const parseDesc = (description: string) => {
  let obj: EventAttributes = {}
  // chaque ligne de /description/ est de la forme: "truc : valeur"

  if (!description) return obj

  for (let item of description.split('\n')) {
    let [key, value] = item.split(' : ')
    if (!value) continue

    switch (key) {
      case 'Matière':
        obj.aa = value
        break
      case 'TD':
        obj.groupes = value.split(', ')[0]
        break
      case 'Enseignant':
      case 'Enseignants':
        key = 'profs'
        if (value.match(/^[A-Z][A-Z][A-Z]\b/)) // récupérer l'acronyme du prof
        {
          obj.profacro = value.slice(0, 3)
        }
        obj.profs = value.split(', ')[0]
        break
      case 'Salle':
      case 'Salles':
        obj.lieux = value.split(', ')[0]
        break
      case 'Type':
        obj.type = 'type'
        break
      default:
    }
  }
  return obj
}

export { EventAttributes }
export default parseDesc
