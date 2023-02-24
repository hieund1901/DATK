import React, {useState} from 'react';
import {Button, DatePicker, Form, Input, Modal, Select} from 'antd';
import {VietnameseGender} from "../../const/gender";

const { Option } = Select;
const genderOption = [];
genderOption.push(<Option key="0">Nam</Option>);
genderOption.push(<Option key="1">Nữ</Option>);
genderOption.push(<Option key="2">Khác</Option>);

const EditUserDialog = (props) => {
    const {onOk, initData} = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const showModal = () => {
        setIsModalVisible(true);
    };
    const [form] = Form.useForm();
    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                form.resetFields();
                onOk(values);
            })
            .catch(info => {
            });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onFinish = (values: any) => {
    };
    return (
        <>
            <Button type="primary" onClick={showModal} style={{marginRight:'10px'}}>
                Chỉnh sửa
            </Button>
            <Modal title="Cập nhật thông tin người dùng" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText={'Hủy bỏ'} okText={'Lưu lại'}>
                <Form  form={form} {...layout} name="nest-messages" initialValues={initData} onFinish={onFinish} validateMessages={validateMessages}>
                    <Form.Item name='name' label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='email' label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item name='dateOfBirth' label="Ngày sinh" rules={[{ required: true }]}>
                        <DatePicker style={{width: '100%'}} format={'DD-MM-YYYY'}/>
                    </Form.Item>
                    <Form.Item name='gender' label="Giới tính" rules={[{ required: true }]}>
                        <Select >
                            <Option value="male">{VietnameseGender.male}</Option>
                            <Option value="female">{VietnameseGender.female}</Option>
                            <Option value="other">{VietnameseGender.other}</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditUserDialog;