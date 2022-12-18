import moment from "moment";
import React, { useState } from "react";
import "./ContactFormStyle.scss";
import { intialState, IUserContact, UserContact } from "../../types/fieldNames";
import * as yup from "yup";

interface IProps {
  updateContact: any;
  userContact?: IUserContact
}
const ContactForm = ({ updateContact , userContact = intialState }: IProps) => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const userInfoValidator = yup.object({
    name: yup.string().required("Name is Required"),
    stayerAddress: yup.string().required("Address is Required"),
    mobile: yup
      .string()
      .required("number is required")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Phone number is not valid")
      .max(10, "Phone number is not valid"),
    addressProof: yup.string().required("address proof is required"),
    dateOfArrival: yup.string().required("arrival date is required"),
    durationOfStay: yup
      .number()
      .min(1, "validate date of arrival and date of vacate")
  });

  const [contactDetails, setContactDetails] = useState(userContact);

  const initialError = {
    name: "",
    stayerAddress: "",
    mobile: "",
    dateOfArrival: "",
    comingForm: "",
    proffessionalAddress: "",
    proffessionalName: "",
    visitPurpose: "",
    addressProof: "",
    durationOfStay: ""
  };

  const [formErrors, setFormErrors] = useState(initialError);

  const postFormData = async (event: any) => {
    event?.preventDefault();
    userInfoValidator
      .validate(contactDetails, { abortEarly: false })
      .then(async (responseData) => {
        updateContact(contactDetails);
      })
      .catch((err) => {
        const errorInner = JSON.parse(JSON.stringify(err))?.inner;
        errorInner.forEach((value: any) => {
          //@ts-ignore
          if (formErrors[value?.path] !== undefined) {
            //@ts-ignore
            formErrors[value.path] = value.errors[0];
          }
        });
        setFormErrors({ ...formErrors });
      });
  };

  const onChangeText = (event: any) => {
    const textValue = event.target.value;
    setFormErrors(initialError);
    setContactDetails({ ...contactDetails, [event.target.name]: textValue });
  };

  const onChangeDate = (event: any) => {
    const newDate = moment(new Date(event.target.value)).format("DD-MM-YYYY");
    setFormErrors(initialError);
    setContactDetails({ ...contactDetails, [event.target.name]: newDate });
  };

  const onChangeFile = (event: any) => {
    let changedFile = event.target.files[0];
    setFormErrors(initialError);
    setContactDetails({ ...contactDetails, [event.target.name]: changedFile });
  };

  const requiredField = () => <span style={{ color: "red" }}> *</span>;

  const renderErrorTag = (errorFromValue: string) => (
    <div className="error-text-color">{errorFromValue}</div>
  );

  const onChangeVacate = (event: any) => {
    if (contactDetails.dateOfVacate && contactDetails.dateOfArrival) {
      const dateOfVacate = moment(contactDetails.dateOfVacate, "DD/MM/YYYY");
      const dateOfArrival = moment(contactDetails.dateOfArrival, "DD/MM/YYYY");
      const noOfDays = dateOfVacate.diff(dateOfArrival, "days");
      if (noOfDays > 0) {
        setContactDetails({ ...contactDetails, durationOfStay: noOfDays });
      }
    }
  };

  return (
    <div>
      <form
        className="contact-form"
        onSubmit={(event) => {
          postFormData(event);
        }}
      >
        <div className="contact-field">
          <label>Name {requiredField()}</label>
          <input
            type="text"
            onChange={onChangeText}
            name={UserContact.name}
            id={UserContact.name}
          />
          {renderErrorTag(formErrors?.name)}
        </div>

        <div className="contact-field ">
          <label>Premenant Address {requiredField()}</label>
          <textarea
            className="field-textarea"
            name={UserContact.stayerAddress}
            id={UserContact.stayerAddress}
            rows={4}
            cols={50}
            onChange={onChangeText}
          />
          {renderErrorTag(formErrors?.stayerAddress)}
        </div>

        <div className="contact-field">
          <label>Address Proof {requiredField()}</label>
          <input
            type="file"
            name={UserContact.addressProof}
            onChange={onChangeFile}
            id={UserContact.addressProof}
          />
          {renderErrorTag(formErrors?.addressProof)}
        </div>

        <div className="contact-field">
          <label>Mobile {requiredField()}</label>
          <input
            type="number"
            id={UserContact.mobile}
            name={UserContact.mobile}
            onChange={onChangeText}
            minLength={10}
            maxLength={10}
          />
          {renderErrorTag(formErrors?.mobile)}
        </div>

        <div className="contact-field">
          <label>Coming From</label>
          <input
            type="text"
            name={UserContact.comingForm}
            id={UserContact.comingForm}
            onChange={onChangeText}
          />
        </div>

        <div className="contact-field">
          <label>Purpose of visit</label>
          <select
            name={UserContact.visitPurpose}
            id={UserContact.visitPurpose}
            onChange={onChangeText}
          >
            <option value="student">student</option>
            <option value="working"> working</option>
          </select>
        </div>

        <div className="contact-field">
          <label>
            {contactDetails.visitPurpose === "student"
              ? "College Name"
              : "Office Name"}
          </label>
          <input
            type="text"
            name={UserContact.proffessionalName}
            id={UserContact.proffessionalName}
            onChange={onChangeText}
          />
        </div>

        <div className="contact-field">
          <label>
            {contactDetails.visitPurpose === "student"
              ? "College Address"
              : "Office Address"}
          </label>
          <textarea
            className="field-textarea"
            name={UserContact.proffessionalAddress}
            id={UserContact.proffessionalAddress}
            rows={4}
            cols={50}
            onChange={onChangeText}
          />
        </div>

        <div className="contact-field">
          <label>Date of Arrival</label>
          <input
            type="date"
            name={UserContact.dateOfArrival}
            id={UserContact.dateOfArrival}
            onChange={onChangeDate}
          />
          {renderErrorTag(formErrors?.dateOfArrival)}
        </div>

        <div className="contact-field">
          <label>Date of Vacate</label>
          <input
            type="date"
            name={UserContact.dateOfVacate}
            onChange={onChangeDate}
            onBlur={(event) => onChangeVacate(event)}
            onMouseLeave={(event) => onChangeVacate(event)}
          />
        </div>

        <div className="contact-field">
          <label>Duration Of Stay</label>
          <input type="text" value={contactDetails.durationOfStay} disabled />
          {renderErrorTag(formErrors?.durationOfStay)}
        </div>

        <div className="form-submit">
          <button className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
