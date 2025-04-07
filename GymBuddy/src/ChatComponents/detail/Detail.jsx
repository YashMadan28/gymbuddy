import "./detail.css";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>Adam Smith</h2>
        <p>fjaklsfjlsdkfjkas....</p>
      </div>
      <div className="button-container">
        <button className="viewprofile-button">View Profile</button>
        <button className="deleteuser-button">Delete User</button>
      </div>
    </div>
  );
};

export default Detail;
