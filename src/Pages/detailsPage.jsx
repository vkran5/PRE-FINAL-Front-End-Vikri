import React from 'react';
import Navbar from '../Components/NavbarComponent';
import axios from 'axios';
import { postAction } from '../actions/postsActions'
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../helper';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Moment from 'react-moment';
import {
    WrapItem,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    Textarea
} from '@chakra-ui/react';

const DetailPage = (props) => {

    const [detail, setDetail] = React.useState([]);
    const [comments, setComent] = React.useState([])
    const [likesData, setLikesData] = React.useState([])
    const [comment, setComment] = React.useState('');
    const [updateCaption, setUpdateCaption] = React.useState('');
    const [load, setLoad] = React.useState('d-block');
    const [toggleCap, setToggleCap] = React.useState(false);
    const [likeBtn, setLikeBtn] = React.useState(<FaRegHeart />)

    const { state, search } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const { idusers } = useSelector(({ userReducer }) => {
        return {
            idusers: userReducer.idusers
        }
    });

    React.useEffect(() => {
        getComment();
        getDetail();
        getLikes();
    }, []);

    const printDetail = () => {
        return detail.map(val => {
            return (
                <div className='container mb-5' key={val.idposts}>

                    <div id='detail-page'>
                        {/*Div 1  */}
                        <div id='img-post' className=' bg-dark border-end-0'>
                            <img className='post-detail' src={API_URL + val.image} alt="" />
                        </div>

                        {/* Div 2 */}
                        <div id='caption-post' className='bg-white border-start-0 rounded border'>
                            <div id='profile-post' className='p-2 d-flex justify-content-between'>
                                <div className='d-flex justify-content-between '>
                                    <img className='profile-img mt-2' src={API_URL + val.profile_img} alt="" />
                                    <div>
                                        <h1 className='username fw-bold'>{val.username}</h1>
                                        <p className="p-2 text-muted ms-1 mt-1" style={{ fontSize: '12px' }}><Moment fromNow>{val.date}</Moment></p>
                                    </div>
                                </div>

                                {
                                    detail[0].user_id == idusers ?
                                        <>
                                            <WrapItem >
                                                <Menu id='menu-nav' className='p-5 mt-5'>
                                                    <MenuButton className='mx-2'>
                                                        <HiOutlineDotsHorizontal style={{ fontSize: '20px' }} />
                                                    </MenuButton>

                                                    <MenuList >
                                                        <MenuItem className='text-muted' onClick={() => setToggleCap(!toggleCap)}>Edit Caption</MenuItem>
                                                        <MenuItem className='text-danger' onClick={() => onDeletePost(detail[0].idposts)}>Delete</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </WrapItem>
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <hr className='text-muted' />
                            <div id='scroll'>

                            </div>

                            <div id='detail-caption'>
                                <p className='p-3'>{detail[0].caption}</p>
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
                                                <button className='text-white btn btn-violet' mr={3} onClick={() => onUpdateCaption()}>
                                                    Update Caption
                                                </button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </>
                            </div>

                            <div id='actions' className='px-3 pt-2 d-flex'>
                                <span className='pe-2' style={{ fontSize: '28px' }} onClick={() => onLikePost()}> {likeBtn} </span>
                                <span className='pe-2' style={{ fontSize: '26px' }} > <FaRegComment /> </span>
                            </div>

                            <div id='likes'>
                                <p className='text-muted fw-bold pt-2 px-3'>{likesData.length} likes</p>
                            </div>

                            <div id='comments' className='px-3'>

                                {printComents()}
                                {
                                    comments.length < 5 ? null : <p className={`text-muted py-2 ${load}`} onClick={loadComment}>See More . . .</p>
                                }
                                
                                <div id='add-comments' className='d-flex flex-column'>
                                    <Textarea
                                        className='bg-white'
                                        id='comment-area'
                                        maxLength='300'
                                        value={comment}
                                        onChange={(e)=> setComment(e.target.value) }
                                        placeholder='Write something'
                                        size='sm'
                                    />

                                    <button id='btn-comment' className='btn-violet text-white' onClick={addComment}>
                                        Send
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            )
        })
    };

    const getDetail = () => {
        axios.get(API_URL + `/post/detail/${state.idposts}`)
            .then(res => {
                setDetail(res.data)
            }).catch(err => {
                console.log(err);
            })
    };

    const getComment = () => {
        axios.get(API_URL + `/post/comment/${state.idposts}`)
            .then(res => {
                setComent(res.data)
            }).catch(err => {
                console.log(err);
            })
    };

    const loadComment = () => {
        axios.get(API_URL + `/post/loadcomment/${state.idposts}`)
            .then(res => {
                setLoad('d-none')
                setComent(res.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const addComment = () => {
        axios.post(API_URL + `/post/add/comment/`, {
            user_id: idusers,
            post_id: state.idposts,
            comment
        })
            .then(res => {
                setComment('');
                setLoad('d-block')
                
                if (comments.length > 5) {
                    loadComment();
                } else {
                    getComment();
                }
            }).catch(err => {
                console.log(err);
            })
    };

    const getLikes = () => {
        axios.get(API_URL + `/post/getlikes/${state.idposts}`)
            .then(res => {
                setLikesData(res.data)
                let idx = res.data.findIndex(val => val.user_id == idusers);
                if (idx >= 0) {
                    setLikeBtn(<FcLike />);
                } else {
                    setLikeBtn(<FaRegHeart />);
                }

            }).catch(err => {
                console.log(err);
            })
    };

    const onLikePost = () => {

        let idx = likesData.findIndex(val => val.user_id === idusers);

        if (idx < 0) {
            axios.post(API_URL + `/post/like`, {
                post_id: state.idposts,
                user_id: idusers
            }).then(res => {
                setLikeBtn(<FcLike />);
                getLikes();
                getDetail();
            }).catch(err => {
                console.log(err);
            })
        } else {
            axios.delete(API_URL + `/post/unlike/${likesData[idx].idlikes}`)
                .then(res => {
                    setLikeBtn(<FaRegHeart />);
                    getLikes();
                    getDetail();
                }).catch(err =>
                    console.log(err));
        }
    };

    const printComents = () => {
        let display = comments.map(val => {
            return (
                <div id='comment'>
                    <div>
                        <p className='fw-bold'>{val.username} <span className='fw-light'>{val.comment}</span></p>
                        <p className='text-muted' style={{ fontSize: '12px' }}><Moment fromNow>{val.date}</Moment></p>
                    </div>
                </div>
            )

        })
        return display;
    };

    const onUpdateCaption = () => {
        axios.patch(API_URL + `/post/edit/` + state.idposts, {
            caption: updateCaption
        })
            .then(res => {
                if (res.data.success) {
                    dispatch(postAction(res.data))
                    getDetail();
                    getComment();
                    setToggleCap(!toggleCap);
                    toast({
                        title: `Caption has been updated`,
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

    const onDeletePost = (idpost) => {
        axios.delete(API_URL + `/post/${idpost}`)
            .then((res) => {
                dispatch(postAction(res.data));
                navigate('/home', { replace: true })
                toast({
                    title: `Content has been deleted`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }).catch(err => {
                console.log(err);
            })
    };

    return (
        <div>
            <Navbar />
            <div className='container-fluid bg-light' style={{ height: "100vh" }}>
                {printDetail()}
            </div>

        </div>
    )
}

export default DetailPage;