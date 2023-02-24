import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Space, Input, Button, Form, DatePicker, Row, Col, Avatar, Image, Popconfirm, Modal, Pagination} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    PlusCircleOutlined,
    BranchesOutlined
  } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import "./style.css"
import ModalAddUser from "./ModalAddUser";
import { getUser } from "../../service/user"
import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import {VietnameseGender} from "../../const/gender";
import moment from "moment";

interface User{
    _id: string,
    name: string,
    avatar: string,
    gender: string,
    dateOfBirth: string,
    createdAt: string,
    email: string,
    applications: string,  
}

const PageUser = () => {
    const columns: ColumnsType<User> =[
        {
            title: 'HỌ TÊN',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="user-name">
                    <Space size="middle">
                        <p>{record.name}</p>
                    </Space>
                </div>
            ),
        },
        {
            title: 'GIỚI TÍNH',
            dataIndex: 'gender',
            key: 'gender',
            render: (text, record) => (
                <p>{VietnameseGender[`${record.gender}`]}</p>
            ),
        },
        {
            title: 'NGÀY SINH',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (text, record) => (
                <p>{record.dateOfBirth?moment(record.dateOfBirth).format('DD-MM-YYYY'):''}</p>
            ),
        },
        {
            title: 'EMAIL',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'THÒI GIAN TẠO',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record) => (
                <p>{record.createdAt?moment(record.createdAt).format('DD-MM-YYYY-HH:mm:SS'):''}</p>
            )
        },
        {
            title: 'ỨNG DỤNG',
            dataIndex: 'applications',
            key: 'applications',
            render: (text, record) => (
                <p>{record.applications?record.applications.toString():''}</p>
            )
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
                    <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record._id)}>
                         
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
        },
        
    ];

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const page = {
        page: 1,
        pageSize: 5,
        isPaging: true,
    }

    useEffect(() => {
    const res = getUser(page)
        .then((val) => {
            // console.log(val);
            // console.log(val.data.data.result.users);
            setDataSource(val.data.data.result.users);
            setTotal(val.data.data.pagination.total);
        })
    },[]);


    const handleOK = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setVisible(false);

        }, 2000);
    }

    const handleCancel = () => {
        setVisible(false);
    }

    const handleDelete = (key) => {
        const data = dataSource;
        // console.log(data);
        // console.log(key);
        const data2 = data.filter((item) => item._id !== key);
        // console.log(data2); 
        setDataSource(data2);
    };
    
    const onChange = (date, dateString) => {
    }

    const [form] = Form.useForm();

    const handleSubmitForm = (value) =>{
        handleOK();
        const data = {...page, ...value}
        const res = getUser(data)
            .then((val) => {
                setDataSource(val.data.data.result.users);
                setTotal(val.data.data.pagination.total);
            });

    }

    return( 
        <React.Fragment> 

            <Row>
            <Col key={1} flex="120px" style={{backgroundColor:"#f5f5f5"}}>
                    <Sidebar activeItemId='api'/>
                </Col>
                <Col key={2} flex="auto" style={{backgroundColor:"#f5f5f5"}}>
                    <Header user={{userId: "001", userName: "admin", email: "test@gmail.com"}}/>
                    <div className="user-page">
                        <div className="user-page__header">
                            <p className="user-page__header-content">DANH SÁCH NGƯỜI DÙNG</p>
                            <Button 
                                type="primary" 
                                icon={<PlusCircleOutlined className="plusCircle-icon"/>} 
                                onClick={()=>{
                                    setVisible(true);
                                }}
                            >
                                Thêm người dùng mới
                            </Button>
                            <Modal
                                visible = {visible}
                                title = "Thêm người dùng mới"
                                // onOk={handleOK}
                                onCancel = {handleCancel}
                                destroyOnClose = {true}
                                footer={null}
                            >
                                <ModalAddUser
                                    onChange = {onChange}
                                    loading = {loading}
                                    handleCancel = {handleCancel}
                                    handleOK = {handleOK}
                                />
                            </Modal>
                        </div>
                        <div className="user-page__filter">
                            <p className="user-page__filter-content">Bộ lọc</p>
                            <Form
                                className="user-page__list-filter"
                                colon={false}
                                form={form}
                                onFinish={handleSubmitForm}
                            >
                                <Row justify={"space-between"}>
                                    <Col >
                                        <Form.Item label="Họ tên" name="name" className="form-item" >
                                            <Input placeholder="VD: Nguyễn Thị B" />
                                        </Form.Item>
                                    </Col>
                                    <Col >
                                        <Form.Item label="Ngày tạo" name="createdAt" className="form-item">
                                            <DatePicker onChange={onChange} placeholder="Chọn ngày"/>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item label="Ứng dụng" name="applications" className="form-item">
                                            <Input placeholder="VD: vaipe" />
                                        </Form.Item>
                                    </Col>
                                    <Col >
                                        <Form.Item label="Email" name="email" className="form-item">
                                            <Input placeholder="" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row justify="end">
                                    <Col>
                                        <Form.Item>
                                            <Button
                                                style={{
                                                    marginLeft: '12px',
                                                }}
                                                onClick={() => {
                                                    form.resetFields();
                                                    getUser(page)
                                                        .then((val) => {
                                                            setDataSource(val.data.data.result.users);
                                                            setTotal(val.data.data.pagination.total);
                                                        });
                                                }}
                                                className="button"
                                                >
                                                Đặt lại
                                            </Button>
                                        </Form.Item>    
                                    </Col>
                                    <Col>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="button">Tìm kiếm</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="user-page__list-users">
                            <Table dataSource={dataSource} columns={columns}
                                pagination={{pageSize:5, defaultCurrent:1, total:total}}
                                onChange={(pagin)=>{
                                    // console.log(pagin);
                                    const paginData = {
                                        page: pagin.current,
                                        pageSize: pagin.pageSize,
                                        isPaging: true,
                                    }
                                    const res = getUser(paginData)
                                        .then((val) => {
                                            // console.log(val.data.data.result.users);
                                            setDataSource(val.data.data.result.users);
                                            setTotal(val.data.data.pagination.total);
                                        });
                                }}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PageUser;