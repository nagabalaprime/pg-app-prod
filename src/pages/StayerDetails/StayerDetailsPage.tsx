import _ from "lodash";
import React, { useEffect, useState } from "react";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import RoomVacateForm from "../../components/RoomVacateForm/RoomVacateForm";
import { DBCollection } from "../../types/dbCollection";
import { fetchDataList } from "../../utils/fetchData";
import StayerDetailsList from "./StayerDetailsList";
import "./StayerDetailsStyle.scss";

const StayerDetailsPage = () => {
  const [userDataList, setUserDataList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState("");

  const fetchUserData = async () => {
    const dataList = await fetchDataList(DBCollection.UserInfo, "userID");
    const filteredDatalist = dataList.filter(data => data.status === "allocated");
    //@ts-ignore
    setUserDataList([...filteredDatalist]);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const vacateUser = (userID: string) => {
    setShowModal(true);
    setSelectedUserID(userID);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="stayer-details-page">
      <h2 style={{ textAlign: "center" }}>PG Stayer Details</h2>
      {!_.isEmpty(userDataList) &&
        <StayerDetailsList
          userDataList={userDataList}
          vacateUser={vacateUser}
        />}
      <ModalPopup
        onClose={() => {
          onCloseModal();
        }}
        title="Vacate Room"
        show={showModal}
      >
        <RoomVacateForm userID={selectedUserID} />
      </ModalPopup>
    </div>
  );
};

export default StayerDetailsPage;
