#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// TODO make this customizable
const personnel = require(path.resolve('./config/personnel.json'))

// TODO make this customizable
const icalDir = path.resolve('./ical/2021-2022/q1')

function getBaseNameWithoutExtension (fn) {
  return path.basename(fn, '.ics')
}

const rules = {
  cours: {
    name: 'Cours',
    extractKey: getBaseNameWithoutExtension,
    extractName: getBaseNameWithoutExtension
  },
  groupes: {
    name: 'Groupes',
    extractKey: getBaseNameWithoutExtension,
    extractName: getBaseNameWithoutExtension
  },
  profs: {
    name: 'Profs',
    extractKey (fn) {
      const basename = getBaseNameWithoutExtension(fn)
      return basename.split('_')[0]
    },
    extractName (fn) {
      const basename = getBaseNameWithoutExtension(fn)
      const acr = basename.split('_')[0]
      return personnel.find((elm) => elm.acronyme === acr).nom
    }
  },
  salles: {
    name: 'Salles',
    extractKey: getBaseNameWithoutExtension,
    extractName: getBaseNameWithoutExtension
  }
}

// record a key-value pair into bucket
// bucket is an object (v2), or an array (! v2)
function record (bucket, key, valueObject) {
  bucket[key] = { key, ...valueObject }
}

const config = {
  default: 'groupes',
  data: {}
}

for (const dir of fs.readdirSync(icalDir)) {
  const items = {}

  for (const file of fs.readdirSync(path.resolve(icalDir, dir))) {
    const key = rules[dir].extractKey(file)
    const name = rules[dir].extractName(file)
    const calendar = path.relative('.', path.resolve(icalDir, dir, file))

    record(items, key, {
      name,
      calendar
    })
  }

  record(config.data, dir, {
    name: rules[dir].name,
    items
  })
}

console.log(JSON.stringify(config))
