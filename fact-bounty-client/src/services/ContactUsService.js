import ApiBuilder from '../helpers/ApiBuilder'

/**
 *
 * POST : contactUsSubmit
 *
 */
const contactUsSubmit = (name, email, phone, subject, message) => {
  return ApiBuilder.API.post(`api/utils/contact_us`, {
    name,
    email,
    phone,
    subject,
    message
  })
}

export default {
  contactUsSubmit
}
