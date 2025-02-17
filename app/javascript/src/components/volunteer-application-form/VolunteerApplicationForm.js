import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

import './VolunteerApplicationForm.scss'

class VolunteerApplicationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attemptedSubmit: false,
      step: 0,
      volunteerApplication: {
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        state: '',
        zip: '',
        county: '',
        marketing_vector: '',
        why_volunteer: '',
        ok_to_text: null,
        ok_to_call: null,
        ok_to_mail: null,
        is_underage: null,
        university_location_id: null,
        graduation_year: null,
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    // this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePaginatePrevious = this.handlePaginatePrevious.bind(this);
    this.handlePaginateForward = this.handlePaginateForward.bind(this);
  }

  handleChange(event) {
    this.setState({ volunteerApplication: { ...this.state.volunteerApplication, [event.target.name]: event.target.value} });
  }

  handleRadioChange(event) {
    let updatedChoice = event.target.id.includes("true") ? true : false;
    this.setState({ volunteerApplication: { ...this.state.volunteerApplication, [event.target.name]: updatedChoice} });
  }

  handleSubmit(event) {
    this.setState({ attemptedSubmit: true })
    event.preventDefault();

    if (this.missingRequiredFields()) {
      console.log('Missing fields.')
      return;
    }

    const token = document.getElementsByName('csrf-token')[0].content;

    window.fetch(location.origin + '/volunteer_application', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
       'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      window.location.href = data.redirect_url;
    });
  }

  missingRequiredFields() {
    const {
      first_name,
      last_name,
      street_address,
      city,
      state,
      zip,
      county,
      marketing_vector,
      why_volunteer,
      ok_to_text,
      ok_to_call,
      ok_to_mail,
      is_underage,
    } = this.state.volunteerApplication;

    const requiredFields = [first_name, last_name, street_address, city, state, zip, county,
      marketing_vector, why_volunteer, ok_to_text, ok_to_call, ok_to_mail, is_underage];

    return requiredFields.includes(null) || requiredFields.includes('');
  }

  handlePaginatePrevious() {
    if (this.state.step > 0) {
      return this.setState({step: this.state.step - 1});
    }
  }

  handlePaginateForward() {
    if (this.state.step < 1) {
      return this.setState({step: this.state.step + 1});
    }
  }

  renderRequiredAlert() {
    return (
      <div className="row alert alert-danger required-field" role="alert">
        This field is required.
      </div>
    );
  }

  renderMissingFieldsAlert() {
    return (
      <div className="alert alert-danger required-fields-submit-alert" role="alert">
        Please fill out all the required fields.
      </div>
    );
  }

  renderTopSection() {
    const { volunteerApplication } = this.state;
    return (
      <div>
        <div className="row section-top section-label">Name*</div>
        { this.state.attemptedSubmit && (volunteerApplication.first_name == '' || volunteerApplication.last_name == '') ? this.renderRequiredAlert() : null }
        <div className="row">
          <div className="col-md">
            <input type="text" className="row form-control" name="first_name" value={volunteerApplication.first_name} onChange={this.handleChange} />
            <label className="row sub-text">First Name</label>
          </div>
          <div className="col-md">
            <input type="text" className="row form-control" name="last_name" value={volunteerApplication.last_name} onChange={this.handleChange} />
            <label className="row sub-text">Last Name</label>
          </div>
        </div>

        <div className="row section-top" >
          <label>How did you hear about us?*</label>
          <textarea type="text" className="form-control" name="marketing_vector" value={volunteerApplication.marketing_vector} onChange={this.handleChange} />
        </div>
        { this.state.attemptedSubmit && volunteerApplication.marketing_vector == '' ? this.renderRequiredAlert() : null }

        <div className="row section-top">
          <label>Why do you want to volunteer for Voices of Consent?*</label>
          <textarea type="text" className="form-control" name="why_volunteer" value={volunteerApplication.why_volunteer} onChange={this.handleChange} />
        </div>
        { this.state.attemptedSubmit && volunteerApplication.why_volunteer == '' ? this.renderRequiredAlert() : null }

        <label className="row section-top">What is is your age?*</label>
        { this.state.attemptedSubmit && volunteerApplication.is_underage == null ? this.renderRequiredAlert() : null }
        <div className="row">
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="is_underage_true" name="is_underage" className="custom-control-input" onChange={this.handleRadioChange} checked={volunteerApplication.is_underage} />
            <label className="custom-control-label radio-box" htmlFor="is_underage_true">0-12 years old</label>
          </div>
        </div>
        <div className="row">
          <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="is_underage_false" name="is_underage" className="custom-control-input" onChange={this.handleRadioChange} checked={volunteerApplication.is_underage === false}/>
            <label className="custom-control-label radio-box" htmlFor="is_underage_false">13+ years old</label>
          </div>
        </div>
      </div>
    );
  }

  renderFinalSection() {
    const { volunteerApplication } = this.state;
    return (
      <div>
        <div className="row section-top section-label">Address*</div>
        { this.state.attemptedSubmit && (volunteerApplication.street_address === '' || volunteerApplication.city === '' || volunteerApplication.state === '' || volunteerApplication.zip === '') ? this.renderRequiredAlert() : null }
        <div className="row sub-text">
          <input type="text" className="form-control" name="street_address" value={volunteerApplication.street_address} onChange={this.handleChange} />
          <label>Address 1</label>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="row sub-text">
              <input type="text" className="form-control" name="city" value={volunteerApplication.city} onChange={this.handleChange} />
            </div>
            <label><div className="row sub-text">City</div></label>
          </div>
          <div className="col-3">
            <div className="row sub-text">
              <input type="text" className="form-control" name="state" value={volunteerApplication.state} onChange={this.handleChange} />
            </div>
            <label><div className="row sub-text">State</div></label>
          </div>
        </div>
        <div className="row">
          <div className="col-md">
            <div className="row">
              <input type="text" className="form-control" name="zip" value={volunteerApplication.zip} onChange={this.handleChange} />
            </div>
            <label><div className="row sub-text">Zip Code</div></label>
          </div>
          <div className="col-md">
            <div className="row">
              <input type="text" className="form-control" name="county" value={volunteerApplication.county} onChange={this.handleChange} />
            </div>
            <label><div className="row sub-text">County</div></label>
          </div>
        </div>
        <div className="row">
          <label className="following-question">Okay to mail?*</label>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ok_to_mail" id="ok_to_mail_true" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_mail} />
            <label className="form-check-label" htmlFor="ok_to_mail">Yes</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="ok_to_mail" id="ok_to_mail_false" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_mail === false} />
            <label className="form-check-label" htmlFor="ok_to_mail_false">No</label>
          </div>
        </div>
        { this.state.attemptedSubmit && volunteerApplication.ok_to_mail == null ? this.renderRequiredAlert() : null }

        <div className="row section-top">
          <label className="section-label">Phone</label>
          <input type="text" className="form-control" name="phone" value={volunteerApplication.phone} onChange={this.handleChange} />
          <div className="col-6">
            <div className="row">
              <label className="following-question">Okay to call?*</label>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="ok_to_call" id="ok_to_call_true" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_call}/>
                <label className="form-check-label" htmlFor="ok_to_call">Yes</label>
              </div>

              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="ok_to_call" id="ok_to_call_false" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_call === false}/>
                <label className="form-check-label" htmlFor="ok_to_call_false">No</label>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row">
              <label className="following-question">Okay to text?*</label>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="ok_to_text" id="ok_to_text_true" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_text} />
                <label className="form-check-label" htmlFor="ok_to_text_true">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="ok_to_text" id="ok_to_text_false" onChange={this.handleRadioChange} checked={volunteerApplication.ok_to_text === false} />
                <label className="form-check-label" htmlFor="ok_to_text_false">No</label>
              </div>
            </div>
          </div>
        </div>
        { this.state.attemptedSubmit && volunteerApplication.phone != '' && (volunteerApplication.ok_to_text == null || volunteerApplication.ok_to_call == null) ? this.renderRequiredAlert() : null }

        <div className="row section-top section-label">University Information</div>
        <div className="row">
          <div className="col-md">
            <input type="integer" className="row form-control" name="university_location_id" value={volunteerApplication.university_location_id} onChange={this.handleChange} />
            <label className="row sub-text">University Location ID</label>
          </div>
          <div className="col-md">
            <input type="integer" className="row form-control" name="graduation_year" value={volunteerApplication.graduation_year} onChange={this.handleChange} />
            <label className="row sub-text">Graduation Year</label>
          </div>
        </div>
      </div>
    );
  }

  renderProgressBar() {
    const { first_name, last_name, street_address, city, state, zip, county, marketing_vector,
      why_volunteer, ok_to_text, ok_to_call, ok_to_mail, is_underage } = this.state.volunteerApplication;

    const completedFields = [first_name, last_name, street_address, city, state, zip, county, marketing_vector,
      why_volunteer, ok_to_text, ok_to_call, ok_to_mail, is_underage].filter(n => n === false || n);

    const percentageComplete = parseInt(completedFields.length / 13 * 100);

    return (
      <Progress percent={percentageComplete}  />
    );
  }

  renderPaginationAndProgressBar() {
    const currentStep = this.state.step;
    return (
      <div>
        <nav className="form-pagination row">
          <ul className="pagination">
            <li className={currentStep == 0 ? "page-item disabled" : "page-item"} onClick={this.handlePaginatePrevious}>
              <span className="page-link">Previous</span>
            </li>
            <li className={currentStep == 0 ? "page-item active" : "page-item"} onClick={() => this.setState({step: 0})}><a className="page-link">1</a></li>
            <li className={currentStep == 1 ? "page-item active" : "page-item"} onClick={() => this.setState({step: 1})}><a className="page-link">2 </a></li>
            <li className={currentStep == 1 ? "page-item disabled" : "page-item"} onClick={this.handlePaginateForward}>
              <span className="page-link">Next</span>
            </li>
          </ul>
        </nav>
      { this.renderProgressBar() }
      </div>
    );
  }

  render() {
    const { volunteerApplication } = this.state;

    return (
      <div className="outreach-form-container">
        <div className="form-info">
          If you are interested in volunteering for Voices of Consent, please fill out the form below.
        </div>
        <form onSubmit={this.handleSubmit} style={{'borderTop': '2px dotted gray'}}>
          { this.state.step === 0 && this.renderTopSection() }
          { this.state.step === 1 && this.renderFinalSection() }
          { this.renderPaginationAndProgressBar() }
          { this.state.attemptedSubmit && this.missingRequiredFields() ? this.renderMissingFieldsAlert() : null }
          <input type="submit" value="SUBMIT APPLICATION" className={this.missingRequiredFields() ? "gray-submit" : null}/>
        </form>
      </div>
    );
  }
}

export default VolunteerApplicationForm;
