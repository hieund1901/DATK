import { PropsWithoutRef } from "react";
import "./style.css";

const HomeView = (
  props: PropsWithoutRef<{
    user: { userId: string; userName: string };
  }>
) => {
  const {
    user: { userId, userName },
  } = props;
  return (
    <div id="main-home-view" className="container">
      <div className="content">
        <div className="user-info">
          <div>ID: {userId}</div>
          <div>Name: {userName}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
