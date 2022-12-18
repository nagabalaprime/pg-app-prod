import React, { useState } from "react";
import ModalPopup from "../../components/ModalPopup/ModalPopup";
import { intialState, IUserContact, UserContact } from "../../types/fieldNames";
import ContactForm from "./ContactForm";
import { db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DBCollection } from "../../types/dbCollection";
import ConditionsModalContent from "./ConditionsModalContent";

const ContactFormPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [contactDetails, setContactDetails] = useState(intialState);
  const navigate = useNavigate();

  const onCloseModal = () => {
    setShowModal(false);
  };

  const uploadImage = async () => {
    if (contactDetails?.addressProof === "") return;
    const fileLocalState = contactDetails?.addressProof as any;
    const addressProofRef = ref(
      storage,
      `images/${contactDetails.name + `/${fileLocalState.name + moment.now()}`}`
    );

    try {
      const uploadedFile = await uploadBytes(addressProofRef, fileLocalState);
      return await getDownloadURL(uploadedFile?.ref);
    } catch (exception) {
      return "";
    }
  };

  const onAgree = async () => {
    setLoader(true);
    setShowModal(false);
    try {
      const uploadedImageURL = await uploadImage();
      const newDate = moment(contactDetails.dateOfArrival, "DD-MM-YYYY");
      const appendContactData = {
        ...contactDetails,
        [UserContact.addressProof]: uploadedImageURL,
        [UserContact.dateOfArrival]: newDate + ""
      };
      await db
        .collection(DBCollection.UserInfo)
        .add({ ...appendContactData, status: "requested" });
      alert("record got saved successfully");
      navigate("/contact");
    } catch (exception) {
      alert("error" + exception);
    } finally {
      setLoader(false);
    }
  };

  const confirmationPopup = () => (
    <ModalPopup
      onClose={() => {
        onCloseModal();
      }}
      title="Terms and condition"
      show={showModal}
    >
      {ConditionsModalContent()}
      <button onClick={onAgree}>Agree</button>
    </ModalPopup>
  );

  const updateContact = (contact: IUserContact) => {
    setContactDetails({ ...contact });
    setShowModal(true);
  };

  return (
    <div>
      <div>
        <h2 style={{ textAlign: "center" }}>Contact From</h2>
      </div>
      {loader ? (
        <div className="loader"></div>
      ) : (
        <ContactForm updateContact={updateContact} />
      )}
      {confirmationPopup()}
    </div>
  );
};

export default ContactFormPage;
