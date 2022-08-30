export default function decideRatingColor(rating) {
  if (rating <= 3) return '#E90000'
  if (rating <= 5) return '#E97E00'
  if (rating <= 7) return '#E9D100'
  return '#66E900'
}
