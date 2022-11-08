import React from 'react';
import { useTable } from 'react-table';

const ContactDetailsList = ({userDataList  , allocateUser} : any) => {
 
  const data = React.useMemo(
    () => userDataList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'User ID',
        accessor: 'userID', // accessor is the "key" in the data
     
      },
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Address',
        accessor: 'stayerAddress',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'Date of Arrival',
        accessor: 'dateOfArrival',
      },
      {
        Header: 'Coming From',
        accessor: 'comingForm',
      },
      {
        Header: 'Proffessional Address',
        accessor: 'proffessionalAddress',
      },
      {
        Header: 'Purpose of Visit',
        accessor: 'visitPurpose',
      },
      {
        Header: 'Address Proof',
        accessor: 'addressProof',
        Cell: (props : any) => {
          return (
          <div className="blog-comments__avatar mr-3">
            <img
              src={props.cell.value}  width={50} 
              alt='address-proof'
            />
          </div>
        )
         }
      },
      {
        Header: 'Duration of  Stay',
        accessor: 'durationOfStay',
      }  ,
      {
        Header: 'Action',Cell: (props : any) => {
          const userID = props?.row?.values?.userID;
          return(<button onClick={()=>{allocateUser(userID)}}>allocate</button>)
        }
      }  
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const initialState = { hiddenColumns: ['userID'] };


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data  , initialState} as any)

  return (
    <table {...getTableProps()} className="responsive-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  padding: "10px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "left",
                  backgroundColor: "#04AA6D",
                  color: "white",
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'white',
                    }}
                    data-label={cell?.column?.Header}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export default ContactDetailsList


