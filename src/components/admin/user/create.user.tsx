import { createUserAPI } from '@/services/api';
import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Divider, Form, FormProps, Input, Modal, Upload } from 'antd';
import { UploadFile } from 'antd/lib';
import { useEffect, useState } from 'react';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const CreateFormUser = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, email, password, phone } = values;
        setLoading(true);
        const res = await createUserAPI(fullName, email, password, phone);
        if (res?.data) {
            //success
            form.resetFields();
            setOpenModalCreate(false);
            message.success('Tạo user thành công');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setOpenModalCreate(false);
    }

    return (
        <Modal
            title='Add New User'
            open={openModalCreate}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <Divider></Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Full Name */}
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                    <Input id="modal_fullName" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: true }]}
                >
                    <Input autoComplete='email' id="modal_email" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password autoComplete='current-password' id="modal_password" />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }]}
                >
                    <Input id="modal_phone" />
                </Form.Item>

                {/* Avatar Upload */}
                {/* <Form.Item label="Avatar">
                    <Upload
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                        accept="image/*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item> */}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateFormUser;