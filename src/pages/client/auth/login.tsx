import { loginAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { App, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCurrentApp } from '@/hooks/useCurrentApp';
import { useTranslation } from 'react-i18next';

type FieldType = {
    username: string;
    password: string;
};

const { Title } = Typography;

const LoginPage = () => {
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { setIsAuthenticated, setUser } = useCurrentApp();
    const { t } = useTranslation();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await loginAPI(username, password);
        setIsSubmit(false);
        if (res?.data) {
            //success
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            message.success(t("login.successMessage"));
            navigate('/');
        } else {
            //error
            notification.error({
                message: t("login.errorMessage"),
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
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#f0f2f5',
                width: '100%'
            }}
        >
            <Col
                xs={{ span: 24 }}
                sm={{ span: 20 }}
                md={{ span: 16 }}
                lg={{ span: 12 }}
                xl={{ span: 10 }}
                xxl={{ span: 8 }}
                style={{ maxWidth: '500px' }}
            >
                <Card
                    title={<Title level={2} style={{ textAlign: 'center' }}>{t("login.loginText")}</Title>}
                    bordered={true}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e8e8e8'
                    }}
                >
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
                                    message: t("login.emailTypeMessage"),
                                },
                                {
                                    required: true,
                                    message: t("login.emailRequiredMessage"),
                                },
                            ]}
                        >
                            <Input autoComplete='username' />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={t("login.passwordLabel")}
                            name="password"
                            rules={[{ required: true, message: t("login.passwordRequiredMessage") }]}
                        >
                            <Input.Password autoComplete='current-password' />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                {t("login.loginText")}
                            </Button>
                        </Form.Item>

                        <Typography style={{
                            textAlign: 'center'
                        }}>
                            {t("login.loginQuestion")}
                            <Link to="/register">
                                {t("login.register")}
                            </Link>
                        </Typography>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginPage;