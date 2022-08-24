import React from 'react'
import Navbar from '../Components/NavbarComponent';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image
} from '@chakra-ui/react';
import { API_URL } from '../helper';
import { loginAction } from '../actions/usersAction';
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const EditProfilPage = (props) => {

    const [usersData, setUsersData] = React.useState('');
    const [_fullname, setFullname] = React.useState('');
    const [_username, setUsername] = React.useState('');
    const [_bio, setBio] = React.useState('');
    const [img, setImg] = React.useState('');
    const [toggle, setToggle] = React.useState(false);

    const dispatch = useDispatch();
    const toast = useToast();
    const navigate = useNavigate();

    const { idusers, fullname, username, bio, status, profile_img } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            username: userReducer.username,
            fullname: userReducer.fullname,
            profil_img: userReducer.profil_img,
            bio: userReducer.bio,
            status: userReducer.status,
            profile_img: userReducer.profile_img,
        }
    })

    React.useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        axios.get(API_URL + '/auth/all')
            .then(res => {
                setUsersData(res.data)
            })
    };

    const onSave = () => {
        let insert = {};

        if (_fullname) {
            insert.fullname = _fullname
        } else {
            insert.fullname = fullname
        }

        if (_bio) {
            insert.bio = _bio
        } else {
            insert.bio = bio
        }

        let usernameAvailable = false;
        if (_username) {
            let userIdx = usersData.findIndex(val => val.username == _username);
            if (userIdx < 0) {
                insert.username = _username;
                usernameAvailable = true;
            } else {
                toast({
                    title: `Username Has Been Used By Other User`,
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }
        } else {
            insert.username = username;
            usernameAvailable = true;
        }

        if (usernameAvailable) {
            axios.patch(API_URL + '/auth/edit/' + idusers, insert)
                .then(res => {
                    dispatch(loginAction(res.data));
                    getData();
                    navigate('/profile')
                    toast({
                        title: `Profile Updated`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top'
                    })
                }).catch(err => {
                    console.log(err);
                })
        }
    };
    
    const onChangeProfileImg = () => {
        let formData = new FormData();
        formData.append('profile_img', img);

        axios.patch(API_URL + '/auth/editPicts/' + idusers, formData)
            .then(res => {
                dispatch(loginAction(res.data));
                getData();
                setToggle(!toggle);
                toast({
                    title: `Profile Picture Updated`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
                window.location.reload();
            }).catch(err => {
                console.log(err);
            })
    };

    const onSendVerify = () => {
        let posty = localStorage.getItem('posty');

        axios.get(API_URL + '/auth/sendverify', {
            headers: {
                'Authorization': `Bearer ${posty}`
            }
        }).then(res => {
            if (res.data.success) {
                toast({
                    title: `Verification link sent`,
                    description: 'Please check your email',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }
        }).catch(err => {
            console.log(err);
        })
    };

    const onResetPassword = () => {

        axios.get(API_URL + `/auth/reset/${idusers}`)
            .then(res => {
                if (res.data.success) {

                    toast({
                        title: `Reset Password Email sent`,
                        description: 'Please check your email',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top'
                    })
                }
            }).catch(err => {
                console.log(err);
            })


    };

    return (
        <div>
            <Navbar />
            <div className='container-fluid bg-light ' style={{ height: '100vh' }}>
                <div id='setting-page' >
                    <div className='container row  mx-auto'>
                        <div className='col-11 col-md-7 mx-auto border rounded bg-white'>
                            <div  >
                                <h1 className='fw-bold p-2 m-1'>Edit Profile</h1>

                                <hr />
                            </div>

                            <div >
                                <div id='edit-profile' className='px-5 pt-5 pb-3 d-flex'>
                                    <img id='edit-img' src={API_URL + profile_img} alt="" />
                                    <div id='edit-picture'>
                                        <h1 className='username fw-bold ms-1'>{username}</h1>
                                        <Button className='text-primary' colorScheme='white' variant='ghost' onClick={() => setToggle(!toggle)}>
                                            Change Profile Picture
                                        </Button>
                                    </div>
                                </div>

                            </div>

                            <div className='mx-5'>
                                <div className='mx-2 '>

                                    {
                                        status == 'VERIFIED' ?
                                            <div className=''>
                                                <p className='text-success fw-bold py-2'>
                                                    This account is verified
                                                </p>

                                            </div>
                                            :
                                            <div className='my-2 d-flex justify-content-between'>
                                                <p className='text-danger fw-bold'>
                                                    This account is unverified
                                                </p>
                                                <button className='fw-bold btn btn-sm mb-1 btn-warning' onClick={onSendVerify}>
                                                    Send Email to Verify
                                                </button>
                                            </div>
                                    }
                                    <div className='justify-content-between'>
                                        <label className='fw-bold d-none d-md-block'>Username </label>
                                        <Input className='form-control my-1 mx-auto' size='sm' type="text" defaultValue={username} onChange={(e) => { setUsername(e.target.value); console.log(_username) }} />
                                    </div>

                                    <div className='justify-content-between'>
                                        <label className=' fw-bold d-none d-md-block'>Fullname </label>
                                        <Input id='edit-fullname' className='form-control my-1 mx-auto' size='sm' type="text" defaultValue={fullname} onChange={(e) => { setFullname(e.target.value); console.log(_fullname) }} />
                                    </div>

                                    <div className=' justify-content-between'>
                                        <label className=' fw-bold d-none d-md-block text-start'>Bio </label>
                                        <textarea id='edit-bio' className='form-control my-1 mx-auto' cols="15" rows="5" style={{ height: '150px' }} defaultValue={bio} onChange={(e) => { setBio(e.target.value); console.log(_bio) }}></textarea>
                                    </div>

                                    <div className='my-2'>
                                        <button className='fw-bold btn btn-sm mb-1 btn-warning' onClick={onResetPassword}>
                                            Reset Password
                                        </button>
                                    </div>

                                    <p className='text-end'><button className='btn btn-violet text-white mb-2 mt-3 ' onClick={onSave}>Save</button></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <>
                <Modal className='bg-register' isOpen={toggle} onClose={() => setToggle(!toggle)} size='xl'>
                    <ModalOverlay />
                    <ModalContent className="p-3">
                        <ModalHeader>Choose Profile Picture</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <div className='col-12 row'>
                                <div className='col-20 mx-auto'>
                                    <label className="form-label fw-bold text-muted">Image file</label>
                                    <input className='form-control m-auto mt-3' type='file' onChange={(e) => setImg(e.target.files[0])} />
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className='text-white btn btn-violet' mr={3} onClick={onChangeProfileImg}>
                                Save
                            </button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    )
}

export default EditProfilPage;