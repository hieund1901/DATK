import {Button, DatePicker, Form, Input, Select} from "antd";
import {Option} from "antd/lib/mentions";
import React from "react";
import {pushNotification} from "../../../common/notification";
import {AES} from "crypto-js";
import {NOTIFICATION_TYPE} from "../../../const/notification";

const ModalAddUser = (props: any) => {
    const {handleOK} = props;

    const handleSubmitForm = (value) => {

        const ISO_dateOfBirth = new Date(value.dateOfBirth).toISOString();
        fetch(`${process.env.REACT_APP_ENDPOINT}/users`, {
            method: "POST",
            body: JSON.stringify({
                ...value,
                dateOfBirth: ISO_dateOfBirth,
                password: AES.encrypt(value.password, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
            }),
            headers: {"Content-Type": "application/json"}
        })
            .then((res) => {
                pushNotification("Thành công", "Bạn vừa tạo thành công một người dùng mới", NOTIFICATION_TYPE.SUCCESS);
                handleOK()
            })
            .catch((e) => {
                pushNotification("Thất bại", "Thất bại", NOTIFICATION_TYPE.ERROR);
                handleOK()
                return;
            })
    }

    const handleFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };

    const [formAddUser] = Form.useForm();
    return (
        <Form
            className="user-page__list-filter"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            colon={false}
            form={formAddUser}
            onFinish={handleSubmitForm}
            onFinishFailed={handleFinishFailed}
            preserve={false}
        >
            <Form.Item label="Họ và tên" name="name" className="form-item"
                       rules={[
                           {
                               required: true,
                               message: "Họ tên là bắt buộc!"
                           }
                       ]}
            >
                <Input placeholder="VD: Nguyễn Thị B"/>
            </Form.Item>
            <Form.Item
                name="password"
                label="Mật khẩu"
                className="form-item"
                rules={[
                    {
                        required: true,
                        message: 'Mời nhập mật khẩu!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Nhập lại mật khẩu"
                className="form-item"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Hãy xác nhận lại mật khẩu!',
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('Mật khẩu vừa nhập chưa chính xác!'));
                        },
                    }),
                ]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item label="Email" name="email" className="form-item"
                       rules={[
                           {
                               type: 'email',
                               message: 'E-mail không hợp lệ!',
                           },
                           {
                               required: true,
                               message: 'Mời nhập vào E-mail!',
                           },
                       ]}
            >
                <Input placeholder=""/>
            </Form.Item>
            <Form.Item label="Giới tính" name="gender" className="form-item"
                       rules={[
                           {
                               required: true,
                               message: 'Hãy chọn giới tính',
                           }
                       ]}
            >
                <Select placeholder="">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dateOfBirth" className="form-item"
                       rules={[
                           {
                               required: true,
                               message: 'Hãy chọn ngày sinh',
                           }
                       ]}>
                <DatePicker onChange={props.onChange} placeholder="2022-06-01"/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    className="button"
                    loading={props.loading}
                >
                    Tạo mới
                </Button>
            </Form.Item>
        </Form>
    );
}

export default ModalAddUser;