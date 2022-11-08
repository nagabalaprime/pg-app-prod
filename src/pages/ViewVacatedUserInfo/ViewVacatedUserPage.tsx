import _ from 'lodash'
import React, { useEffect, useState } from 'react';
import { DBCollection } from '../../types/dbCollection'
import { fetchData } from '../../utils/fetchData'
import './ViewVacatedUserStyle.scss'

const ViewVacatedUserPage = () => {
  let params = new URL(document.location as any).searchParams
  let vacatedUserID = params.get('vacatedUserID');
  const [userData, setUserData] = useState({});

 

  useEffect(() => {
    async function fetchDetails () {
      const userResponse = await fetchData(DBCollection.VacateUserInfo, vacatedUserID + '')
      //@ts-ignore
      setUserData({...userResponse});
     
    }
    if (!!vacatedUserID) {
      fetchDetails();
    }
  }, [vacatedUserID])

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
        <h3>User Details</h3>
        <div className='view-card'>{renderContactDetails(userData)}</div>
      </div>
    </div>
  )
}

export default ViewVacatedUserPage
