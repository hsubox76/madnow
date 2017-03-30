import React from 'react';

const MyStuff = (props) => (
  <div className="profile-page">
    <div>Your email: {props.user.email}</div>
  </div>
);

export default MyStuff;
