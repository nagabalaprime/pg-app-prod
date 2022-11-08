import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import './AdminPageStyles.scss'

const AdminPage = () => {
  const navigate = useNavigate();
  return (
    <div>
        <div className='nav-bar'>
            <ul>
                <li><a onClick={()=>navigate('/contactEntry')}>Add New Contact</a></li>
                <li><a onClick={() => navigate('/contact') }>To Allocate Room</a></li>
                <li><a onClick={() => navigate('/stayer') }>To Vacate Stayer</a></li>
                <li><a onClick={() => navigate('/vacated') }>Vacated Stayer List</a></li>
                <li><a onClick={() => navigate('/rooms') }>Add Room</a></li>
            </ul>
      </div>
        <Outlet /> 
    </div>
  )
}

export default AdminPage