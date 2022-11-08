import moment from 'moment'
import React, { useState } from 'react'
import './ContactFormStyle.scss'
import { db, storage } from '../../firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { DBCollection } from '../../types/dbCollection'
import { UserContact } from '../../types/fieldNames'

const ContactForm = () => {
  const navigate = useNavigate()

 

  const intialState: IUserContact = {
    name: '',
    stayerAddress: '',
    mobile: 0,
    dateOfArrival: new Date(),
    comingForm: '',
    proffessionalAddress: '',
    proffessionalName: '',
    visitPurpose: 'student',
    addressProof: '',
    durationOfStay: 0,
  }

  interface IUserContact {
    name: string;
    stayerAddress: string;
    mobile: number;
    dateOfArrival: Date;
    comingForm: string;
    proffessionalAddress: string;
    visitPurpose: string;
    addressProof: string;
    durationOfStay: number;
    proffessionalName: string;
  }

  const [contactDetails, setContactDetails] = useState(intialState)
  const [loader, setLoader] = useState(false)

  const postFormData = async (event: any) => {
    event?.preventDefault()
    setLoader(true)
    try {
      const uploadedImageURL = await uploadImage()
      const appendContactData = {
        ...contactDetails,
        [UserContact.addressProof]: uploadedImageURL
      }
      await db.collection(DBCollection.UserInfo).add({ ...appendContactData , status: 'requested' })
      alert('record got saved successfully');
      navigate('/contact');
      setContactDetails({ ...intialState });
    } catch (exception) {
      alert('error' + exception);
    } finally {
      setLoader(false);
    }
  }

  const onChangeText = (event: any) => {
    const textValue = event.target.value
    setContactDetails({ ...contactDetails, [event.target.name]: textValue })
  }

  const onChangeDate = (event: any) => {
    const newDate = moment(new Date(event.target.value)).format('DD-MM-YYYY')
    setContactDetails({ ...contactDetails, [event.target.name]: newDate })
  }

  const onChangeFile = (event: any) => {
    let changedFile = event.target.files[0]
    setContactDetails({ ...contactDetails, [event.target.name]: changedFile })
  }

  const uploadImage = async () => {
    if (contactDetails?.addressProof === '') return
    const fileLocalState = contactDetails?.addressProof as any
    const addressProofRef = ref(
      storage,
      `images/${contactDetails.name + `/${fileLocalState.name + moment.now()}`}`
    )

    try {
      const uploadedFile = await uploadBytes(addressProofRef, fileLocalState)
      return await getDownloadURL(uploadedFile?.ref)
    } catch (exception) {
      return ''
    }
  }

  return (
    <div>
      {loader ? (
        <div className='loader'></div>
      ) : (
        <form
          className='contact-form'
          onSubmit={event => {
            postFormData(event)
          }}
        >
          <div className='contact-field'>
            <label>Name</label>
            <input
              type='text'
              onChange={onChangeText}
              name={UserContact.name}
              id={UserContact.name}
            />
          </div>
          <div className='contact-field '>
            <label>Premenant Address</label>
            <textarea
              className='field-textarea'
              name={UserContact.stayerAddress}
              id={UserContact.stayerAddress}
              rows={4}
              cols={50}
              onChange={onChangeText}
            />
          </div>
          <div className='contact-field'>
            <label>Address Proof</label>
            <input
              type='file'
              name={UserContact.addressProof}
              onChange={onChangeFile}
              id={UserContact.addressProof}
            />
          </div>

          <div className='contact-field'>
            <label>Mobile</label>
            <input
              type='number'
              id={UserContact.mobile}
              name={UserContact.mobile}
              onChange={onChangeText}
              minLength={10}
              maxLength={10}
            />
          </div>
          <div className='contact-field'>
            <label>Date of Arrival</label>
            <input
              type='date'
              name={UserContact.dateOfArrival}
              id={UserContact.dateOfArrival}
              onChange={onChangeDate}
            />
          </div>
          <div className='contact-field'>
            <label>Coming From</label>
            <input
              type='text'
              name={UserContact.comingForm}
              id={UserContact.comingForm}
              onChange={onChangeText}
            />
          </div>

          <div className='contact-field'>
            <label>Purpose of visit</label>
            <select
              name={UserContact.visitPurpose}
              id={UserContact.visitPurpose}
              onChange={onChangeText}
            >
              <option value='student'>student</option>
              <option value='working'> working</option>
            </select>
          </div>

          <div className='contact-field'>
            <label>
              {contactDetails.visitPurpose === 'student'
                ? 'College Name'
                : 'Office Name'}
            </label>
            <input
              type='text'
              name={UserContact.proffessionalName}
              id={UserContact.proffessionalName}
              onChange={onChangeText}
            />
          </div>

          <div className='contact-field'>
            <label>
              {contactDetails.visitPurpose === 'student'
                ? 'College Address'
                : 'Office Address'}
            </label>
            <textarea
              className='field-textarea'
              name={UserContact.proffessionalAddress}
              id={UserContact.proffessionalAddress}
              rows={4}
              cols={50}
              onChange={onChangeText}
            />
          </div>

          <div className='contact-field'>
            <label>Duration Of Stay</label>
            <input
              type='number'
              name={UserContact.durationOfStay}
              onChange={onChangeText}
              id={UserContact.durationOfStay}
            />
          </div>
       
          <div className='form-submit'>
            <button className='submit-btn'> submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ContactForm
