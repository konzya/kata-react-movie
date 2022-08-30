export default function cutOverview(desc, height, width) {
  const chars = Math.floor(height / 22) * Math.floor(width / 7)
  if (desc.length < chars) return desc
  const arrOfWords = desc.split(' ')
  let threeDots = false
  return arrOfWords.reduce((acc, word, i) => {
    if (threeDots) return acc
    if (acc.length + word.length + 1 >= chars) {
      threeDots = true
      if (i === 0) return acc
      return `${acc} ...`
    }
    if (i === 0) return word
    return `${acc} ${word}`
  }, '')
}
