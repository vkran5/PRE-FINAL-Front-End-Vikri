import React from 'react';
import axios from 'axios';
import { API_URL } from '../helper';
import { useToast } from '@chakra-ui/react';
import { FaRegEnvelope } from "react-icons/fa";

const ForgotPasswordPage = (props) => {

    const [email, setEmail] = React.useState('');
    const [usersData, setUsersData] = React.useState([]);

    const toast = useToast();

    React.useEffect(() => {
        getData()
    }, []);

    const getData = () => {
        axios.get(API_URL + '/auth/all')
            .then(res => {
                setUsersData(res.data);
            }).catch(err => {
                console.log(err);
            })
    };

    const sendEmail = () => {
        let userIdx = usersData.findIndex(val => val.email == email);

        if (userIdx >= 0) {
            axios.get(API_URL + `/auth/reset/${usersData[userIdx].idusers}`)
                .then(res => {
                    if (res.data.success) {
                        setEmail('')
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

        } else {
            toast({
                title: `User Not Found`,
                description: 'Please make sure your email is correct',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }

    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <h1 className="lead text-violet pt-5" style={{ fontSize: "50px" }}>Reset Password</h1>
            <div id='input-email' className='col-lg-5 w-25 mx-auto border py-3' >
                <span id='envelope-icon' className="text-violet text-center pt-4" style={{ fontSize: "120px" }}>
                    <FaRegEnvelope />
                </span>
                <h5 className='text-muted text-center mt-3 px-5'>
                    Enter your email and we will send you a link to reset your password
                </h5>
                <div className='mx-5'>
                    <div className='px-4'>
                        <div>
                            <div className='mx-2 p-4'>
                                <div className='input-group my-3'>
                                    <input className='form-control' value={email} size='sm' placeholder='Email' onChange={(e) => { setEmail(e.target.value); console.log(email) }} />
                                    <span className='input-group-text text-muted bg-transparent' >@</span>
                                </div>

                                <button className='btn w-100 btn-violet text-white mb-2  mt-3' onClick={sendEmail}>Send</button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default ForgotPasswordPage;