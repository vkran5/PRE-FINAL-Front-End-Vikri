import React from 'react';
import axios from 'axios';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { API_URL } from '../helper';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../actions/usersAction';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    useToast,
    Spinner
} from '@chakra-ui/react'

const RegisPage = (props) => {

    // Registration State 
    const [userData, setUserData] = React.useState([]);
    const [_username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordStrength, setPasswordStrength] = React.useState('');
    const [passwordIndicator, setPasswordIndicator] = React.useState('');
    const [passwordDisplay, setPasswordDisplay] = React.useState('password');
    const [confirmPasswordDisplay, setConfirmPasswordDisplay] = React.useState('password');
    const [regisThrotling, setRegisThrotling] = React.useState('Create Account');
    const [passwordIcon, setPasswordIcon] = React.useState(<FaEye />);
    const [confirmPasswordIcon, setConfirmPasswordIcon] = React.useState(<FaEye />);
    const [creatBtn, setCreateBtn] = React.useState(false);

    // Login State
    const [login, setLogin] = React.useState('');
    const [passwordLogin, setPasswordLogin] = React.useState('');
    const [passwordDisplayLogin, setPasswordDisplayLogin] = React.useState('password');
    const [passwordIconLogin, setPasswordIconLogin] = React.useState(<FaEye />);
    const [loginBtn, setLoginBtn] = React.useState(false);
    const [loginThrotle, setLoginThrotle] = React.useState('Login');

    const toast = useToast();
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();


    const getData = () => {
        axios.get(API_URL + '/auth/all')
            .then(res => {
                setUserData(res.data)
            }).catch(err => {
                console.log(err);
            })
    };

    React.useEffect(() => {
        getData()
    }, []);

    const createPassword = (e) => {
        let passChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setPassword(e.target.value);

        if (password.length < 4 || !password.match(passChecker)) {
            setPasswordStrength('Weak Password')
            setPasswordIndicator('text-danger')
        } else if (password.length >= 7 && password.length <= 9 && password.match(passChecker)) {
            setPasswordStrength('Medium Password')
            setPasswordIndicator('text-warning')
        } else if (password.length >= 10 && password.match(passChecker)) {
            setPasswordStrength('Strong Password')
            setPasswordIndicator('text-primary')
        } 
    };

    const onRegister = () => {
        let passChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let usernameValidation = false;
        let passwordValidation = false;
        let emailValidation = false;
        let getEmail = [];

        // username 
        if (userData.length > 0) {
            let userIdx = userData.findIndex(val => val.username == _username);

            if (userIdx < 0) {
                usernameValidation = true;
            } else {
                setCreateBtn(false);
                setRegisThrotling('Create Account')
                toast({
                    title: `Username already exists`,
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }
        } else {
            usernameValidation = true
        };

        // emailCheck
        if (userData.length > 0) {
            let userIdx = userData.findIndex(val => val.email == email);

            if (userIdx < 0) {
                getEmail.push(true);
            } else {
                getEmail.push(false);
                setCreateBtn(false);
                setRegisThrotling('Create Account')
                toast({
                    title: `Email already exists`,
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }
        } else {
            getEmail.push(true);
        };

        if (email.includes('@') && email.includes('.com')) {
            getEmail.push(true);
        } else {
            getEmail.push(false);
            setCreateBtn(false);
            setRegisThrotling('Create Account')
            toast({
                title: `Wrong email format`,
                description: "Insert a proper email format.",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }

        if (getEmail.includes(false)) {
            emailValidation = false;
        } else {
            emailValidation = true;
        };


        // Password check
        if (password.match(passChecker) && password === confirmPassword) {
            passwordValidation = true;
        } else {
            passwordValidation = false;
            setRegisThrotling('Create Account')
            setCreateBtn(false);
            toast({
                title: `Please Check Your Password`,
                description: "Password contain uppercase, lowercase, number, symbol and password confirmaion must be same.",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
        }

        if (passwordValidation && usernameValidation && emailValidation) {

            axios.post(API_URL + '/auth/register', {
                username: _username,
                email,
                password,
            })
                .then(res => {
                    if (res.data.success) {
                        toast({
                            title: `Congratulations account has been created`,
                            description: 'Please check your email to verify your account.',
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                            position: 'top'
                        });
                        setRegisThrotling('Create Account')
                        setCreateBtn(false);
                        setPasswordStrength('');
                        setConfirmPassword('');
                        setPassword('');
                        setEmail('');
                        setUsername('');
                        getData();
                    }

                }).catch(err => {
                    console.log(err);
                })
        }
    }

    const onLogin = () => {
        let insert = {};
        if (login.includes('@') && login.includes('.com')) {
            insert = {
                email: login,
                password: passwordLogin
            }
        } else {
            insert = {
                username: login,
                password: passwordLogin
            }
        }

        axios.post(API_URL + `/auth/login`, insert)
            .then(res => {
                if (res.data.idusers) {
                    localStorage.setItem('posty', res.data.token);
                    delete res.data.token;
                    dispatch(loginAction(res.data));
                    navigate('/home', { replace: true });
                    setLoginBtn(false);
                    setLoginThrotle('Login')
                } else {
                    console.log(false);
                }

            }).catch(err => {
                setLoginBtn(false);
                setLoginThrotle('Login')
                toast({
                    title: `Please check your email or esername and password`,
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            })

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

    const onShowPasswordLogin = () => {
        if (passwordDisplayLogin === 'password') {
            setPasswordDisplayLogin('text')
            setPasswordIconLogin(FaEyeSlash)
        } else if (passwordDisplayLogin === 'text') {
            setPasswordDisplayLogin('password')
            setPasswordIconLogin(FaEye)
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

    return (
        <div>
            <div className='d-flex'>
                <div className='col-lg-7 bg-register ' style={{ height: '100vh', zIndex: '5' }}>
                    <div id='circle-wrapper' className='mx-auto'>
                        <div id='glass' className='bg-glass'>
                            <img id='cover' src="/cover.png" alt="" />
                        </div>

                        <div id='text'>
                            <h2 className='fw-bold text-white lead'>Your new friends is waiting for you</h2>
                            <h3 className='fw-bold text-white display-6 lead'>Join Posty ✌</h3>
                        </div>

                        <div id='emoji-love'>
                            <p style={{ fontSize: '32px' }}>❤</p>
                        </div>

                        <div id='emoji-100'>
                            <p style={{ fontSize: '22px' }}>💯</p>
                        </div>

                        <div id='emoji-thumbs'>
                            <p style={{ fontSize: '24px' }}>👍</p>
                        </div>

                        <div id='emoji-wave'>
                            <p style={{ fontSize: '24px' }}>👋</p>
                        </div>
                    </div>
                </div>

                <div className='col-lg-5  p-5'>
                    <div className='mx-5 p-5'>
                        <div className='p-4'>
                            <div className='py-5'>
                                <div className='mx-2 p-5'>
                                    <h1 className='fw-bold lead display-4' style={{ fontSize: '32px' }}>Sign Up</h1>

                                    <input className='form-control my-3' size='sm' type="text" value={_username} placeholder='Username' onChange={(e) => setUsername(e.target.value)} />

                                    <input className='form-control my-3' size='sm' type="text" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />

                                    <div className='input-group my-3'>
                                        <input className='form-control' size='sm' placeholder='8 + Characters' type={passwordDisplay} value={password} onChange={createPassword} />
                                        <span className='input-group-text text-muted bg-transparent' onClick={onShowPassword}>{passwordIcon}</span>
                                    </div>

                                    <div className='input-group my-3'>
                                        <input className='form-control' size='sm' placeholder='Confirm Password' value={confirmPassword} type={confirmPasswordDisplay} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        <span className='input-group-text text-muted bg-transparent border-left-0' onClick={onShowConfirmPassword}>{confirmPasswordIcon}</span>
                                    </div>

                                    <div className='text-center'>
                                        <p className={passwordIndicator} style={{ fontSize: "14px" }} value={passwordStrength}>{passwordStrength}</p>
                                    </div>

                                    <button className='btn w-100 btn-violet text-white mb-2  mt-3' disabled={creatBtn} onClick={() => { setTimeout(onRegister, 1000); setCreateBtn(true); setRegisThrotling(<Spinner size='xs' />) }}>{regisThrotling}</button>
                                    <p className='fw-bold text-muted text-center me-2'>OR</p>
                                    <button className='btn w-100 btn-violet text-white mt-2' onClick={onOpen}>Log In</button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent className="p-3 ">
                        <ModalHeader>Login</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <label className='fw-bold text-oswald mt-3' style={{ fontSize: '12px' }}>Email or Username</label>
                            <Input className='form-control' size='sm' type="text" placeholder='Email or Username' onChange={(e) => { setLogin(e.target.value); console.log(login) }} />

                            <label className='fw-bold text-oswald mt-3' style={{ fontSize: '12px' }}>Password</label>
                            <div className='input-group '>
                                <Input className='form-control' size='sm' placeholder='8+ Characters' type={passwordDisplayLogin} onChange={(e) => { setPasswordLogin(e.target.value); console.log(passwordLogin) }} />
                                <span className='input-group-text text-muted bg-transparent' onClick={onShowPasswordLogin} >{passwordIconLogin}</span>
                            </div>
                        </ModalBody>

                        <a className='ms-4 text-primary' href="/forgot">Forgot Password?</a>

                        <ModalFooter>
                            <button className='text-white btn btn-violet' disabled={loginBtn} mr={3} onClick={() => { setTimeout(onLogin, 2000); setLoginThrotle(<Spinner size='xs' />); setLoginBtn(true); }}>
                                {loginThrotle}
                            </button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    );
}

export default RegisPage;