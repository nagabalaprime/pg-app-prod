import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './AdminPageStyles.scss'

const AdminPage = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  return (
    <div className='admin-page'>
        <div className='nav-bar'>
            <ul>
                <li className={(pathname === '/') ? 'active' : ''}> <a onClick={()=>navigate('/')}>Home</a></li>
                <div className='sub-header'>Add</div>
                <ul>
                  <li className={(pathname === '/contactEntry') ? 'active' : ''}><a onClick={()=>navigate('/contactEntry')}>Add New Contact</a></li>
                  <li className={(pathname === '/rooms') ? 'active' : ''}><a onClick={() => navigate('/rooms') }>Add Room</a></li>
                </ul>
                <div className='sub-header'>Action</div>
                <ul>
                  <li className={(pathname === '/enquiry') ? 'active' : ''}><a onClick={() => navigate('/enquiry') }>To Allocate Room</a></li>
                  <li className={(pathname === '/stayer') ? 'active' : ''}><a onClick={() => navigate('/stayer') }>To Vacate Stayer</a></li>
                </ul>
                <div className='sub-header'>List</div>
                <ul>
                 <li className={(pathname === '/enquiry') ? 'active' : ''}><a onClick={() => navigate('/enquiry') }>Enquiry List</a></li>
                  <li className={(pathname === '/vacated') ? 'active' : ''}><a onClick={() => navigate('/vacated') }>Vacated Stayer List</a></li>
                </ul>
            </ul>
      </div>
        <Outlet /> 
    </div>
  )
}

export default AdminPage