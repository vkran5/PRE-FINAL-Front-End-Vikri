import React from "react";
import Navbar from '../Components/NavbarComponent';
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import { postAction } from '../actions/postsActions'
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import { FaUserAltSlash } from "react-icons/fa";
import { API_URL } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaRegPlusSquare, FaHome } from "react-icons/fa";
import { RiUserSettingsLine, RiUser3Line, RiHome2Line } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Moment from 'react-moment';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    WrapItem,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    ButtonGroup
} from '@chakra-ui/react';

const MainPage = () => {

    const [postData, setPostData] = React.useState([]);
    const [offset, setOffset] = React.useState(1);
    const [image, setImage] = React.useState('');
    const [caption, setCaption] = React.useState('');
    const [updateCaption, setUpdateCaption] = React.useState('');
    const [toggle, setToggle] = React.useState(false);
    const [toggleCap, setToggleCap] = React.useState(false);
    const [toggleDelete, setToggleDelete] = React.useState(false);
    const [uploading, setUploading] = React.useState('');
    const [loadMore, setLoadMore] = React.useState(<Spinner size='sm' color='purple.500' />);
    const [selectedData, setSelectedData] = React.useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const { idusers, status } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers,
            status: userReducer.status
        }
    });

    React.useEffect(() => {
        getPost()
    }, []);

    const getPost = () => {
        axios.get(API_URL + '/post')
            .then(res => {
                dispatch(postAction(res.data));
                setPostData(res.data);
            }).catch(err => {
                console.log(err);
            })
    };

    const fetchData = () => {
        axios.get(API_URL + `/post/load/${offset * 3}/3`)
            .then(res => {
                setPostData([...postData, ...res.data]);
                setOffset(offset + 1)

                if (res.data.length < 3) {
                    setLoadMore('You have seen it all')
                }
            }).catch(err => {
                console.log(err);
            })
    };

    const displayPost = () => {
        return (
            <div>
                <InfiniteScroll
                    dataLength={postData.length}
                    next={() => { setTimeout(fetchData, 1500) }}
                    hasMore={true}
                    loader={<p className="text-center text-muted">{loadMore}</p>}
                >
                    {
                        postData.map(val => {
                            return (
                                <div id='post' className=' border rounded bg-white  mb-3 pb-3' key={val.idposts}>

                                    <div id='profile-post' className="d-flex justify-content-between">
                                        <div className='p-2 d-flex'>
                                            <img className='profile-img' src={API_URL + val.profile_img} alt="" />
                                            <h1 className='username fw-bold'>{val.username}</h1>
                                        </div>

                                        <div className="p-2 pt-3 pe-3">
                                            {
                                                val.user_id == idusers ?
                                                    <>
                                                        <WrapItem >
                                                            <Menu id='menu-nav' className='p-5 mt-5'>
                                                                <MenuButton className='mx-2'>
                                                                    <HiOutlineDotsHorizontal style={{ fontSize: '20px' }} />
                                                                </MenuButton>

                                                                <MenuList >
                                                                    <MenuItem className='text-muted' onClick={() => {
                                                                        setSelectedData(val);
                                                                        setToggleCap(!toggleCap)
                                                                    }}>
                                                                        Edit Caption
                                                                    </MenuItem>
                                                                    
                                                                    <MenuItem className='text-danger' onClick={() => {
                                                                        setSelectedData(val);
                                                                        setToggleDelete(!toggleDelete);
                                                                    }}>
                                                                        Delete
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </WrapItem>
                                                        <>
                                                            <Modal isOpen={toggleDelete} onClose={() => setToggleDelete(!toggleDelete)}>
                                                                <ModalOverlay />
                                                                <ModalContent>
                                                                    <ModalHeader>Are you sure to delete this content?</ModalHeader>
                                                                    <ModalFooter>
                                                                        <ButtonGroup>
                                                                        <Button type='button' 
                                                                                onClick={() => onDeletePost(selectedData.idposts)}
                                                                                colorScheme='red'
                                                                            >
                                                                                Yes
                                                                            </Button>

                                                                            <Button type='button'
                                                                                onClick={() => {setToggleDelete(!toggleDelete);}}
                                                                                colorScheme='green'
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            
                                                                        </ButtonGroup>
                                                                    </ModalFooter>
                                                                </ModalContent>
                                                            </Modal>
                                                        </>
                                                        
                                                        <>
                                                            <Modal className='bg-register' isOpen={toggleCap} onClose={() => setToggleCap(!toggleCap)} size='xl'>
                                                                <ModalOverlay />
                                                                <ModalContent className="p-3">
                                                                    <ModalHeader>Edit Caption</ModalHeader>
                                                                    <ModalCloseButton />
                                                                    <ModalBody >
                                                                        <div >
                                                                            <div className='mx-auto'>
                                                                                <label className="form-label fw-bold text-muted">Caption</label>
                                                                                <textarea className='form-control' cols="30" rows="5" style={{ height: '238px' }} onChange={(e) => setUpdateCaption(e.target.value)}></textarea>
                                                                            </div>
                                                                        </div>
                                                                    </ModalBody>

                                                                    <ModalFooter>
                                                                        <Button className='text-white btn btn-violet' mr={3} onClick={() => onUpdateCaption(selectedData.idposts)}>
                                                                            Update Caption
                                                                        </Button>
                                                                    </ModalFooter>
                                                                </ModalContent>
                                                            </Modal>
                                                        </>
                                                    </>
                                                    :

                                                    <WrapItem >
                                                        <Menu id='menu-nav' className='p-5 mt-5'>
                                                            <MenuButton className='mx-2'>
                                                                <HiOutlineDotsHorizontal style={{ fontSize: '20px' }} />
                                                            </MenuButton>

                                                            <MenuList >
                                                                <MenuItem className='text-muted' onClick={() => setToggleCap(!toggleCap)}>Share Content</MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    </WrapItem>
                                            }

                                        </div>
                                    </div>

                                    <div id='image-content' >
                                        <img id='content-img' className=' pt-2 mx-auto' src={API_URL + val.image} alt="" />
                                    </div>

                                    <div id='actions' className="d-flex justify-content-between">
                                        <p className='p-2 fw-bold text-muted'>{val.likes} Likes</p>
                                        <p className="p-2 text-muted"> <Moment fromNow>{val.date}</Moment> </p>
                                    </div>

                                    <div id='captions' className='px-2 '>
                                        <div className="d-flex justify-content-between">
                                            <p className='fw-bold'>{val.username} <span className="fw-light">{val.caption}</span></p>
                                            <button className='btn btn-sm btn-violet text-white fw-bold my-2' onClick={() => navigate(`/detail?idposts=${val.idposts}`, { state: val })}>See details</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </InfiniteScroll>
            </div>
        )


    };

    const onPost = () => {
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            user_id: idusers,
            caption
        }));

        formData.append('image', image);

        axios.post(API_URL + '/post', formData)
            .then(res => {
                if (res.data.success) {
                    setUploading('')
                    dispatch(postAction(res.data));
                    setLoadMore(<Spinner size='sm' color='purple.500' />)
                    getPost();
                    setOffset(1);
                }

            }).catch(err => {
                console.log(err);
            })

    };

    const onDeletePost = (idpost) => {
        axios.delete(API_URL + `/post/${idpost}`)
            .then((res) => {
                dispatch(postAction(res.data));
                getPost();
                setLoadMore(<Spinner size='sm' color='purple.500' />);
                setOffset(1)
                setToggleDelete(!toggleDelete)
                setSelectedData(null);
                toast({
                    title: `Content has been deleted`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            })
    };

    const onUpdateCaption = (idpost) => {
        console.log(idpost);
        axios.patch(API_URL + `/post/edit/` + idpost, {
            caption: updateCaption
        })
            .then(res => {
                console.log(res.data.success);
                if (res.data.success) {
                    setToggleCap(!toggleCap)
                    getPost();
                    setOffset(1);
                    setSelectedData(null);
                }
            }).catch(err => {
                console.log(err);
            })
    };

    return (

        <div className='pb-5' >
            <Navbar />
            <div id='home-page' className='container-fluid '>
                {
                    status == 'VERIFIED' ?
                        <>
                            <div className='container'>
                                <div id='content-div' className='row'>
                                    <div id='menu-bar' className='col-2 d-none d-lg-flex border-end bg-white px-5 py-4 mb-4 d-flex flex-column'>
                                        <Button size='lg' className='text-black home pt-5 pb-3' leftIcon={<RiHome2Line />} colorScheme='white' variant='ghost' onClick={() => navigate('/home')}> Home </Button>
                                        <Button size='lg' className='text-black profile py-3' leftIcon={<RiUser3Line />} colorScheme='white' variant='ghost' onClick={() => navigate('/profile')} > Profile </Button>
                                        <Button size='lg' className='text-black liked py-3' leftIcon={<FaRegHeart />} colorScheme='white' variant='ghost' onClick={() => navigate('/liked')}> Liked </Button>
                                        <Button size='lg' className='text-black setting mb-3 py-3' leftIcon={<RiUserSettingsLine />} colorScheme='white' variant='ghost' onClick={() => navigate('/setting')}> Setting </Button>
                                        <hr className="my-4 line" />
                                        <button size='lg' className='btn btn-violet text-white post' onClick={() => setToggle(!toggle)} >Add Post </button>
                                    </div>

                                    <div id='content-post' className='col-11 col-md-8 col-lg-5 mx-auto'>
                                        <div className='d-lg-none btn-violet border rounded shadow px-5 py-4 mb-4 d-flex justify-content-evenly'>
                                            <Button className='text-white' leftIcon={<FaHome />} colorScheme='white' variant='ghost'>
                                                Home
                                            </Button>

                                            <Button className='text-white' leftIcon={<FaRegPlusSquare />} colorScheme='white' variant='ghost' onClick={() => setToggle(!toggle)}>
                                                Post
                                            </Button>
                                        </div>

                                        <div id='home-page-display' className="pb-5">
                                            <div >
                                                <p className="text-center">{uploading}</p>
                                            </div>
                                            {displayPost()}
                                        </div>
                                    </div>

                                    <div id='suggest-bar' className='col-2 d-none d-lg-block border-start bg-white px-5 py-4 mb-4'>

                                        <p className="pt-5 fw-bold">Trending for you</p><br />
                                        <div id="trending">
                                            <p className="pb-1 text-muted">#TheBatman🦇</p>
                                            <p className="pb-1 text-muted">#WebDevelopment</p>
                                            <p className="pb-1 text-muted">#Minions</p>
                                            <p className="pb-1 text-muted">#Arsenal</p>
                                            <p className="pb-1 text-muted">#Crypto</p>
                                            <p className="pb-1 text-muted">#RoadToWorldCup</p>

                                        </div>

                                        <div id="to_follow">
                                            <p className="fw-bold ">Who to follow</p><br />
                                            <div className='d-flex avatar '>
                                                <img className='profile-img' src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
                                                <div id="suggested" className="d-flex flex-column justify-content-evenly">
                                                    <h1 className='username fw-bold mb-1'>Dimas</h1>
                                                    <p className="suggested-text text-muted ps-2 " style={{ fontSize: '12px' }}>Followed by ivory</p>
                                                </div>
                                            </div>

                                            <div className='d-flex py-2 avatar '>
                                                <img className='profile-img' src="https://images.unsplash.com/photo-1584720175631-f9d3633a2e78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
                                                <div id="suggested" className="d-flex flex-column justify-content-evenly">
                                                    <h1 className='username fw-bold mb-1'>Rahma</h1>
                                                    <p className="suggested-text text-muted ps-2 " style={{ fontSize: '12px' }}>Followed by yessy</p>
                                                </div>
                                            </div>

                                            <div className='d-flex py-2 avatar '>
                                                <img className='profile-img' src="https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=486&q=80" alt="" />
                                                <div id="suggested" className="d-flex flex-column justify-content-evenly">
                                                    <h1 className='username fw-bold mb-1'>Haifa</h1>
                                                    <p className="suggested-text text-muted ps-2 " style={{ fontSize: '12px' }}>Followed by wayan</p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="suggested-text text-muted ps-2 " style={{ fontSize: '12px' }}>© 2022 POSTY PROJECT</p>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div id='verify' className='container main-page pt-5'>
                                <div className='d-flex flex-column align-items-center pt-5'>
                                    <h1 className="lead text-violet pt-5" style={{ fontSize: "100px" }}>Oops!</h1>
                                    <span className="material-icons my-3 text-violet pt-5" style={{ fontSize: "200px" }}>
                                        <FaUserAltSlash />
                                    </span>
                                    <h5 className='text-muted text-center'>
                                        Can't see the posts, your account hasn't verified yet
                                    </h5>
                                    <button
                                        type='button'
                                        outline
                                        className='my-5 text-white btn btn-violet'
                                        onClick={() => navigate('/setting', { replace: true })}
                                    >
                                        To Verification Page
                                    </button>
                                </div>
                            </div>
                        </>
                }

            </div>

            {/* Modal Post */}

            <>
                <Modal className='bg-register' isOpen={toggle} onClose={() => setToggle(!toggle)} size='xl'>
                    <ModalOverlay />
                    <ModalContent className="p-3">
                        <ModalHeader>Add Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <div >
                                <div className='mx-auto'>
                                    <input className='form-control m-auto mt-3' type='file' placeholder='URL image' onChange={(e) => setImage(e.target.files[0])} />
                                </div>

                                <div className='mx-auto'>
                                    <label className="form-label fw-bold text-muted">Caption</label>
                                    <textarea className='form-control' cols="30" rows="5" style={{ height: '238px' }} onChange={(e) => setCaption(e.target.value)}></textarea>
                                </div>

                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button className='text-white btn btn-violet' mr={3} onClick={() => { setToggle(!toggle); setTimeout(onPost, 1500); setUploading(<Spinner size='sm' color='purple.500' />) }}>
                                Post
                            </button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>

        </div>
    )
}

export default MainPage;