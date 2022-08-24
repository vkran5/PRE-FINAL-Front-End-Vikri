import React from 'react';
import Navbar from '../Components/NavbarComponent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_URL } from '../helper';
import { MdImageNotSupported } from "react-icons/md";
import axios from 'axios';

const ProfilePage = (props) => {

    const [ownPost, setOwnPost] = React.useState([]);

    const navigate = useNavigate();
    const { fullname, username, email, profile_img, bio } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            username: userReducer.username,
            email: userReducer.email,
            fullname: userReducer.fullname,
            profil_img: userReducer.profil_img,
            bio: userReducer.bio,
            profile_img: userReducer.profile_img,
            status: userReducer.status,
        }
    });

    console.log('ini data ownPost:', ownPost);

    const getOwnPost = () => {
        let posty = localStorage.getItem('posty');

        if (posty) {
            axios.get(API_URL + '/post/ownpost', {
                headers: {
                    'Authorization': `Bearer ${posty}`
                }
            })
                .then((res) => {
                    setOwnPost(res.data)

                }).catch((err) => {
                    console.log(err);
                })
        }
    }

    React.useEffect(() => {
        getOwnPost();
    }, []);

    const printImage = () => {
        return ownPost.map(val => {
            return (
                <div id='posted' className='p-2' key={val.idposts}>
                    <img id='posted-img' src={API_URL + val.image} alt="" onClick={() => navigate(`/detail?idposts=${val.idposts}`, { state: val })} />
                </div>
            )
        })
    };

    return (
        <div>
            <Navbar />

            <div className='cotainer-fluid'>
                <div className='container'>
                    <div id='profile-page' className='w-75 mx-auto p-5'>
                        <div id='profile ' >
                            <div className='row mx-auto mt-3 '>
                                <div className='col-12 col-md-3'>
                                    <img id='profile-img' className='border border-light mx-auto' src={API_URL + profile_img} alt="" />
                                </div>

                                <div id='bio' className='col-12 col-md-6 mt-1'>
                                    <p className='lead fw-bold mx-auto'>{fullname}</p>
                                    <p className='fw-bold mx-auto'>{username}</p>
                                    <p className=' mx-auto'>{email}</p>
                                    <p className='mt-1  mx-auto'>{bio}</p>
                                    <button className=' mt-3 btn btn-outline-dark btn-sm' onClick={() => navigate('/setting')}>Edit Profile</button>
                                </div>
                            </div>
                        </div>

                        <div id='own-post' >
                            <div id='line' className='my-5'>
                                <hr />
                            </div>

                            {
                                ownPost.length > 0 ?

                                    <div id='images' >
                                        <div className='d-flex flex-wrap '>
                                            {printImage()}
                                        </div>
                                    </div>
                                    :

                                    <div id='empty-own-post' className='mx-auto'>
                                        <span className='text-violet' style={{fontSize: '200px'}}>
                                            <MdImageNotSupported />
                                        </span>
                                        <h1 className='text-muted py-4 ms-4'>You haven't post yet</h1>
                                    </div>

                            }

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default ProfilePage;
