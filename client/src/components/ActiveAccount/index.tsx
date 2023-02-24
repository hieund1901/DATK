import {useEffect, useState} from "react";
import "./style.css";
import {useQuery} from "../../hooks";
import {activeUser} from "../../service/auth";

const ActiveAcount = () => {
    const query = useQuery();
    const _id = query.get('_id');
    const [status, setStatus] = useState('PENDING')
    useEffect(() =>{activeUser(_id).then(res => {
        setStatus('SUCCESS')
    }).catch(error =>{
        setStatus('FAIL')
    })},[])

    return (
        <div id="main-home-view" className="container">
            <div className="content">
                <div className="user-info">
                    {status=='SUCCESS'&&<div>Xác thực thành công. <a href={'/'}>Đăng nhập</a> để tiếp tục.</div>}
                    {status=='PENDING'&&<div>Đang tải...</div>}
                    {status=='FAIL'&&<div>Xác thực thất bại. Vui lòng thử lại sau.</div>}

                </div>
            </div>
        </div>
);
};

export default ActiveAcount;
