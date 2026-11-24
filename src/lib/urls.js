export const safeUrl = (url) => {
  if (typeof url !== 'string') return false
  return /^(https?:\/\/|mailto:|tel:|\.\.?\/|\/|#)/i.test(url.trim())
}

export const phoneHref = (phone) => {
  if (typeof phone !== 'string') return ''
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
