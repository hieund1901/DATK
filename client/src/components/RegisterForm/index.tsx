import {message} from 'antd';
import {AES} from 'crypto-js';
import {PropsWithoutRef, useEffect, useRef} from 'react';
import {Link, useHistory} from 'react-router-dom';
import './style.css';
import {useQuery} from "../../hooks";
import{ Select } from 'antd';
import {pushNotification} from "../../common/notification";
import {NOTIFICATION_TYPE} from "../../const/notification";

const { Option } = Select;
const RegisterForm = (props: PropsWithoutRef<{ callback: (err: number) => void; user?: any }>) => {
    const query = useQuery();
    const redirectUrl = query.get('after');
    const {callback} = props;
    const genderRef = useRef<HTMLSelectElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const dateOfBirthRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const history = useHistory();

    useEffect(() => {
        if (props.user) {
            history.replace('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user])

    const register = () => {
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        const rawPassword = passwordRef.current?.value;
        const gender = genderRef.current?.value;
        const dateOfBirth = dateOfBirthRef.current?.value;
        const ISO_dateOfBirth = new Date(dateOfBirth).toISOString();
        if(confirmPassword != rawPassword){
            alert('Xác nhận mật khẩu khác mật khẩu mới');
            return;
        }
        const encryptedPassword = AES.encrypt(rawPassword, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
        if (!email || !rawPassword || !confirmPassword) return;
        fetch(`${process.env.REACT_APP_ENDPOINT}/web/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                gender,
                dateOfBirth: ISO_dateOfBirth,
                password: encryptedPassword
            }),
            headers: {"Content-Type": "application/json"}
        })
            .then((res) => {
                if (res.status == 200) {
                    pushNotification('Thành công',
                        'Chúc mừng bạn đăng kí thành công. Vui lòng kiểm tra email để hoàn tất đăng kí.',
                                    NOTIFICATION_TYPE.SUCCESS)
                    if (redirectUrl) {
                        window.location.replace(redirectUrl);
                    } else {
                        history.push('/')
                    }
                } else {
                    res.json().then((resBody) => {
                        callback(resBody.message);
                    });
                }
            })
            .catch((e) => {
                pushNotification('Thất bạn', 'Có lỗi xảy ra trong quá trình đăng kí. Vui lòng thử lại.', NOTIFICATION_TYPE.ERROR)
                console.error((e));
                message.error("Error");
                return;
            })
    }

    return (
        <div id="main-register">
            <main className="form-signin">
                <form onSubmit={(e) => {
                    e.preventDefault();
                }} autoComplete="off">
                    <h1 className="h3 mb-3 fw-normal">Register</h1>
                    <div className="form-floating">
                        <input name="name" className="form-control" id="name"
                               placeholder="Nguyễn Văn A" ref={nameRef} required/>
                        <label htmlFor="name">Họ tên</label>
                    </div>
                    <div className="form-floating">
                        <input type="email" name="email" className="form-control" id="floatingInput"
                               placeholder="name@example.com" ref={emailRef} required/>
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Mật khẩu"
                               ref={passwordRef} required/>
                        <label htmlFor="floatingPassword">Mật khẩu</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Xác nhận mật khẩu"
                               ref={confirmPasswordRef} required/>
                        <label htmlFor="floatingConfirmPassword">Xác nhận mật khẩu</label>
                    </div>
                    <div className="form-floating">
                        <select id="Gender" className="form-control" ref={genderRef}>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                        <label htmlFor="Gender">Giới tính</label>
                    </div>
                    <div className="form-floating">
                        <input className="form-control" id="birthday" type="date"
                               ref={dateOfBirthRef} required/>
                        <label htmlFor="birthday">Ngày sinh</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={register}>Register</button>

                    <div className="mb-3 mt-3">
                        <Link to="/">
                            Đăng nhập ngay
                        </Link>
                    </div>

                   <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </div>
    )
}

export default RegisterForm;
