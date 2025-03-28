import React, { useState } from "react";
import "./chatlist.css";

const Chatlist = () => {
  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
      <div className="item">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="texts">
          <span>Adam Smith</span>
          <p>Hey! How are you?</p>
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
