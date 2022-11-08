import firebase from 'firebase/compat';
import _ from 'lodash';
import React, { useEffect, useState } from 'react'
import ModalPopup from '../../components/ModalPopup/ModalPopup';
import { db } from '../../firebaseConfig';
import { DBCollection } from '../../types/dbCollection';
import AddRoomForm from './AddRoomForm';
import RoomDetailsList from './RoomDetailsList';
import './RoomDetailsStyles.scss'

const RoomDetailsPage = () => {

  const [roomList, setRoomList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchRoomsData = async()=>{
    const response=db.collection(DBCollection.RoomInfo);
    const data=await response.get();
    const rooms: firebase.firestore.DocumentData[] = [];
    data.docs.forEach(item=>{
        const updatedItemWithID = {...item.data() , roomID: item.id}
        rooms.push(updatedItemWithID);
      
     });
     //@ts-ignore
     setRoomList([...rooms]);
}

useEffect(() => {
    fetchRoomsData();
}, []);



const onCloseModal = ()=>{
    fetchRoomsData();
    setShowModal(false);
}

const addNewRoom = ()=>{
    setShowModal(true);
}

  return (
    <div className='stayer-details-page'>
      <h2 style={{'textAlign' : 'center'}}> Room Details</h2>
      <button onClick={()=>addNewRoom()}>Add Room</button>
      {!_.isEmpty(roomList) && 
      <RoomDetailsList roomList={roomList} />}
      <ModalPopup onClose={()=>{onCloseModal()}} title="Add Room" show={showModal}>
        <AddRoomForm onClose={()=>{onCloseModal()}}  /> 
      </ModalPopup>
    </div>
  )
}

export default RoomDetailsPage;