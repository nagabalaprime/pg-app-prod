import _ from 'lodash'
import React, { useEffect, useState } from 'react';
import { DBCollection } from '../../types/dbCollection';
import { fetchData } from '../../utils/fetchData';
import './ViewUserInfoStyle.scss';

const ViewUserInfoPage = () => {
  let params = new URL(document.location as any).searchParams
  let userID = params.get('userID')

  const [contactDetails, setContactDetails] = useState({})
  const [roomDetails, setRoomDetails] = useState({})
  const [paymentDetails, setPaymentDetails] = useState({})

  useEffect(() => {
    async function fetchDetails () {
      const userResponse = await fetchData(DBCollection.UserInfo, userID + '')

      if (userResponse) {
        const roomResponse = await fetchData(DBCollection.RoomInfo, userResponse.roomID)
        const paymentResponse = await fetchData(
          DBCollection.PaymentInfo,
          userResponse.paymentID
        )
        setContactDetails({ ...userResponse })
        setRoomDetails({ ...roomResponse })
        setPaymentDetails({ ...paymentResponse })
      }
    }
    if (!!userID) {
      fetchDetails();
    }
  }, [userID])

  const covertCamelToTitle = (text = '') => {
    const result = text.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  const renderContactDetails = (rowData: any) => {
    if (!_.isEmpty(rowData)) {
      return Object.keys(rowData).map(contactKey => {
        if (!contactKey.includes('ID')) {
          if (contactKey.includes('address')) {
            return (
              <div className='grid-field'>
                <div className='field-label'>
                  {covertCamelToTitle(contactKey)}
                </div>
                {/*@ts-ignore*/}
                <div className='field-value'>
                  <a href={rowData[contactKey] }>image </a>
                </div>
              </div>
            )
          }
          return (
            <div className='grid-field'>
              <div className='field-label'>
                {covertCamelToTitle(contactKey)}
              </div>
              {/*@ts-ignore*/}
              <div className='field-value'>{rowData[contactKey]}</div>
            </div>
          )
        }
      })
    }
  }

  return (
    <div className='view-user-page'>
      <div className='view-section'>
        <h3>Contact Details</h3>
        <div className='view-card'>{renderContactDetails(contactDetails)}</div>
      </div>
      <div className='view-section'>
        <h3>Room Details</h3>
        <div className='view-card'>{renderContactDetails(roomDetails)}</div>
      </div>
      <div className='view-section'>
        <h3>Payment Details</h3>
        <div className='view-card'>{renderContactDetails(paymentDetails)}</div>
      </div>
    </div>
  )
}

export default ViewUserInfoPage
