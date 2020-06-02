export function emailValidation(value) {
  if (!value || value.trim() === '') {
    throw new Error('Email is required')
  }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!re.test(String(value).toLowerCase())) {
    throw new Error('Please enter valid email')
  }
}
