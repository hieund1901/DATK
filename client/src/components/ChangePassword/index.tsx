import {message} from 'antd';
import {AES} from 'crypto-js';
import {useRef} from 'react';
import './style.css';
import {Link, useHistory} from 'react-router-dom';
import {useQuery} from "../../hooks";
import {sign} from '../../utils/signature';
import {pushNotification} from "../../common/notification";
import {NOTIFICATION_TYPE} from "../../const/notification";

const ChangePasswordForm = () => {
    const history = useHistory();
    const oldPasswordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const resetPassword = () => {
        const oldPassword = oldPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        const password = passwordRef.current?.value;
        if(confirmPassword != password){
            alert('Xác nhận mật khẩu khác mật khẩu mới');
            return;
        }
        if (!confirmPassword || !password) return;
        const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
        const encryptedOldPassword = AES.encrypt(oldPassword, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
        const mainBody = {

            password: encryptedOldPassword,
            newPassword: encryptedPassword
            }
        const signature = sign(mainBody);
        fetch(`${process.env.REACT_APP_ENDPOINT}/web/auth/changePassword`, {
            method: "POST",
            body: JSON.stringify({
                password: encryptedOldPassword,
                newPassword: encryptedPassword,
                signature: signature
            }),
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        })
            .then((res) => res.json())
            .then(()=>{window.location.replace(`${process.env.SSO_ENDPOINT}`);
            pushNotification('Thành công', 'Đổi mật khẩu thành công', NOTIFICATION_TYPE.SUCCESS)})
            .catch((e) => {
                console.error((e));
                message.error("Error");
            })
    }

    return (
        <div id="main-signin">
            <main className="form-signin">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    resetPassword();
                }}>
                    <h1 className="h3 mb-3 fw-normal">Thay đổi mật khẩu</h1>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingOldPassword" placeholder="Mật khẩu cũ"
                               ref={oldPasswordRef} required/>
                        <label htmlFor="floatingPassword">Mật khẩu cũ</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Mật khẩu mới"
                               ref={passwordRef} required/>
                        <label htmlFor="floatingPassword">Mật khẩu mới</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Xác nhận mật khẩu"
                               ref={confirmPasswordRef} required/>
                        <label htmlFor="floatingConfirmPassword">Xác nhận mật khẩu</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Xác nhận</button>
                    <button className="w-100 btn btn-lg" style={{marginTop: '5px'}} onClick={()=>{
                        history.push('/');
                    }}>Hủy bỏ</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </div>
    )
}

export default ChangePasswordForm;
