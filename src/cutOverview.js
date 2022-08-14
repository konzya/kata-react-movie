export default function cutOverview(desc) {
  if (desc.length < 216) return desc
  const arrOfWords = desc.split(' ')
  let threeDots = false
  return arrOfWords.reduce((acc, word, i) => {
    if (threeDots) return acc
    if (acc.length + word.length + 1 >= 216) {
      threeDots = true
      return `${acc} ...`
    }
    if (i === 0) return word
    return `${acc} ${word}`
  }, '')
}
