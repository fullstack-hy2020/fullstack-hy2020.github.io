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
const GOOGLE_FORM_QUESTION_ID = 'entry.1721353614';

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
      whereDidYouFind: '',
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
      whereDidYouFind,
    } = this.state;

    const formData = new FormData();
    formData.append(GOOGLE_FORM_NAME_ID, name);
    formData.append(GOOGLE_FORM_TITLE_ID, title);
    formData.append(GOOGLE_FORM_ORGANIZATION_ID, organization);
    formData.append(GOOGLE_FORM_PHONE_ID, phone);
    formData.append(GOOGLE_FORM_EMAIL_ID, email);
    formData.append(GOOGLE_FORM_QUESTION_ID, whereDidYouFind);

    axios
      .post(PROXY_URL + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.setState({
          name: '',
          title: '',
          organization: '',
          phone: '',
          email: '',
          whereDidYouFind: '',
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
      whereDidYouFind,
    } = this.state;

    return (
      <>
        {!formIsSent ? (
          <form onSubmit={this.handleSubmit} className="form col-10">
            <p className="spacing--small">Name</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Nimi"
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Title</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Titteli"
              type="text"
              name="title"
              value={title}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Organization</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Yritys"
              type="text"
              name="organization"
              value={organization}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Phone</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Puhelinnumero"
              type="text"
              name="phone"
              value={phone}
              onChange={this.handleChange}
            />
            <p className="spacing--small">Email</p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Sähköpostiosoite"
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <p className="spacing--small">
              Where did you get the information about the full stack challenge?
            </p>
            <input
              required
              autoComplete="off"
              className="col-10"
              placeholder="Mistä sait tiedon Full Stack haasteesta"
              type="text"
              name="whereDidYouFind"
              value={whereDidYouFind}
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
