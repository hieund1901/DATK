import {LoadingOutlined} from "@ant-design/icons";
import {Layout, message, Spin} from "antd";
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory} from "react-router-dom";
import "./App.css";
import HomeView from "./components/HomeView";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ResetPasswordForm from "./components/ResetPassword";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import AuthForm from "./components/AuthForm";
import PageUser from './components/PageUser';
import UserDetail from './components/UserDetail';
import {useAppDispatch, useAppSelector} from "./hooks";
import {fetchMe, setUserAction} from "./redux/slices/user.slice";
import AuthLogout from "./components/AuthLogout";
import ActiveAcount from "./components/ActiveAccount";
import UserProfile from "./components/UserProfile/index";
import APIHistoryDetail from "./components/APIHistoryDetail";
import APIHistory from "./components/APIHistory";
import {useEffect} from "react";
import ForgetPass from "./components/ForgetPassword";
import ChangePasswordForm from "./components/ChangePassword";

function App() {
    // const [user, setUser] = useState<{
    //   userId: string;
    //   userName: string
    // } | null>(null);
    // const [isLoading, setLoading] = useState(true);
    const {user, userLoading: isLoading} = useAppSelector(
        (state) => state.userState
    );
    const history = useHistory();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchMe());
    }, []);
    return (
        <Router>
            <Route path='/login' exact>{
                user ? <Redirect to='/users'/>:<LoginForm callback={(err, user) => {
                    if (!err) {
                        dispatch(setUserAction(user));
                        window.location.reload();
                    } else {
                        message.error("Error");
                    }
                }}/>
            }

            </Route>
            <Route path="/" exact>
                <Spin spinning={isLoading} indicator={<LoadingOutlined/>}>
                    {isLoading
                        ? <></>
                        : <>
                            {user
                                ? <Redirect to='/users'/>
                                : <Redirect to='/login'/>
                            }
                        </>
                    }
                </Spin>
            </Route>
            <Route path='/auth' exact><AuthForm/></Route>
            <Route path='/auth/active' exact><ActiveAcount/></Route>
            <Route path="/register">
                <RegisterForm
                    user={user}
                    callback={(err) => {
                        if (err) {
                            message.error(`Error ${err}`);
                        } else {
                            message.info("Success, login now");
                        }
                    }}
                />
            </Route>
            <Route path="/resetPass">
                <ResetPasswordForm/>
            </Route>
            <Route path="/forgetPass">
                <ForgetPass/>
            </Route>
            <Route path='/auth/logout' exact><AuthLogout/></Route>
            {
                user ? <Switch>
                    <Route path="/users" exact>
                        <PageUser/>
                    </Route>
                    <Route path="/users/:userId" exact>
                        <UserDetail/>
                    </Route>


                    <Route path='/changePassword' exact><ChangePasswordForm/></Route>
                    <Route path="/user-profile" exact>
                        <UserProfile/>
                    </Route>
                    <Route path="/history/:historyId">
                        <APIHistoryDetail/>
                    </Route>
                    <Route path="/history">
                        <APIHistory/>
                    </Route>

                    {/* FAKING LAYOUT PAGE */}
                    <Route path="/layout">
                        <Layout>
                            <Sidebar/>
                            <Layout>
                                <Header user={user}/>
                                <Layout.Content>
                                    <HomeView user={user}/>
                                </Layout.Content>
                                {/* <Layout.Footer>Footer</Layout.Footer> */}
                            </Layout>
                        </Layout>
                    </Route>
                    {/* FAKING LAYOUT PAGE */}

                </Switch> : <Redirect to='/login'/>
            }


        </Router>
    )
}

export default App;
