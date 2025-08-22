export const getInitialName = (name: string): string => {
  const w = name.trim().split(/\s+/)

  const initials = w.map((word) => word[0]?.toUpperCase() ?? '')
  return initials.slice(0, 2).join('')
}
