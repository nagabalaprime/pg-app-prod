import { deleteField } from "firebase/firestore";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { DBCollection } from "../../types/dbCollection";
import { PaymentField, RoomField, UserContact } from "../../types/fieldNames";
import { RoomCost } from "../../types/RoomCost";
import { fetchData } from "../../utils/fetchData";
import "./RoomVacateFormStyle.scss";

const RoomVacateField = {
  name: "name",
  dateOfArrival: "dateOfArrival",
  durationOfStay: "durationOfStay",
  advance: "advance",
  unitStart: "unitStart",
  unitEnd: "unitEnd",
  roomNo: "roomNo",
  roomType: "roomType",
  sharing: "sharing",
  totalPaid:'totalPaid',
  expectedPrice: 'expectedPrice',
  paymentID: 'paymentID' ,
  roomID: 'roomID'
};

const intialState = {
  name: "",
  dateOfArrival: '',
  durationOfStay: 0,
  advance: 5000,
  unitStart: '',
  unitEnd: '',
  roomNo: '',
  roomType: "AC",
  sharing: 1,
  totalPaid: 0,
  roomID: '',
  paymentID:''
};

const RoomVacateForm = ({ userID }: any) => {
  const [vacatedUser, setVacatedUser] = useState(intialState);
  const [expectedPrice, setExpectedPrice] = useState(0);
  const navigate  = useNavigate();

  const fetchDetails = async () => {
    const userInfoData: any = await fetchData(DBCollection.UserInfo, userID);
    if (!_.isEmpty(userInfoData)) {
      const paymentInfoData = await fetchData(
        DBCollection.PaymentInfo,
        userInfoData.paymentID
      );
      const roomInfoData = await fetchData(
        DBCollection.RoomInfo,
        userInfoData.roomID
      );

      const combinedDetails = {
        ...userInfoData,
        ...roomInfoData,
        ...paymentInfoData
      };
      
      const filterDetails = _.pick(
        combinedDetails,[
        [UserContact.name],
        [UserContact.dateOfArrival],
        [UserContact.durationOfStay],
        [RoomField.roomType],
        [RoomField.sharing],
        [RoomField.roomNo],
        [PaymentField.unitStart],
        [PaymentField.unitEnd],
        [PaymentField.totalPaid]
      ]
      );
      
      //@ts-ignore
      setVacatedUser({ ...combinedDetails });
    }
  }

    useEffect(() => {
      fetchDetails();
      calculateCost();
    }, []);

    useEffect(() => {
      calculateCost();
    }, [vacatedUser.durationOfStay])
    

    const onChangeText = (event: any) => {
      const textValue = event.target.value;
      setVacatedUser({ ...vacatedUser, [event.target.name]: textValue });
    };
    
    const postFormData = async(event: any)=>{
      event?.preventDefault();
      try{
        const vacatedUserRef : any = await db.collection(DBCollection.VacateUserInfo).add({...vacatedUser });
      
        if(vacatedUserRef){
          await db.collection(DBCollection.UserInfo).doc(userID).update({status:'vacated'});
          await db.collection(DBCollection.PaymentInfo).doc(vacatedUser.paymentID).update({status:'fully paid' });
          await db.collection(DBCollection.RoomInfo).doc(vacatedUser.roomID).update({status:'vacant' ,['userID']: deleteField() });
        }
      } catch(exception){
        alert('error occured');
      } finally{
        navigate('/vacated');
      }
    
     
    }
  
    const calculateCost = ()=>{
      //@ts-ignore
      const roomType = RoomCost[vacatedUser.roomType];
      const sharing =  [vacatedUser.sharing];
      //@ts-ignore
      const advance =  Number(roomType['advance']);
      const roomCostPerDay = Number(roomType[sharing]);
      const roomCost = Number(roomCostPerDay) * Number(vacatedUser.durationOfStay);
      setExpectedPrice(roomCost-advance);
      setVacatedUser({ ...vacatedUser, ['totalPaid']: (roomCost-advance) });
    }

    return (
      <form
          className='room-vacate-form'
          onSubmit={event => {
            postFormData(event)
          }}
        >
        <div className="contact-field">
          <label>Name</label>
          <input
            type="text"
            onChange={onChangeText}
            name={RoomVacateField.name}
            value={vacatedUser.name}
          />
        </div>
        <div className="contact-field">
          <label>No of Days</label>
          <input
            type="text"
            onChange={onChangeText}
            name={RoomVacateField.durationOfStay}
            value={vacatedUser.durationOfStay}
          />
        </div>
        <div className="contact-field">
          <label>Date of Arrival</label>
          <input type="text" name={RoomVacateField.dateOfArrival}   
          value={vacatedUser.dateOfArrival} disabled/>
        </div>
        <div className="contact-field">
          <label>Room Type</label>
          <input type="text" name={RoomVacateField.roomType}
           value={vacatedUser.roomType} disabled />
        </div>
        <div className="contact-field">
          <label>Room Sharing</label>
          <input type="text" name={RoomVacateField.sharing}
           value={vacatedUser.sharing} disabled />
        </div>
        <div className="contact-field">
          <label>Unit Start</label>
          <input
            type="text"
            name={RoomVacateField.unitStart}
            onChange={onChangeText}
            value={vacatedUser.unitStart}
          />
        </div>
        <div className="contact-field">
          <label>Unit End</label>
          <input
            type="text"
            name={RoomVacateField.unitEnd}
            onChange={onChangeText}
            value={vacatedUser.unitEnd}
          />
        </div>
        <br />
        <div className="contact-field">
          <label>Expected Price</label>
          <input
            type="text"
            name={RoomVacateField.expectedPrice}
            value={expectedPrice}
          />
        </div>
        <div className="contact-field">
          <label>Total Price</label>
          <input
            type="text"
            name={RoomVacateField.totalPaid}
            value={vacatedUser.totalPaid}
            onChange={onChangeText}
          />
        </div>
        <div>
          <button>save</button>
        </div>
      </form>
    );
  };
export default RoomVacateForm;
