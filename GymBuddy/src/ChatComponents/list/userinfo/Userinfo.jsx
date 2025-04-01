import "./userinfo.css";

const Userinfo = () => {
  return (
    <div className="userinfo">
      <div className="user">
        <div className="avatar-wrapper">
          <img src="./avatar.png" alt="" />
          <div className="online-marker"></div>
        </div>
        <div className="name-position">
          <h2>John Smith</h2>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
