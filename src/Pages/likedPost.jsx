import React from 'react';
import Navbar from '../Components/NavbarComponent';
import { FaRegHeart } from "react-icons/fa";

import { MdImageNotSupported } from "react-icons/md";
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../helper';

const LikedPost = (props) => {

    const [likedData, setLikedData] = React.useState([])

    const navigate = useNavigate();

    React.useEffect(() => {
        getLikedPost()
    }, []);

    const getLikedPost = () => {
        let posty = localStorage.getItem('posty');

        axios.get(API_URL + `/post/liked`, {
            headers: {
                'Authorization': `Bearer ${posty}`
            }
        }).then(res => {
            console.log('ini data yang dilike:', res.data);
            setLikedData(res.data)
        }).catch(err => {
            console.log(err);
        })
    };

    const printPost = () => {
        return likedData.map(val => {
            return (
                <div id='posted' className='p-2'>
                    <img id='posted-img' src={API_URL + val.image} alt="" onClick={() => navigate(`/detail?idposts=${val.idposts}`, { state: val })} />
                </div>
            )
        })
    };

    return (
        <div>
            <Navbar />
            <div className='container  mx-auto p-5'>
                <div></div>
                <div id='saved-post' >

                    <div id='images' className='w-75 mx-auto'>
                        <Button id='post-page' className='text-black saved mb-3' leftIcon={<FaRegHeart />} colorScheme='white' variant='ghost'> Liked Post</Button>

                        {
                            likedData.length > 0 ?

                                <div className='d-flex flex-wrap'>
                                    {printPost()}
                                </div>
                                :

                                <div id='empty-liked-post' className='mx-auto'>
                                    <span className='text-violet' style={{ fontSize: '200px' }}>
                                        <MdImageNotSupported />
                                    </span>
                                    <h1 id='liked-text' className='text-muted py-4'>You haven't liked any post yet</h1>
                                </div>

                        }
                    </div>
                </div>
            </div>
        </div>)
}

export default LikedPost;