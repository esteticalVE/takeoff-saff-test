export function passwordValidation(value) {
  if (!value || value.trim() === '') {
    throw new Error('Password is required')
  }

  if (value.length > 15) {
    throw new Error('Password must consist less than 15 characters')
  }
}
