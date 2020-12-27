import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './style.sass'
import { Button } from '@material-ui/core'
import { submitForm } from '../../redux/actions/contactUsActions'

class ContactUsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      email: null,
      phone: null,
      subject: 'User - Contact Us',
      message: null
    }
  }

  onSubmit = e => {
    e.preventDefault()
    setTimeout(() => {
      this.setState({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    }, 2000)

    const { submitForm } = this.props
    const { name, email, phone, subject, message } = this.state
    submitForm(name, email, phone, subject, message)
  }

  render() {
    const { loading } = this.props
    const { name, email, phone, message } = this.state
    return (
      <div className="contact-us-form-container">
        <h1>Contact Us</h1>
        <p>Feel free to contact us for any inquiries or feedback!</p>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="Name"
            placeholder="Name"
            required
            value={name}
            onChange={e => {
              this.setState({ name: e.target.value })
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => {
              this.setState({ email: e.target.value })
            }}
          />
          <input
            type="number"
            name="phone"
            value={phone}
            placeholder="Phone Number"
            onChange={e => {
              this.setState({ phone: e.target.value })
            }}
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            required
            value={message}
            onChange={e => {
              this.setState({ message: e.target.value })
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ width: 120, alignSelf: 'center', marginTop: 20 }}
            type="submit"
            loading={loading}
            disabled={loading}
          >
            SEND
          </Button>
        </form>
      </div>
    )
  }
}

ContactUsForm.propTypes = {
  loading: PropTypes.bool,
  submitForm: PropTypes.func
}

const mapStatetoProps = state => ({
  loading: state.contactUs.loading
})

const mapDispatchToProps = dispatch => ({
  submitForm: (name, email, phone, subject, message) =>
    dispatch(submitForm(name, email, phone, subject, message))
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(ContactUsForm)
