import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';

const RoomDetailsList = ({roomList  } : any) => {
 
  const data = React.useMemo(
    () => roomList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const navigate = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        Header: 'Room ID',
        accessor: 'roomID', 
     
      },
      {
        Header: 'Room No',
        accessor: 'roomNo', 
      },
      {
        Header: 'Sharing Type',
        accessor: 'sharing',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Room Type',
        accessor: 'roomType',
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const initialState = { hiddenColumns: ['roomID'] };


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
export default RoomDetailsList


