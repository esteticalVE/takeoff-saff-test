export function phoneValidation(value) {
  if (!value || value.trim() === '') {
    throw new Error('Phone is required')
  }

  const phoneNormalized = value.replace(/[^+\d]/g, '')

  if (!/^\+[\d]{11}$/.test(phoneNormalized)) {
    throw new Error('Phone must consist 11 digits')
  }
}
