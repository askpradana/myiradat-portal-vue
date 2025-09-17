// Helper function for date formatting
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export const formatLastUpdated = (date: string): string => {
  const lastUpdated = date
  if (!lastUpdated) return 'Never'

  try {
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`

    return date.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
    })
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return 'Unknown'
  }
}
