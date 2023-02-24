import {message} from 'antd';
import {AES} from 'crypto-js';
import {PropsWithoutRef, useRef} from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {pushNotification} from "../../common/notification";

const LoginForm = (props: PropsWithoutRef<{ callback: (err: boolean, user: any) => void }>) => {
    const {callback} = props;
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const login = () => {
        const emailOrAccount = emailRef.current?.value;
        const password = passwordRef.current?.value;
        if (!emailOrAccount || !password) return;
        fetch(`${process.env.REACT_APP_ENDPOINT}/web/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                emailOrAccount,
                password: AES.encrypt(password, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
            }),
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((rspBody) => {
                callback(parseInt(rspBody.appStatus) != 200,parseInt(rspBody.appStatus) == 200 ? rspBody.data : null);
            })
            .catch((e) => {
                console.error((e));
                message.error("Error");
            })
    }

    return (
        <div id="main-signin" >
            <main className="form-signin">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}>
                    <h1 className="h3 mb-3 fw-normal">Đăng nhập</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                               ref={emailRef} required/>
                        <label htmlFor="floatingInput">Địa chỉ email</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Mật khẩu"
                               ref={passwordRef} required/>
                        <label htmlFor="floatingPassword">Mật khẩu</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Đăng nhập</button>
                    <div className="mb-3 mt-3">
                        <Link to="/forgetPass">
                            Quên mật khẩu ?
                        </Link>
                    </div>
                    <div className="mb-3 mt-3">
                        <Link to="/register">
                            Đăng kí
                        </Link>
                    </div>

                    <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </div>
    )
}

export default LoginForm;
