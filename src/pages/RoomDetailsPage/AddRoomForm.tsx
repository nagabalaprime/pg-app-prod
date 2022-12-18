import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { db } from '../../firebaseConfig';
import { DBCollection } from '../../types/dbCollection';
import { fetchDataList } from '../../utils/fetchData';

interface IBedInfo {
  bedNo: string;
  status: string;
  userID : string;
}
interface IAddRoom {
  roomType: string;
  roomNo: string;
  status: string;
  sharing: number;
  floorNo: number;
  bedDetails:Array<IBedInfo>;
}

const AddRoomForm = ({onClose} : any) => {

  const AddRoom = {
    roomType: 'roomType',
    floorNo: 'floorNo',
    roomNo: 'roomNo',
    sharing: 'sharing',
    roomID: 'roomID',
    bedDetails: {
      bedNo: 'bedNo',
      status: 'status',
      userID : 'userID'
    }
  }

  const intialState: IAddRoom = {
    floorNo: 0,
    roomType: '',
    roomNo: '01',
    status:'vacant',
    sharing: 1,
    bedDetails:[{
      bedNo: '010',
      userID: '', 
      status: 'vacant'
    }]
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

  const getBedDetails = ()=>{
    const bedDetails= [];
  
    if(roomInfo.sharing >0){
      const bedDetail = {
        bedNo: '',
        userID : '',
        status: 'vacant'
      }
      for(let i=0;i< Number(roomInfo.sharing) ; i++){
        bedDetail.bedNo = roomInfo.floorNo + roomInfo.roomNo + i +'';
        bedDetails.push(bedDetail);
      }
    }
    return bedDetails;
  }

  const checkIfRoomExists = ()=>{
   return roomInfoList.find((roomObj:any) =>{
      return roomObj.roomNo === roomInfo.roomNo
    })
  }

  const postFormData = async (event: any) => {
    try{
        event?.preventDefault();
        setLoader(true);
        if(!checkIfRoomExists()){
          const updatedRoomInfo = {...roomInfo}; 
          updatedRoomInfo.bedDetails = getBedDetails();
          await db.collection(DBCollection.RoomInfo).add({ ...roomInfo });
        } else {
         alert('room already exists');
        }
    } catch(expection){
        alert('error occured');
    } finally{
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
            <label>Floor</label>
            <select
              name={AddRoom.floorNo}
              onChange={onChangeText}
              defaultValue={''}>   
                <option value='' disabled>{'Select Floor'}</option>
                <option value="0">Ground Floor</option>
                <option value="1">First Floor</option>
                <option value="2">Second Floor</option>
              </select>
          </div>

          <div className='input-field'>
            <label>Room No</label>
            <input
              type='text'
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
                <option value="4">4</option>
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
