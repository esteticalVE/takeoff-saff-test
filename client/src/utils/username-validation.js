export function usernameValidation(value) {
  if (!value || value.trim() === '') {
    throw new Error('Username is required')
  }

  if (value.length > 25) {
    throw new Error('Username must be less than 25 characters')
  }
}
