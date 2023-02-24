import React, { useEffect, useState } from "react";
import "./style.css";
import moment from "moment";
import { authLogOut, getInfo, saveInfo } from "../../service/auth";
import { VietnameseGender } from "../../const/gender";
import EditUserDialog from "./editDialog";

import {useHistory} from "react-router-dom";
import {logoutAction} from "../../redux/slices/user.slice";
import {useAppDispatch} from "../../hooks";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Table} from "antd";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import {PlusCircleOutlined} from "@ant-design/icons";
import ModalAddUser from "../PageUser/ModalAddUser";
import {getUser} from "../../service/user";

class User {
    _id?: string;
    name?: string;
    email?: string;
    dateOfBirth?: Date;
    gender?: string;
    avatar?: string;

    constructor(props) {
        this._id = props._id || "Chưa có thông tin";
        this.name = props.name || "Chưa có thông tin";
        this.email = props.email || "Chưa có thông tin";
        this.dateOfBirth = props.dateOfBirth || "Chưa có thông tin";
        this.gender = props.gender || "Chưa có thông tin";
        this.avatar = props.avatar || "";

    }

};

export default function UserProfile() {
    const dispatch = useAppDispatch();
    const [userInformation, setUserInfo] = useState(new User({}));
    const history = useHistory();

    async function updateUserInfo() {
        getInfo().then(res => {
            setUserInfo({...res.data.data.result})
        })
    }

    useEffect(() => {
        updateUserInfo();
    }, [])

    async function saveUserInfo(data) {
        saveInfo(data).then(res => {
            updateUserInfo()
        });
    }

    async function logOut() {
        authLogOut().then(() => {
            dispatch(logoutAction())
            history.push('/')
        });
    }

    return (
          <Row>
            <Col key={1} flex={2} style={{backgroundColor:"#f5f5f5"}}>
              <Sidebar activeItemId='api'/>
            </Col>
            <Col key={2} flex={8} style={{backgroundColor:"#f5f5f5"}}>
              <Header user={{userId: "001", userName: "admin", email: "test@gmail.com"}}/>
              <div className="userProfile">
                <div className="userImage">
                  <img
                      className="userAvatar"
                      src={userInformation.avatar}
                      alt="Avatar"
                  />
                  <span>UserID : {userInformation._id}</span>
                </div>
                <div className="userInformation">
                  <div className={""}>
                    <label htmlFor="userName">Họ và tên</label>
                    <div id="userName">{userInformation.name}</div>
                  </div>
                  <label htmlFor="userEmail">Email</label>
                  <div id="userEmail">
                    {userInformation.email}
                  </div>

                </div>
                <div className="userInformation">

                  <div className="dateOfBirth">
                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                    <div>{userInformation.dateOfBirth ? moment(userInformation.dateOfBirth).format('DD-MM-YYYY') : "Chưa có thông tin"}</div>
                  </div>
                  <label htmlFor="userGender">Giới tính</label>
                  <div
                      id="userGender"
                  >
                    {VietnameseGender[userInformation.gender]}
                  </div>
                </div>
              </div>
              <EditUserDialog onOk={saveUserInfo} initData={{
                ...userInformation,
                dateOfBirth: moment(userInformation.dateOfBirth)
              }}></EditUserDialog>
              <Button onClick={() => {
                history.push('/changePassword')
              }}>Thay đổi mật khẩu</Button>
            </Col>
          </Row>
    );
}
