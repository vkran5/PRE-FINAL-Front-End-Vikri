import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt, FaCameraRetro, FaUser } from "react-icons/fa";
import { BsFillHouseDoorFill, BsHeartFill } from "react-icons/bs";
import { logoutAction } from '../actions/usersAction';
import axios from 'axios';
import { API_URL } from '../helper';
import {
    WrapItem,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';

const Navbar = (props) => {

    const { pathname } = window.location;
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { email, username, password, profil_img } = useSelector(({ userReducer }) => {
        return {
            email: userReducer.email,
            username: userReducer.username,
            profil_img: userReducer.profil_img,
            password: userReducer.password,
        }
    })

    // console.log(email);

    const onLogout = () => {
        axios.get(API_URL + `/auth/all?email=${email}&password=${password}`)
            .then((res) => {
                localStorage.removeItem('posty');
                dispatch(logoutAction(res.data));
                navigate('/', { replace: true });
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <div id='main-navbar' className={`navbar navbar-expand-lg navbar-white bg-white position-absolute w-100 ${pathname != '/home' ? 'border' : ''} `}>
            <div className='container' style={{ cursor: 'pointer' }}>
                <span id='main-navbar' className='navbar-brand d-flex ' style={{zIndex: '20'}}>
                    <span className='d-flex ps-5'>
                        <FaCameraRetro className='text-violet' style={{ fontSize: '32px'}} />
                    </span>

                    <span className='fw-bold ' onClick={() => navigate('/home')}>
                        <p className='ms-2 '>POSTY</p>
                    </span>
                </span>

                <div id='navbar' className='d-flex'>

                    <div className='menu-navbar'>
                        {
                            pathname != '/home' ? <BsFillHouseDoorFill className='mx-2' onClick={() => navigate('/home')} style={{ fontSize: '22px' }} /> : null
                        }
                    </div>

                    <div className='menu-navbar'>
                        {
                            pathname != '/home' ? <BsHeartFill className='mx-2' onClick={() => navigate('/liked')} style={{ fontSize: '22px' }} /> : null
                        }
                    </div>


                    <WrapItem >
                        <Menu id='menu-nav' className='mt-5'>
                            <MenuButton className='menu-navbar mx-2'>
                                <FaUser style={{ fontSize: '20px' }} />
                            </MenuButton>

                            <MenuList id='dropdown' className='me-5'>
                                <MenuItem className='text-muted ' onClick={() => navigate('/profile')}>Profile</MenuItem>
                                <MenuItem className='text-muted' onClick={() => navigate('/liked')}>Liked Post</MenuItem>
                                <MenuItem className='text-muted' onClick={() => navigate('/setting')}>Setting</MenuItem>
                                <MenuItem className='text-danger fw-bold' onClick={onLogout}>Log Out <FaSignOutAlt className='ms-3 mt-1 text-danger' /></MenuItem>
                            </MenuList>
                        </Menu>
                    </WrapItem>
                </div>
            </div>
        </div>
    )
}

export default Navbar;