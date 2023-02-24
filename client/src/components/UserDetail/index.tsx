import {Col, Descriptions, Popconfirm, Row, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {getUserDetail} from "../../service/user";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import moment from "moment";
import {VietnameseGender} from "../../const/gender";

import "./style.css"
import { ColumnsType } from "antd/lib/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface UserRole{
    _id: string,
    role: string,
    application: string,  
}

// const dataUserRole1 = [
//     {
//         _id: "1",
//         application: "vaipe app",
//         role: "user"
//     },
//     {
//         _id: "2",
//         application: "lable tool",
//         role: "user"
//     }
// ]

const UserDetail = (props: any) => {
    const [dataUser, setDataUser] = useState(null);
    const userId = useParams()['userId'];
    // console.log(userId);

    const columns =[
        {
            title: 'ỨNG DỤNG',
            dataIndex: 'applications',
            key: 'applications',
            render: (text, record) => (
                <div className="user-name">
                    <Space size="middle">
                        <p>{record.application?record.application:''}</p>
                    </Space>
                </div>
            ),
        },
        {
            title: 'QUYỀN SỬ DỤNG',
            dataIndex: 'role',
            key: 'role',
            render: (text, record) => (
                <p>{record.roleName?record.roleName:''}</p>
            ),
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Space size="large">
                    <Link to={`/users/${record._id}`}>
                        <div className="user-page__action user-page__action--edit">
                                <Row justify="start" gutter={4}>
                                    <Col>
                                        <EditOutlined />
                                    </Col>
                                    <Col>
                                        <p className="user-page__action-text--edit">Xem</p> 
                                    </Col>
                                </Row>
                        </div>
                    </Link>
                    <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.roleId)}>
                         
                        <div className="user-page__action user-page__action--delete">
                            <Row justify="start" gutter={4}>
                                <Col>
                                    <DeleteOutlined />
                                </Col>
                                <Col>
                                    <p className="user-page__action-text--delete">Xóa</p> 
                                </Col>
                            </Row>
                        </div>
                    </Popconfirm>
                </Space>
            ),
        }
    ]

    useEffect(() => {
        const res = getUserDetail(userId)
            .then((val) => {
                setDataUser(val.data.data.result);
                console.log(val.data.data.result)
            })
        },[]);
 
    const handleDelete = (key) => {
        // const data = dataUserRole;
        // const data2 = data.filter((item) => item._id !== key);
        // // console.log(data2); 
        // // setDataUserRole(data2);
    };
    
    return(
        <React.Fragment> 
            <Row>
                <Col key={1} flex="120px" style={{backgroundColor:"#f5f5f5"}}>
                    <Sidebar activeItemId='api'/>
                </Col>
                <Col key={2} flex="auto" style={{backgroundColor:"#f5f5f5"}}>
                    <Header user={{userId: "001", userName: "admin", email: "test@gmail.com"}}/>
                    <div className="user-detail__title">
                        <header>THÔNG TIN NGƯỜI DÙNG</header>
                    </div>
                    {dataUser ?
                        (<React.Fragment>
                            <Descriptions className="user-detail__info" column={2}>
                                <Descriptions.Item label="Họ tên"
                                    labelStyle={{fontWeight:"bold", fontSize:"1.1rem"}}
                                    contentStyle={{fontWeight:"lighter", fontSize:"1.1rem"}}
                                >
                                    {dataUser.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới tính"
                                    labelStyle={{fontWeight:"bold", fontSize:"1.1rem"}}
                                    contentStyle={{fontWeight:"lighter", fontSize:"1.1rem"}}
                                >
                                    {VietnameseGender[`${dataUser.gender}`]}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh"
                                    labelStyle={{fontWeight:"bold", fontSize:"1.1rem"}}
                                    contentStyle={{fontWeight:"lighter", fontSize:"1.1rem"}}
                                >
                                    {dataUser.dateOfBirth?moment(dataUser.dateOfBirth).format('DD-MM-YYYY'):''}</Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo"
                                    labelStyle={{fontWeight:"bold", fontSize:"1.1rem"}}
                                    contentStyle={{fontWeight:"lighter", fontSize:"1.1rem"}}
                                >
                                    {dataUser.createdAt?moment(dataUser.createdAt).format('DD-MM-YYYY-HH:mm:SS'):''}</Descriptions.Item>
                                <Descriptions.Item label="Email"
                                    labelStyle={{fontWeight:"bold", fontSize:"1.1rem"}}
                                    contentStyle={{fontWeight:"lighter", fontSize:"1.1rem"}}
                                >
                                    {dataUser.email}
                                </Descriptions.Item>
                                {/* <Descriptions.Item label="Ứng dụng">
                                    {dataUser.applications?dataUser.applications.toString():''}
                                </Descriptions.Item> */}
                            </Descriptions>
                            <div className="user-detail__list-roles">
                                <p className="user-detail__list-roles--title">Danh sách quyền</p> 
                                <Table dataSource={dataUser.applications} columns={columns}/>
                            </div>
                        </React.Fragment>)
                            : <p></p>
                    }
                </Col>
            </Row>
        </React.Fragment> 
    );
}

export default UserDetail;