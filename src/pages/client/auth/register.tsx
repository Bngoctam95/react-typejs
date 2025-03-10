import { registerAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Form, Input, App, Typography, Card, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const { Title } = Typography;

const RegisterPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { t } = useTranslation();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        const res = await registerAPI(fullName, email, password, phone);
        if (res.data) {
            //success
            message.success(t("register.successMessage"));
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
                    title={<Title level={2} style={{ textAlign: 'center' }}>{t("register.registerText")}</Title>}
                    bordered={true}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e8e8e8'
                    }}
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item<FieldType>
                            label={t("register.fullNameLabel")}
                            name="fullName"
                            rules={[{ required: true, message: t("register.fullNameRequiredMessage") }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                { type: 'email', message: t("register.emailTypeMessage") },
                                { required: true, message: t("register.emailRequiredMessage") },
                            ]}
                        >
                            <Input size="large" autoComplete='username' />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={t("register.passwordLabel")}
                            name="password"
                            rules={[{ required: true, message: t("register.passwordRequiredMessage") }]}
                        >
                            <Input.Password size="large" autoComplete='current-password' />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={t("register.phoneLabel")}
                            name="phone"
                            rules={[{ required: true, message: t("register.phoneRequiredMessage") }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                {t("register.registerText")}
                            </Button>
                        </Form.Item>

                        <Typography style={{
                            textAlign: 'center'
                        }}>
                            {t("register.registerQuestion")}
                            <Link to="/login">
                                {t("register.login")}
                            </Link>
                        </Typography>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default RegisterPage;