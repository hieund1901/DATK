import {message} from 'antd';
import {useRef} from 'react';
import './style.css';
import {useHistory} from 'react-router-dom';
import {forgetPassword} from "../../service/auth";
import {pushNotification} from "../../common/notification";
import {NOTIFICATION_TYPE} from "../../const/notification";

const ForgetPass = () => {
    const history = useHistory()
    const emailRef = useRef<HTMLInputElement | null>(null);
    const requestResetPass = () => {
        const email = emailRef.current?.value;
        if (!email ) return;
        forgetPassword(email)
            .then((res) => {
                pushNotification('Thành công', 'Kiểm tra email của bạn để tiếp tục', NOTIFICATION_TYPE.SUCCESS)
                history.replace('/')
            })
            .catch((e) => {
                pushNotification('Có lỗi xảy ra', `Lỗi khi gửi yêu cầu - Chi tiết lỗi :${e}`, NOTIFICATION_TYPE.ERROR);
            })
    }

    return (
        <div id="main-signin">
            <main className="form-signin">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    requestResetPass();
                }}>
                    <h1 className="h3 mb-3 fw-normal">Quên mật khẩu</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                               ref={emailRef} required/>
                        <label htmlFor="floatingInput">Địa chỉ email</label>
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Xác nhận</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </div>
    )
}

export default ForgetPass;
