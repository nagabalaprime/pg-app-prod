import React, { useEffect, useState } from 'react';
import './RoomAllocateFormStyle.scss';
import * as _ from 'lodash';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { DBCollection } from '../../types/dbCollection';
import { fetchDataList } from '../../utils/fetchData';

interface IProps {
    userID: string;
}

interface IRoomInfo {
  roomNo: string;
  roomType: string;
  status: string;
  roomID?: string;
}

const RoomAllocateForm = ({userID}: IProps) => {

  const RoomAllocate = {
    roomType: 'roomType',
    roomNo: 'roomNo',
    status: 'status',
    advance: 'advance',
    unitStart: 'unitStart', 
    roomID: 'roomID'
  }

  const intialState: IRoomAllocate = {
    roomType: '',
    roomNo: 100,
    status:'vacant',
    advance: 5000
  }

  interface IRoomAllocate {
    roomType: string;
    roomNo: number;
    status: string;
    advance: number;
    unitStart?: number;
    roomID?: string;
    userID?: number;
  }


  const [allocateUser, setAllocateUser] = useState(intialState);
  const [roomInfoList, setRoomInfoList] = useState([]);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomInfo();
  }, []);
  

  const fetchRoomInfo = async ()=>{
    const dataList = await fetchDataList(DBCollection.RoomInfo , RoomAllocate.roomID);
   if(!_.isEmpty(dataList)){
    const vacantRoomList = dataList.filter(data=>{
      if(data.status === 'vacant') {
        return data;
      }
    });
    //@ts-ignore
    setRoomInfoList([...vacantRoomList])
   }
    
  }

  const postFormData = async (event: any) => {
    event?.preventDefault();
    const userPaymentDetails = {..._.pick(allocateUser,['advance' , 'unitStart' , 'userID' , 'roomID'])}
    const roomID = allocateUser.roomID;
   
    if(roomID){
      try{
        setLoader(true)
        await db.collection(DBCollection.RoomInfo).doc(roomID).update({status: 'allocated' , userID})
        const paymentRef : any = await db.collection(DBCollection.PaymentInfo).add({...userPaymentDetails , status: 'partially paid'});
        const updatedUserInfo  = {status:'allocated'  , 'paymentID' : paymentRef.id ,roomID};
        await db.collection(DBCollection.UserInfo).doc(userID).update(updatedUserInfo);
        navigate('/stayer')
      }catch(error){
        alert('error occured while saving');
      }finally {
        setLoader(false);
      }
    }
  }

  const onChangeText = (event: any) => {
    const textValue = event.target.value;
    let updatedAllocatedUser = {...allocateUser};
    if(event.target.name === RoomAllocate.roomNo){
      const selectedRoom: any = roomInfoList.find(roomInfo => roomInfo[RoomAllocate.roomNo] === textValue);

      if(!!selectedRoom){
         updatedAllocatedUser = {...allocateUser , ...selectedRoom}
      }
    }
    setAllocateUser({ ...updatedAllocatedUser, [event.target.name]: textValue })
  }

  const renderRoomNoOptions = ()=>{
    if(!_.isEmpty(roomInfoList)){
      return  roomInfoList.map((roomInfo:IRoomInfo)=> {
        return <option value={roomInfo.roomNo}> {roomInfo.roomNo}</option>
      });
    }
    return null;
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
            <select
              name={RoomAllocate.roomNo}
              onChange={onChangeText}
              defaultValue={''}
              disabled={roomInfoList.length <=0}>   
                <option value='' disabled>{
                roomInfoList.length <=0? 'No Rooms available to select':
                'Select Room No'}</option>
                {renderRoomNoOptions()}
              </select>
          </div>

          <div className='input-field'>
            <label>Advance Amount</label>
            <input
              type='number'
              name={RoomAllocate.advance}
              value="5000"
            />
          </div>
         

          <div className='input-field'>
            <label>Room Type</label>
            <input
              type='text'
              name={RoomAllocate.roomType}
              value={allocateUser.roomType}
              disabled
            />
          </div>
          {allocateUser?.roomType === "AC" &&
          <div className='input-field'>
            <label>Unit Start</label>
            <input
              type='number'
              name={RoomAllocate.unitStart}
              onChange={onChangeText}
            />
          </div>
        }
       
       
          <div className='form-submit'>
            <button className='submit-btn'> submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RoomAllocateForm;

