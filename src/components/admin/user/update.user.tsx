import { updateUserAPI } from '@/services/api';
import { App, Button, Divider, Form, FormProps, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    currentUser: IUserTable | null;
}

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const UpdateFormUser = ({ openModalUpdate, setOpenModalUpdate, refreshTable, currentUser }: IProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values;
        setLoading(true);
        const res = await updateUserAPI(_id, fullName, phone);
        if (res?.data) {
            //success
            setOpenModalUpdate(false);
            message.success('Cập nhật user thành công');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setOpenModalUpdate(false);
    }

    useEffect(() => {
        form.setFieldsValue({
            _id: currentUser?._id,
            email: currentUser?.email,
            phone: currentUser?.phone,
            fullName: currentUser?.fullName
        });
    }, [currentUser]);

    return (
        <Modal
            title='Update User'
            open={openModalUpdate}
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
                {/* Id */}
                <Form.Item
                    label="Id"
                    name="_id"
                    rules={[{ required: true, message: 'Vui lòng nhập Id' }]}
                    hidden
                >
                    <Input id="modal_Id" disabled />
                </Form.Item>

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
                    <Input autoComplete='email' id="modal_email" disabled />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }]}
                >
                    <Input id="modal_phone" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateFormUser;