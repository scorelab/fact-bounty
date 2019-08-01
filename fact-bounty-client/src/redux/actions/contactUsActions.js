import {
  START_CONTACT_FORM_SUBMIT,
  CONTACT_FORM_SUBMIT_SUCCESS,
  CONTACT_FORM_SUBMIT_FAIL
} from './actionTypes'
import ContactUsService from '../../services/ContactUsService'

export const submitForm = (
  name,
  email,
  phone,
  subject,
  message
) => dispatch => {
  dispatch({ type: START_CONTACT_FORM_SUBMIT })
  ContactUsService.contactUsSubmit(name, email, phone, subject, message)
    .then(res => {
      console.log(res)
      dispatch({ type: CONTACT_FORM_SUBMIT_SUCCESS })
    })
    .catch(err => {
      dispatch({ type: CONTACT_FORM_SUBMIT_FAIL, payload: err })
      console.error('Server response invalid:', err)
    })
}
