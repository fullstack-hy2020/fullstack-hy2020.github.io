import './Form.scss';

import React, { Component } from 'react';

import { BodyText } from '../BodyText/BodyText';
import Element from '../Element/Element';
import axios from 'axios';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeO9jt4-iUsiFaLT5Rpwt47sNceu25te2UO7WGQ2wcUNTbBiQ/formResponse';
const GOOGLE_FORM_NAME_ID = 'entry.1118152809';
const GOOGLE_FORM_TITLE_ID = 'entry.2015280305';
const GOOGLE_FORM_ORGANIZATION_ID = 'entry.578868795';
const GOOGLE_FORM_PHONE_ID = 'entry.1958784460';
const GOOGLE_FORM_EMAIL_ID = 'entry.2042435833';
const GOOGLE_FORM_QUESTION_ID = 'entry.1350466445';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      formIsSent: false,
      name: '',
      title: '',
      organization: '',
      phone: '',
      email: '',
      question: '',
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
    const { name, title, organization, phone, email, question } = this.state;

    const formData = new FormData();
    formData.append(GOOGLE_FORM_NAME_ID, name);
    formData.append(GOOGLE_FORM_TITLE_ID, title);
    formData.append(GOOGLE_FORM_ORGANIZATION_ID, organization);
    formData.append(GOOGLE_FORM_PHONE_ID, phone);
    formData.append(GOOGLE_FORM_EMAIL_ID, email);
    formData.append(GOOGLE_FORM_QUESTION_ID, question);

    axios
      .post(PROXY_URL + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.setState({
          name: '',
          title: '',
          organization: '',
          phone: '',
          email: '',
          question: '',
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
      showForm,
      formIsSent,
      name,
      title,
      organization,
      phone,
      email,
      question,
    } = this.state;

    const { lang } = this.props;

    return <>
        {showForm ? <>
            {!formIsSent ? <form onSubmit={this.handleSubmit} className="form col-10">
                <p className="spacing--small">
                  {lang === 'fi' ? 'Nimi' : lang === 'zh' ? '姓名' : 'Name'}
                  <span aria-hidden="true">*</span>
                </p>
                <input required autoComplete="off" className="col-10" placeholder={lang === 'fi' ? 'Matti Meikäläinen' : lang === 'zh' ? '小明' : 'Jane Doe'} type="text" name="name" value={name} onChange={this.handleChange} />
                <p className="spacing--small">
                  {lang === 'fi' ? 'Titteli' :lang === 'zh' ? '职位' : 'Title'}
                  <span aria-hidden="true">*</span>
                </p>
                <input required autoComplete="off" className="col-10" placeholder="CEO" type="text" name="title" value={title} onChange={this.handleChange} />
                <p className="spacing--small">
                  {lang === 'fi' ? 'Yritys' :lang === 'zh' ? '公司名称' : 'Company'}
                  <span aria-hidden="true">*</span>
                </p>
                <input required autoComplete="off" className="col-10" placeholder={lang === 'fi' ? 'Yritys Oy' : lang === 'fi' ? 'Yritys Oy' : '股份有限公司'} type="text" name="organization" value={organization} onChange={this.handleChange} />
                <p className="spacing--small">
                  {lang === 'fi' ? 'Puhelinnumero' : lang === 'zh' ? '电话' : 'Phone'}
                  <span aria-hidden="true">*</span>
                </p>
                <input autoComplete="off" className="col-10" placeholder="+358 40 234 5678" type="text" name="phone" value={phone} onChange={this.handleChange} />
                <p className="spacing--small">
                  {lang === 'fi' ? 'Sähköpostiosoite' :lang === 'zh' ? '电子邮箱' : 'email address'}
                  <span aria-hidden="true">*</span>
                </p>
                <input required autoComplete="off" className="col-10" placeholder="email@domain.com" type="email" name="email" value={email} onChange={this.handleChange} />
                <p className="spacing--small">
                  {lang === 'fi'
                    ? 'Mistä kuulit Full Stack -haasteesta?'
                    :lang === 'zh'
                    ? '您从哪里听说的本次挑战'
                    : 'Where did you hear from the challenge'}
                </p>
                <input autoComplete="off" className="col-10" type="text" name="question" value={question} onChange={this.handleChange} />
                <button className="submit spacing spacing--after push-right-4" type="submit">
                  {lang === 'fi' ? 'Lähetä' :lang === 'zh' ? '提交' : 'Submit'}
                </button>
              </form> : <BodyText className="spacing" headingFont text={[lang === 'fi' ? 'Kiitos! Otamme sinuun yhteyttä!' : lang === 'zh' ? '谢谢，我们会尽快联系您' :'Thanks! We will contact you soon!']} />}
          </> : <>
            <Element flex spaceAround className="col-10 spacing">
              <button className="about__challenge-button about__challenge-button--turquoise" onClick={() => this.setState(
                    { showForm: true }
                  )}>
                {lang === 'fi' ? 'Ilmoita yrityksesi mukaan haasteeseen!' : lang === 'zh' ? '将您的公司注册到全栈挑战中' : 'Register your company to Full stack challenge'}
              </button>
            </Element>
          </>}
      </>;
  }
}

export default Form;
