import firebase from "firebase/compat";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import RoomAllocateForm from "../../components/RoomAllocateForm/RoomAllocateForm";
import { db } from "../../firebaseConfig";
import { DBCollection } from "../../types/dbCollection";
import ContactDetailsList from "./ContactDetailsList";
import { v4 as uuidv4 } from "uuid";
import "./ContactDetailsStyle.scss";

const ContactDetailsPage = () => {
  const [userDataList, setUserDataList] = useState([]);
  const [showAllocate, setShowAllocate] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");

  const fetchUserData = async () => {
    const response = db.collection(DBCollection.UserInfo);
    const data = await response.get();
    const userList: firebase.firestore.DocumentData[] = [];
    data.docs.forEach((item) => {
      const docData = { ...item.data() };
      if (docData.status === "requested") {
        const updatedItemWithID = { ...item.data(), userID: item.id };
        userList.push(updatedItemWithID);
      }
    });
    //@ts-ignore
    setUserDataList([...userList]);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const allocateUser = (userID: string) => {
    setShowAllocate(true);
    setSelectedUserID(userID);
  };

  const deleteUser = (userID: string) => {
    if (window.confirm("Are you sure want to delete user") == true) {
      db.collection(DBCollection.UserInfo)
        .doc(userID)
        .delete()
        .then(() => {
          fetchUserData();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const onCloseModal = () => {
    setShowAllocate(false);
  };

  const editUser =(userID: string) =>{

  }

  return (
    <div className="stayer-details-page">
      <h2 style={{ textAlign: "center" }}>PG Contacted Person Information</h2>
      {!_.isEmpty(userDataList) && (
        <ContactDetailsList
          userDataList={userDataList}
          allocateUser={allocateUser}
          deleteUser={deleteUser}
          key={uuidv4}
        />
      )}
      <ModalPopup
        onClose={() => {
          onCloseModal();
        }}
        title="Allocate Room"
        show={showAllocate}
      >
        <RoomAllocateForm userID={selectedUserID} />
      </ModalPopup>
    </div>
  );
};

export default ContactDetailsPage;
