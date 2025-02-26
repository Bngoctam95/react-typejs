import { loginAPI } from '@/services/api';
import './login.scss'
import type { FormProps } from 'antd';
import { App, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false)
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await loginAPI(username, password);
        setIsSubmit(false);
        if (res?.data) {
            //success
            localStorage.setItem('access_token', res.data.access_token);
            message.success("Đăng nhập thành công");
            navigate('/');
        } else {
            //error
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="heading">
                    Đăng Nhập
                </div>
                <div className="login-form">
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item<FieldType>
                            name="username"
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

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <hr />
                <div className="exist-account">
                    <span>Chưa có tài khoản?</span> <Link to="/register">Đăng ký</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;