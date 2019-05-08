const checkIfUnique = arr => {
  return arr.length === new Set(arr).length
}

module.exports = checkIfUnique
