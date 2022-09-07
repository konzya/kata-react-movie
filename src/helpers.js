export function cutOverview(desc, height, width, lineHeight, charWidth) {
  const chars = Math.floor(height / lineHeight) * Math.floor(width / charWidth)
  if (desc.length < chars) return desc
  const arrOfWords = desc.split(' ')
  let threeDots = false
  return arrOfWords.reduce((acc, word, i) => {
    if (threeDots) return acc
    if (acc.length + word.length + 4 >= chars) {
      threeDots = true
      if (i === 0) return acc
      return `${acc} ...`
    }
    if (i === 0) return word
    return `${acc} ${word}`
  }, '')
}

export function decideRatingColor(rating) {
  if (rating <= 3) return '#E90000'
  if (rating <= 5) return '#E97E00'
  if (rating <= 7) return '#E9D100'
  return '#66E900'
}
