import { formatDate } from "@/services/helper";
import { PlusOutlined } from "@ant-design/icons";
import { Badge, Descriptions, DescriptionsProps, Divider, Drawer, Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openViewBook: boolean;
    setOpenViewBook: (v: boolean) => void;
    currentBook: IBookTable | null;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ViewBook = ({ openViewBook, setOpenViewBook, currentBook }: IProps) => {
    const items: DescriptionsProps['items'] = [
        {
            label: 'Id',
            children: currentBook?._id,
        },
        {
            label: 'Book Name',
            children: currentBook?.mainText,
        },
        {
            label: 'Author',
            children: currentBook?.author,
        },
        {
            label: 'Price',
            children: currentBook?.price
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook.price)
                : '-',
        },
        {
            label: 'Category',
            children: <Badge status="processing" text={currentBook?.category} />,
            span: 2
        },
        {
            label: 'Created At',
            children: formatDate(currentBook?.createdAt),
        },
        {
            label: 'Updated At',
            children: formatDate(currentBook?.updatedAt),
        },
    ];

    const onClose = () => {
        setOpenViewBook(false);
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (currentBook) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (currentBook.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: currentBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`
                }
            }
            if (currentBook.slider && currentBook.slider.length > 0) {
                currentBook.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [currentBook]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);


    return (
        <Drawer
            title="View Book Detail"
            width={'50vw'}
            onClose={onClose}
            open={openViewBook}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
        >
            <Descriptions title="Book Info" bordered items={items} column={2} />
            <Divider orientation="left">Book Images</Divider>
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Drawer>
    )
}

export default ViewBook;