import React, { useState } from "react";
import "./chatlist.css";
import defaultImage from '../../../assets/default_image.jpg';


const Chatlist = () => {
  return (
    <div className="chatlist">
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Austin Smith</span>
          <p>Absolutely. Let’s destroy it 🔥</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
        <img src={defaultImage} alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>David Miller</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
        <img src={defaultImage} alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Sophia Taylor</span>
          <p>Wassup</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
        <img src={defaultImage} alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Alex Taylor</span>
          <p>Nice!</p>
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
