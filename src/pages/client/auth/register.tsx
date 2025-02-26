import { registerAPI } from '@/services/api';
import './register.scss'
import type { FormProps } from 'antd';
import { Button, Form, Input, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false)

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        const res = await registerAPI(fullName, email, password, phone);
        if (res.data) {
            //success
            message.success("Đăng ký user thành công.");
            navigate("/login");
        } else {
            //error
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="heading">
                    Đăng Ký Tài Khoản
                </div>
                <div className="register-form">
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item<FieldType>
                            label="Họ tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <hr />
                <div className="exist-account">
                    <span>Đã có tài khoản?</span> <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;