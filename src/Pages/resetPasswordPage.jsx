import React from 'react';
import { VscCircleSlash } from "react-icons/vsc";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../helper';
import { AiOutlineKey } from "react-icons/ai";
import { useToast, Spinner } from '@chakra-ui/react'

const ResetPasswordPage = () => {

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordStrength, setPasswordStrength] = React.useState('');
    const [passwordIndicator, setPasswordIndicator] = React.useState('');
    const [passwordDisplay, setPasswordDisplay] = React.useState('password');
    const [confirmPasswordDisplay, setConfirmPasswordDisplay] = React.useState('password');
    const [regisThrotling, setRegisThrotling] = React.useState('Reset Password');
    const [passwordIcon, setPasswordIcon] = React.useState(<FaEye />);
    const [confirmPasswordIcon, setConfirmPasswordIcon] = React.useState(<FaEye />);
    const [creatBtn, setCreateBtn] = React.useState(false);
    const [userData, setUserData] = React.useState([]);
    const [userIndex, setUserIndex] = React.useState(null);

    console.log(userData);

    const params = useParams();
    const toast = useToast();

    const getData = () => {
        axios.get(API_URL + '/auth/all')
            .then(res => {
                let findUser = res.data.findIndex(val => val.reset_password == params.token)
                setUserIndex(findUser)
                setUserData(res.data[findUser])
            }).catch(err => {
                console.log(err);
            })
    };

    React.useEffect(() => {
        getData()
    }, []);

    const createPassword = (e) => {
        setPassword(e.target.value);

        if (password.length < 4) {
            setPasswordStrength('Weak Password')
            setPasswordIndicator('text-danger')
        } else if (password.length <= 8) {
            setPasswordStrength('Medium Password')
            setPasswordIndicator('text-warning')
        } else if (password.length > 8) {
            setPasswordStrength('Strong Password')
            setPasswordIndicator('text-primary')
        }
    };

    const onShowPassword = () => {
        if (passwordDisplay === 'password') {
            setPasswordDisplay('text')
            setPasswordIcon(FaEyeSlash)
        } else if (passwordDisplay === 'text') {
            setPasswordDisplay('password')
            setPasswordIcon(FaEye)
        }
    };

    const onShowConfirmPassword = () => {
        if (confirmPasswordDisplay === 'password') {
            setConfirmPasswordDisplay('text')
            setConfirmPasswordIcon(FaEyeSlash)
        } else if (confirmPasswordDisplay === 'text') {
            setConfirmPasswordDisplay('password')
            setConfirmPasswordIcon(FaEye)
        }
    };

    const onResetPassword = () => {
        let passChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let passwordValidation = false;

        // Password check
        if (password.match(passChecker) && password === confirmPassword) {
            passwordValidation = true;
        } else {
            passwordValidation = false;
            toast({
                title: `Please Check Your Password`,
                description: "Password contain uppercase, lowercase, number, symbol and password confirmaion must be same.",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            setRegisThrotling('Reset Password');
            setCreateBtn(false);
            setCreateBtn(false);
        }

        if (passwordValidation) {

            axios.patch(API_URL + `/auth/reset`, { password }, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            }).then(res => {
                if (res.data.success) {
                    setPassword('');
                    setConfirmPassword('');
                    setRegisThrotling('Reset Password');
                    setCreateBtn(false);
                    setCreateBtn(false);
                    toast({
                        title: `Reset Password Success`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top'
                    })
                }
            }).catch(err => {
                console.log(err);
                setRegisThrotling('Reset Password');
                setCreateBtn(false);
                setCreateBtn(false);
            })
        }
    };

    return (
        <div id='verify'>
            <div >
                <div>
                    {
                        userIndex >= 0 ?
                            <div className='d-flex flex-column align-items-center'>
                                <h1 className="lead text-violet pt-5" style={{ fontSize: "50px" }}>Reset Password</h1>
                                <div id='input-email' className='col-lg-5 w-25 mx-auto border py-3' >
                                    <span id='envelope-icon' className="text-violet text-center pt-4" style={{ fontSize: "120px" }}>
                                        <AiOutlineKey />
                                    </span>
                                    <h5 className='text-muted text-center mt-3 px-5 mx-3'>
                                        Enter your new password to get your new password
                                    </h5>
                                    <div className='mx-5'>
                                        <div className='px-4'>
                                            <div className='px-1'>
                                                <input className='form-control my-3' size='sm' type="text" placeholder='Username' value={userData.username} disabled={true} />
                                                <input className='form-control my-3' size='sm' type="text" placeholder='Email' value={userData.email} disabled={true} />

                                                <div className='input-group my-3'>
                                                    <input className='form-control' size='sm' placeholder='8 + Characters' value={password} type={passwordDisplay} onChange={createPassword} />
                                                    <span className='input-group-text text-muted bg-transparent' onClick={onShowPassword}>{passwordIcon}</span>
                                                </div>

                                                <div className='input-group my-3'>
                                                    <input className='form-control' size='sm' placeholder='Confirm Password' value={confirmPassword} type={confirmPasswordDisplay} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                    <span className='input-group-text text-muted bg-transparent' onClick={onShowConfirmPassword}>{confirmPasswordIcon}</span>
                                                </div>

                                                <div className='text-center'>
                                                    <p className={passwordIndicator} style={{ fontSize: "14px" }}>{passwordStrength}</p>
                                                </div>

                                                <button className='btn w-100 btn-violet text-white mb-2  mt-3' disabled={creatBtn} onClick={() => { setTimeout(onResetPassword, 1000); setCreateBtn(true); setRegisThrotling(<Spinner size='xs' />) }}>{regisThrotling}</button>
                                                <a className='text-primary' href="/">Login</a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            :

                            <div id='verify' className='container main-page'>
                                <div className='d-flex flex-column align-items-center pt-5'>
                                    <h1 className="lead text-violet pt-5" style={{ fontSize: "50px" }}>Reset Password Failed</h1>
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
    );

}

export default ResetPasswordPage;