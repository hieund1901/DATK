import { useQuery } from "../../hooks";

const AuthLogout = () => {
  const query = useQuery();
  const redirectAfterLogout = query.get("redirectTo");
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function logOut() {
    if (
      localStorage.getItem("userId") &&
      localStorage.getItem("userId") !== ""
    ) {
      const authId = localStorage.getItem("authId");
      const userId = localStorage.getItem("userId");
      localStorage.clear();
      fetch(
        `${process.env.REACT_APP_ENDPOINT}/auth/logout?authId=${authId}&userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    await sleep(5000);
    if (redirectAfterLogout && redirectAfterLogout != "") {
      window.location.replace(`${redirectAfterLogout}`);
    }
  }
  logOut();
  return (
    <div id="main-home-view" className="container">
      <div className="content">
        <div className="user-info">
          <div>Logged out</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogout;
