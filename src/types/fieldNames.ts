export const UserContact = {
    name: 'name',
    stayerAddress: 'stayerAddress',
    mobile: 'mobile',
    dateOfArrival: 'dateOfArrival',
    comingForm: 'comingForm',
    proffessionalAddress: 'proffessionalAddress',
    visitPurpose: 'visitPurpose',
    addressProof: 'addressProof',
    durationOfStay: 'durationOfStay',
    dateOfVacate:'dateOfVacate',
    proffessionalName: 'proffessionalName'
  }

  export const RoomField  = {
    roomNo: 'roomNo',
    sharing: 'sharing',
    status:'status',
    roomType: 'roomType'
  }

  export const PaymentField = {
    advanceAmt : 'advanceAmt' ,
    totalPaid: 'totalPaid' ,
    unitStart: 'unitStart' ,
    unitEnd: 'unitEnd' 
  }

  
  export interface IUserContact {
    name: string;
    stayerAddress: string;
    mobile: number;
    dateOfArrival: Date;
    comingForm: string;
    proffessionalAddress: string;
    visitPurpose: string;
    addressProof: string;
    durationOfStay: number;
    proffessionalName: string;
    dateOfVacate: string;
  }

  export const intialState: IUserContact = {
    name: "",
    stayerAddress: "",
    mobile: 0,
    dateOfArrival: new Date(),
    comingForm: "",
    proffessionalAddress: "",
    proffessionalName: "",
    visitPurpose: "student",
    addressProof: "",
    durationOfStay: 0,
    dateOfVacate: ""
  };