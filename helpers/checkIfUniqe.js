const checkIfUnique = arr => {
  return arr.length === new Set(arr).size
}

module.exports = checkIfUnique
