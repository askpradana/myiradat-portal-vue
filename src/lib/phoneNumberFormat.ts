const MAX_PHONE_LENGTH = 13

export const formatPhoneNumber = (phone: string): string => {
  const str = String(phone)
  let formatted

  if (str.startsWith('+')) {
    if (str.length < 3) {
      formatted = '0'
    } else {
      formatted = '0' + str.substring(3)
    }
  } else {
    formatted = str.startsWith('0') ? str : '0' + str
  }

  if (formatted.length > MAX_PHONE_LENGTH) {
    formatted = formatted.substring(0, MAX_PHONE_LENGTH)
  }

  return formatted
}
