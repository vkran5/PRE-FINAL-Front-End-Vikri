import './App.css';
import React from 'react';
import RegisPage from './Pages/regisPage';
import ProfilePage from './Pages/profilePage';
import LikedPost from './Pages/likedPost';
import MainPage from './Pages/mainPages';
import DetailPage from './Pages/detailsPage';
import EditProfilPage from './Pages/editProfilePage';
import ResetPasswordPage from './Pages/resetPasswordPage';
import ForgotPasswordPage from './Pages/forgotPasswordPage';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import { API_URL } from './helper';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from './actions/usersAction';
import VerificationPage from './Pages/verificationPage';

function App() {

  const dispatch = useDispatch();
  const { username } = useSelector(({ userReducer }) => {
    return {
      username: userReducer.username
    }
  })

  const keepLogin = () => {
    let posty = localStorage.getItem('posty');

    if (posty) {
      axios.get(API_URL + '/auth/keep', {
        headers: {
          'Authorization': `Bearer ${posty}`
        }
      })
        .then((res) => {
          if (res.data.idusers) {
            localStorage.setItem('posty', res.data.token);
            delete res.data.token;
            dispatch(loginAction(res.data));

          }

        }).catch((err) => {
          console.log(err);
        })
    }
  }

  React.useEffect(() => {
    keepLogin()
  }, [])

  return (
    <div>
      <Routes>
        <Route path='/' element={username ? <Navigate to='/home' replace/> : <RegisPage />} />
        <Route path='/verification/:token' element={<VerificationPage />} />
        <Route path='/reset/:token' element={<ResetPasswordPage />} />
        <Route path='/forgot' element={<ForgotPasswordPage/>}/>
        {
          username ?
            <>
              <Route path='/home' element={<MainPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/liked' element={<LikedPost />} />
              <Route path='/detail' element={<DetailPage />} />
              <Route path='/setting' element={<EditProfilPage />} />
            </>
            :
            null
        }
      </Routes>
    </div>
  );
}

export default App;
