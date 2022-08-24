import React from 'react';
import { VscCircleSlash } from "react-icons/vsc";
import { FaUserCheck } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../actions/usersAction';
import axios from 'axios';
import { API_URL } from '../helper';
import Navbar from '../Components/NavbarComponent';

const VerificationPage = () => {

    const [userIndex, setUserIndex] = React.useState('');

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getData = () => {
        axios.get(API_URL + '/auth/all')
            .then(res => {
                let findUser = res.data.findIndex(val => val.verification == params.token);
                console.log(findUser);
                setUserIndex(findUser);
            }).catch(err => {
                console.log(err);
            })
    };

    React.useEffect(() => {
        getData()
    }, []);

    const handleVerification = async () => {
        try {
            let res = await axios.patch(API_URL + `/auth/verify`, {}, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            })

            if (res.data.success) {
                localStorage.setItem('posty', res.data.dataLogin.token);
                delete res.data.dataLogin.token;
                dispatch(loginAction(res.data.dataLogin));
                navigate('/home')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='verify'>
            <Navbar />
            <div className='pt-5'>
                <div className='pt-5'>
                    {
                        userIndex >= 0 ?
                            <div className='d-flex flex-column align-items-center'>
                                <h1 className="lead text-violet pt-5" style={{ fontSize: "50px" }}>Verification Success</h1>
                                <span className="material-icons my-3 text-violet pt-5" style={{ fontSize: "200px" }}>
                                    <FaUserCheck />
                                </span>
                                <h5 className='text-muted text-center pt-4'>
                                    Verification Success, Now you can access all the features. Hit get Started button!
                                </h5>
                                <button
                                    id='verif-btn'
                                    className='btn btn-violet text-white mt-3 me-4'
                                    type='button'
                                    onClick={handleVerification}
                                >
                                    Get Started
                                </button>
                            </div>
                            :

                            <div id='verify' className='container main-page'>
                                <div className='d-flex flex-column align-items-center pt-5'>
                                    <h1 className="lead text-violet pt-5" style={{ fontSize: "50px" }}>Verification Failed</h1>
                                    <span className="material-icons my-3 text-violet pt-2" style={{ fontSize: "200px" }}>
                                        <VscCircleSlash />
                                    </span>
                                    <h5 className='text-muted text-center pt-4'>
                                        Verification link has been expired. We suggest you to check your newest email that we sent.
                                    </h5>
                                </div>
                            </div>
                    }

                </div>

            </div>

        </div>
    )

}

export default VerificationPage;