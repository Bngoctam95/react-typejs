import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload, UploadProps } from "antd";
import { useState } from "react";
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
import { ImportUsersAPI } from "@/services/api";
import { V } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

interface IProps {
    openImportUser: boolean;
    setOpenImportUser: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = ({ openImportUser, setOpenImportUser, refreshTable }: IProps) => {
    const { Dragger } = Upload;
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess('ok');
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet: any) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values;
                        sheet.eachRow((row: any, rowNumber: any) => {
                            if (rowNumber == 1) return;
                            let values = row.values;
                            let obj: any = { key: rowNumber };
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = async () => {
        setIsLoading(true);
        const formattedUsers = dataImport.map(user => ({
            ...user,
            password: "123456"
        }));
        const res = await ImportUsersAPI(formattedUsers);
        if (res?.data) {
            //success
            setOpenImportUser(false);
            setDataImport([]);
            message.success('Import users thành công');
            refreshTable();
        } else {
            //error
            notification.error({
                message: 'Error occurs',
                description: res.message
            })
        }
        setIsLoading(false);
    };

    const handleCancel = () => {
        setOpenImportUser(false);
        setDataImport([]);
    };

    return (
        <Modal
            title="Import User"
            width={"50vw"}
            open={openImportUser}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Import data"
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true,
                loading: isLoading
            }}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Only support for a single file upload. Type: .csv, .xls, .xlsx
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    title={() => <span>Dữ liệu upload:</span>}
                    columns={[
                        { dataIndex: 'fullName', title: 'Tên hiển thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số điện thoại' },
                    ]}
                    dataSource={dataImport}
                />
            </div>
        </Modal>
    )
}

export default ImportUser;