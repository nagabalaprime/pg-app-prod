import _ from "lodash";
import { db } from "../firebaseConfig";

export async function fetchData (documentName ='', documentID=''){
    const response =  await db.collection(documentName).doc(documentID+'').get();
    const responseData = response.data();
    if(!_.isEmpty(responseData)){
        return responseData;
    }
   }

   export async function fetchDataList (documentName ='', keyID=''){
    const response =  await db.collection(documentName).get();
    //@ts-ignore
    const dataList = [];
    response.docs.forEach(item=>{
        const updatedItemWithID = {...item.data() , [keyID]: item.id}
        dataList.push(updatedItemWithID);
       });
       
    //@ts-ignore
    return dataList;
   }