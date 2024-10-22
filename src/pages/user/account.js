import Login from '@/components/Login'
import Button from '@/components/UI/Button';
import User from '@/components/User'
import { getUserData } from '@/store/LocalStorage';
import React from 'react'

const profile = () => {
  const userPresent = getUserData() ? true : false;
  const logoutHandler = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      {userPresent ? <User /> : <Login />}
      <div className="flex justify-end">
        <Button
          onClick={logoutHandler}
          text="Logout"
        />
      </div>
    </>
  )
}

export default profile;
