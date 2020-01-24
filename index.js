const jsdiff = require('diff')
const chalk = require('chalk')
const log = value => (result += value + '\n')
const logMulti = (lines, color) => lines.forEach(line => log(color(line)))

let result

const defaultOptions = {
  hideLines: true,
  maxAdjacentStaticLines: 2
}

// Prefixes
const PREFIX_ADD = '+  '
const PREFIX_REMOVE = '-  '
const PREFIX_STATIC = '   '
const PREFIX_MORE = '@@ '

// Apply prefixes
const replaceLine = part => item => {
  const { added, removed } = part
  if (added) return PREFIX_ADD + item
  else if (removed) return PREFIX_REMOVE + item
  else return PREFIX_STATIC + item
}

// If necessary, shorten the lines
const logStaticPart = (part, options) => {
  const { lines, count } = part
  const { maxAdjacentStaticLines } = options
  if (count > maxAdjacentStaticLines && count - 2 * maxAdjacentStaticLines > 1) {
    log(chalk.gray(lines.slice(0, maxAdjacentStaticLines).join('\n')))
    log(chalk.blue(PREFIX_MORE + (count - 2 * maxAdjacentStaticLines) + ' more lines'))
    log(chalk.gray(lines.slice(-maxAdjacentStaticLines).join('\n')))
  } else {
    logMulti(lines, chalk.gray)
  }
}

const fakeDiff = (previous, next, options) => {
  // Apply overrides
  options = { ...defaultOptions, ...options }

  result = ''

  // Diff
  const diff = jsdiff.diffLines(previous + '\n', next + '\n')

  // Split multiple lines
  const newDiff = diff.map(part => {
    const { added, removed, value, count } = part
    const lines = value
      .split('\n')
      .slice(0, -1)
      .map(replaceLine(part))
    return { added, removed, lines, count }
  })

  // Finally do the logging
  newDiff.forEach(part => {
    const { lines, added, removed } = part
    if (!options.hideLines || added || removed) {
      if (added) logMulti(lines, chalk.green)
      else if (removed) logMulti(lines, chalk.red)
      else logMulti(lines, chalk.gray)
    } else {
      logStaticPart(part, options)
    }
  })

  return result.substring(0, result.length - 1)
}

module.exports = fakeDiff
