import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate, formatDate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import CreateFormUser from 'components/admin/user/create.user';
import UpdateFormUser from 'components/admin/user/update.user';
import ViewUser from 'components/admin/user/view.user';
import { CSVLink } from 'react-csv';
import ImportUser from './import.user';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openViewUser, setOpenViewUser] = useState<boolean>(false);
    const [openImportUser, setOpenImportUser] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUserTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const { message, notification } = App.useApp();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const dataExport = currentDataTable.map(({ _id, fullName, email, createdAt }) => ({
        _id,
        fullName,
        email,
        createdAt: formatDate(createdAt)
    }));

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleConfirm = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(_id);
        if (res?.data) {
            message.success('Deleted user successfully!');
            refreshTable();
        } else {
            notification.error({
                message: 'Error occurs',
                description: res.message
            })
        }
        setIsDeleteUser(false);
    };

    const handleUpdateUser = (user: IUserTable) => {
        setOpenModalUpdate(true);
        setCurrentUser(user);
    }

    const handleViewUser = (user: IUserTable) => {
        setOpenViewUser(true);
        setCurrentUser(user);
    }

    const handleCreateUser = () => {
        setOpenModalCreate(true);
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, __, index) => {
                return (meta.current - 1) * meta.pageSize + index + 1;
            },
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => { handleViewUser(entity) }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            hideInTable: true,
            valueType: 'dateRange',
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 30 }}
                            title='Edit user'
                            onClick={() => { handleUpdateUser(entity) }}
                        />

                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
                            onConfirm={() => { handleConfirm(entity._id) }}
                            okText="Yes"
                            cancelText="No"
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: 'pointer' }}
                                title='Delete user'
                            />
                        </Popconfirm>
                    </>
                )
            },
        },
    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createdAtRange = dateRangeValidate(params.createdAtRange);

                        if (createdAtRange) {
                            query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`
                        }
                    }

                    if (sort && Object.keys(sort).length > 0) {
                        const sortKey = Object.keys(sort)[0];
                        const sortValue = sort[sortKey] === 'ascend' ? '' : '-';
                        query += `&sort=${sortValue}${sortKey}`;
                    } else {
                        //default sort
                        query += `&sort=-createdAt`;
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}
                rowKey="_id"

                pagination={{
                    pageSize: meta.pageSize,
                    current: meta.current,
                    total: meta.total,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                    showTotal(total, range) {
                        return (
                            <div>{range[0]}-{range[1]} trên {total} items</div>
                        )
                    },
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <>
                        <Button
                            key="import-button"
                            icon={<CloudUploadOutlined />}
                            onClick={() => {
                                setOpenImportUser(true);
                            }}
                            type="primary"
                        >
                            Import
                        </Button>
                        <Button
                            key="export-button"
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            <CSVLink
                                data={dataExport}
                                filename='export-user'
                            >
                                Export
                            </CSVLink>
                        </Button>
                        <Button
                            key="add-new-button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                handleCreateUser();
                            }}
                            type="primary"
                        >
                            Add new
                        </Button>
                    </>
                ]}
            />
            <CreateFormUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateFormUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                currentUser={currentUser}
            />
            <ViewUser
                openViewUser={openViewUser}
                setOpenViewUser={setOpenViewUser}
                currentUser={currentUser}
            />
            <ImportUser
                openImportUser={openImportUser}
                setOpenImportUser={setOpenImportUser}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;