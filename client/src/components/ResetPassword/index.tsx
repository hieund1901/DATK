import {message} from 'antd';
import {AES} from 'crypto-js';
import {useRef} from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {useQuery} from "../../hooks";
import {sign} from '../../utils/signature';

const ResetPasswordForm = () => {
    const query = useQuery();
    const resetPasswordRequest = query.get('_id');
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const resetPassword = () => {
        const confirmPassword = confirmPasswordRef.current?.value;
        const password = passwordRef.current?.value;
        if(confirmPassword != password){
            alert('Xác nhận mật khẩu khác mật khẩu mới');
            return;
        }
        if (!confirmPassword || !password) return;
        const encryptedPassword = AES.encrypt(password, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()

        const mainBody = {
            _id: resetPasswordRequest,
            password: encryptedPassword
            }
        const signature = sign(mainBody);
        fetch(`${process.env.REACT_APP_ENDPOINT}/web/auth/setPassword`, {
            method: "POST",
            body: JSON.stringify({
                _id: resetPasswordRequest,
                password: encryptedPassword,
                signature: signature
            }),
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        })
            .then((res) => res.json())
            .then(()=>{window.location.replace(`${process.env.SSO_ENDPOINT}`)})
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
                    <h1 className="h3 mb-3 fw-normal">Đặt lại mật khẩu</h1>


                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Mật khẩu"
                               ref={passwordRef} required/>
                        <label htmlFor="floatingPassword">Mật khẩu mới</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Xác nhận mật khẩu"
                               ref={confirmPasswordRef} required/>
                        <label htmlFor="floatingConfirmPassword">Xác nhận mật khẩu</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Xác nhận</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </div>
    )
}

export default ResetPasswordForm;
