const fakeDiff = require('./')

const file1 = `[1,2,3].map(item => item*2);
// Prefixes
const PREFIX_ADD = '+  '
const PREFIX_REMOVE = '-  '

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

const replaceLine = part => item => {
  const { added, removed } = part
  if (added) return PREFIX_ADD + item
  else if (removed) return PREFIX_REMOVE + item
}
`
const file2 = `[1,2,3].map(function(item) {
  return item * 2
});
// Prefixes
const PREFIX_ADD = '+  '
const PREFIX_REMOVE = '-  '
const PREFIX_STATIC = '   '
const PREFIX_MORE = '@@ '

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

// Apply prefixes
const replaceLine = ({ added, removed }) => item => {
  if (added) return PREFIX_ADD + item
  else if (removed) return PREFIX_REMOVE + item
  else return PREFIX_STATIC + item
}`

console.log(fakeDiff(file1, file2))
