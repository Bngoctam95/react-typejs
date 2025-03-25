import { createBookAPI, fetchCategoryAPI, uploadFileAPI } from "@/services/api";
import { App, Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload, FormProps } from "antd";
import { useEffect, useState } from "react";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'

interface IProps {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

const CreateBook = (props: IProps) => {
    const { openCreateBook, setOpenCreateBook, refreshTable } = props;
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetchCategoryAPI();
            if (res?.data) {
                const formattedOptions = res.data.map(category => ({
                    value: category,
                    label: category
                }));
                setOptions(formattedOptions);
            } else {
                console.error('Failed to fetch categories:', res.error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { author, category, mainText, price, quantity } = values;

        const thumbnailName = fileListThumbnail?.[0]?.name || '';

        const sliderNames = fileListSlider?.map((item: any) => item.name) || [];

        setLoadingSubmit(true);
        const res = await createBookAPI(thumbnailName, sliderNames, mainText, author, price, 0, quantity, category);
        if (res?.data) {
            //success
            form.resetFields();
            setOpenCreateBook(false);
            message.success('Created Book Successfully!');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoadingSubmit(false);
    };


    const handleCancel = () => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenCreateBook(false);
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider)
        }
    }

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === 'slider' ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false);
            return;
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, 'book');

        if (res && res.data) {
            const uploadFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadFile }])
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadFile }])
            }

            if (onSuccess) {
                onSuccess("ok")
            }
        } else {
            message.error(res.message)
        }
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e.fileList;
    }

    return (
        <Modal
            title='Add New Book'
            open={openCreateBook}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            width={'50vw'}
        >
            <Divider></Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Book Name */}
                        <Form.Item
                            label="Book Name"
                            name="mainText"
                            rules={[{ required: true, message: 'Please input the book name' }]}
                        >
                            <Input id="modal_mainText" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Author */}
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[{ required: true, message: 'Please input the author' }]}
                        >
                            <Input id="modal_author" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        {/* Price */}
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input price' }]}
                        >
                            <InputNumber
                                addonAfter="đ"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        {/* Category */}
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please input category' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={options}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        {/* Quantity */}
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please input quantity' }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Thumbnail */}
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Please upload thumbnail' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                beforeUpload={beforeUpload}
                                onChange={(info) => { handleChange(info, 'thumbnail') }}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'thumbnail')}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Slider */}
                        <Form.Item
                            label="Slider"
                            name="slider"
                            rules={[{ required: true, message: 'Please upload slider' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple={true}
                                customRequest={(options) => handleUploadFile(options, 'slider')}
                                beforeUpload={beforeUpload}
                                onChange={(info) => { handleChange(info, 'slider') }}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, 'slider')}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateBook;