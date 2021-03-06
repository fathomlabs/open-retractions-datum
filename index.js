const equal = require('deep-equal')
const uniqby = require('lodash.uniqby')

const uniqify = (a, b) => uniqby(a.concat(b), equal)

const check = data => {
  if (!data.identifier || Object.keys(data.identifier).length === 0) {
    throw new Error('data must have at least one identifier')
  }
  if (!data.updates || data.updates.length === 0) {
    throw new Error('data must have at least one update')
  }
}

const merge = (a, b) => {
  if (a.identifier.doi !== b.identifier.doi) {
    throw new Error(
      'Cannot merge: DOIs of retraction records do not match (' +
      a.identifier.doi +
      ', ' +
      b.identifier.doi +
      ')'
    )
  }

  return {
    retracted: a.retracted || b.retracted,
    timestamp: Math.max(a.timestamp, b.timestamp),
    updates: uniqify(a.updates, b.updates),
    identifier: Object.assign({}, a.identifier, b.identifier),
    publisher: a.publisher || b.publisher,
    title: a.title || b.title
  }
}

module.exports = {
  check: check,
  merge: merge,
  crossref: require('crossref-to-retraction')
}
