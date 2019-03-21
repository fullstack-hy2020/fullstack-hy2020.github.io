import './Form.scss';

import React, { Component } from 'react';

import { BodyText } from '../BodyText/BodyText';
import axios from 'axios';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeBDG4e55ml96b5TJriFznAcpF8mV38RoEI5mQjqvBoDMn-IQ/formResponse';
const GOOGLE_FORM_NAME_ID = 'entry.1531562037';
const GOOGLE_FORM_TITLE_ID = 'entry.659646544';
const GOOGLE_FORM_ORGANIZATION_ID = 'entry.1144701613';
const GOOGLE_FORM_PHONE_ID = 'entry.658079226';
const GOOGLE_FORM_EMAIL_ID = 'entry.1005441181';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formIsSent: false,
      name: '',
      title: '',
      organization: '',
      phone: '',
      email: '',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    this.sendMessage();
  };

  handleChange = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  sendMessage = () => {
    const {
      name,
      title,
      organization,
      phone,
      email,
    } = this.state;

    const formData = new FormData();
    formData.append(GOOGLE_FORM_NAME_ID, name);
    formData.append(GOOGLE_FORM_TITLE_ID, title);
    formData.append(GOOGLE_FORM_ORGANIZATION_ID, organization);
    formData.append(GOOGLE_FORM_PHONE_ID, phone);
    formData.append(GOOGLE_FORM_EMAIL_ID, email);

    axios
      .post(PROXY_URL + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.setState({
          name: '',
          title: '',
          organization: '',
          phone: '',
          email: '',
          formIsSent: true,
        });
      })
      .catch(() => {
        this.setState({
          messageError: true,
        });
      });
  };

  render() {
    const {
      formIsSent,
      name,
      title,
      organization,
      phone,
      email,
    } = this.state;

    return (
      <>
        {!formIsSent ? (
          <form onSubmit={this.handleSubmit} className="form col-10">
            <p className="spacing--small">Nimi</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Matti Meikäläinen"
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Titteli</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="CEO"
              type="text"
              name="title"
              value={title}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Yritys</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Yritys Oy"
              type="text"
              name="organization"
              value={organization}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Puhelinnumero</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="+358 40 234 5678"
              type="text"
              name="phone"
              value={phone}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Sähköpostiosoite</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="email@domain.com"
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <button
              className="submit spacing spacing--after push-right-4"
              type="submit"
            >
              Lähetä
            </button>
          </form>
        ) : (
          <BodyText
            className="spacing"
            headingFont
            text={['Kiitos lomakkeen lähettämisestä! Palaamme asiaan pian.']}
          />
        )}
      </>
    );
  }
}

export default Form;
