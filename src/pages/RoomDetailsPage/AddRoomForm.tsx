import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { db } from '../../firebaseConfig';
import { DBCollection } from '../../types/dbCollection';
import { fetchDataList } from '../../utils/fetchData';

const AddRoomForm = ({onClose} : any) => {

  const AddRoom = {
    roomType: 'roomType',
    roomNo: 'roomNo',
    status: 'status',
    sharing: 'sharing',
    roomID: 'roomID'
  }

  const intialState: IAddRoom = {
    roomType: '',
    roomNo: 100,
    status:'vacant',
    sharing: 1
  }

  interface IAddRoom {
    roomType: string;
    roomNo: number;
    status: string;
    sharing: number;
  }
  

  const [roomInfo, setRoomInfo] = useState(intialState);
  const [roomInfoList, setRoomInfoList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchRoomInfo();
  }, [])

  const fetchRoomInfo = async ()=>{
    const roomDataList  = await fetchDataList(DBCollection.RoomInfo ,AddRoom.roomID )
     //@ts-ignore
     setRoomInfoList([...roomDataList]);
  }

  const postFormData = async (event: any) => {
    try{
        event?.preventDefault();
        setLoader(true);

        //@ts-ignore
        const existingRoom = roomInfoList.find(roomValue => roomValue?.roomNo === roomInfo?.roomNo)
        if(!existingRoom){
            await db.collection(DBCollection.RoomInfo).add({ ...roomInfo });
        }
       
    }catch(expection){
        alert('error occured');
    }finally{
        setLoader(false);
        onClose();
    }
  }

  const onChangeText = (event: any) => {
    const textValue = event.target.value
    setRoomInfo({ ...roomInfo, [event.target.name]: textValue });
  }
  return (
    <div>
      {loader ? (
        <div className='loader'></div>
      ) : (
        <form
          className='room-allocate-form'
          onSubmit={event => {
            postFormData(event)
          }}
        >
          <div className='input-field'>
            <label>Room No</label>
            <input
              type='number'
              onChange={onChangeText}
              name={AddRoom.roomNo}
              maxLength={3}
              minLength={3}
            />
          </div>

          <div className='input-field'>
            <label>Sharing</label>
            <select
              name={AddRoom.sharing}
              onChange={onChangeText}
              defaultValue={''}>   
                <option value='' disabled>{'Select No of sharing'}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
          </div>

          <div className='input-field'>
            <label>Room Type</label>
            <select
              name={AddRoom.roomType}
              onChange={onChangeText}
              defaultValue={''}
            >
              <option value="" disabled> Select Room Type</option>
              <option value='AC'>A/C</option>
              <option value='NonAC'> Non A/C</option>
            </select>
          </div>
       
       
          <div className='form-submit'>
            <button className='submit-btn'>submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddRoomForm;
