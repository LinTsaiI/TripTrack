import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { changeAvatar, getAvatarRef } from '../../store/slice/userSlice';
import { asyncFetchTripList } from '../../store/slice/dashboardSlice';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import './Dashboard.css';
import defaultAvatar from '../../img/blank_profile_avatar.png';
import uploadImgIcon from '../../img/icons_camera.png';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const dashboardStates = useSelector(state => state.dashboard);
  const { tripList, isProcessing } = dashboardStates;
  const [openedTripCardOptionModal, setOpenedTripCardOptionModal] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const avatarFetchingClassName = user.avatar ? 'dashboard-avatar' : 'dashboard-avatar dashboard-avatar-loading-background';
  const processingLoadingClassName = isProcessing ? 'creating-new-trip' : 'display-none';

  useEffect(() => {
    dispatch(asyncFetchTripList(user.userId));
  }, []);

  useEffect(() => {
    if (user.avatar) {
      if (user.avatar == 'default') {
        setAvatar(defaultAvatar);
      } else {
        getDownloadURL(ref(storage, user.avatar))
          .then(url => {
            setAvatar(url);
          })
          .catch(err => {
            console.log('Something goes wrong', err);
          });
      }
    }
  }, [user.avatar]);

  const uploadAvatar = (e) => {
    const file = e.target.files[0];
    const avatarRef = ref(storage, `avatar/${user.userId}/${file.name}`);
    uploadBytes(avatarRef, file)
      .then(snapshot => {
        updateDoc(doc(db, 'user', user.userId), {
          avatar: snapshot.ref.fullPath
        });
        dispatch(changeAvatar(snapshot.ref.fullPath));
      })
      .catch(err => console.log('Something goes wrong', err));
    return false;
  }

  if (tripList) {
    return (
      <div>
        <div className='dashboard-container'>
          <div className={processingLoadingClassName}></div>
          <div className='dashboard-sidebar'>
            <div className={avatarFetchingClassName}>
              <img src={avatar} className='dashboard-avatar-img'/>
              <label htmlFor='avatar-img' className='upload'>
                <img src={uploadImgIcon}/>
              </label>
              <input type='file' id='avatar-img' accept='image/*' onChange={uploadAvatar}/>
            </div>
            <div className='dashboard-username'>{user.username}</div>
            <div className='dashboard-menu'>
              <div className='dashboard-menu-item'>My trips</div>
            </div>
            <button className='sign-out-btn' onClick={() => signOut(auth)}>Sign Out</button>
          </div>
          <div className='collections'>
            {
              tripList.map((trip, index) => {
                return <TripCard
                  key={index}
                  trip={trip}
                  index={index}
                  openedTripCardOptionModal={openedTripCardOptionModal}
                  setOpenedTripCardOptionModal={setOpenedTripCardOptionModal}
                />
              })
            }
            <div
              key={tripList.length}
              className='trip-card'
              onClick={() => setIsModalShown(true)}
            >
              <div className='new-trip'>
                <div className='plus-icon'>+</div>
              </div>
            </div>
          </div>
          {
            isModalShown ? <NewTrip openModal={setIsModalShown} /> : <div/>
          }
        </div>
        <Footer />
      </div>
    )
  }
}

export default Dashboard;