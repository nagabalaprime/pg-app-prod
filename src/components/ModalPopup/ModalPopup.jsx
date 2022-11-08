import React, { useEffect } from "react";
import "./ModalPopup.scss";

const ModalPopup = props => {
  
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  return (
    <>
      {props.show ?
      <div className="modal">
      <div className="modal-content">
     
        <div className="modal-header"> 
        <div className="modal-title">{props.title}</div>
        <div className="modal-close" onClick={()=> props.onClose()}>X</div>
         </div>
         <div className="modal-body">
           {props.children}
         </div>
       </div>
       </div>
      : null}
    </>  
  );
};

export default ModalPopup;
