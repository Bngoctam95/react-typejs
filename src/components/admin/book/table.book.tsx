import { deleteBookAPI, getBooksAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Dropdown, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import ViewBook from 'components/admin/book/view.book';
import CreateBook from './create.book';

type TSearch = {
    mainText: string;
    category: string;
    author: string;
}

const TableBook = () => {
    const { message, notification } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [openViewBook, setOpenViewBook] = useState<boolean>(false);
    const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeleteConfirm = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteBookAPI(_id);
        if (res?.data) {
            message.success('Deleted book successfully!');
            refreshTable();
        } else {
            notification.error({
                message: 'Error occurs',
                description: res.message
            })
        }
        setIsDeleteBook(false);
    };

    const handleViewBook = (book: IBookTable) => {
        setOpenViewBook(true);
        setCurrentBook(book);
    }

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, __, index) => {
                return (meta.current - 1) * meta.pageSize + index + 1;
            },
            align: 'center'
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => { handleViewBook(entity) }}>{entity._id}</a>
                )
            },
        },
        {
            title: 'Book Name',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render: (value) => {
                if (typeof value !== 'number') return '-';
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
            }
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true,
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
                        />

                        <Popconfirm
                            title="Delete the book"
                            description="Are you sure to delete this book?"
                            onConfirm={() => { handleDeleteConfirm(entity._id) }}
                            okText="Yes"
                            cancelText="No"
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteBook }}
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
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                    }

                    if (sort && Object.keys(sort).length > 0) {
                        const sortKey = Object.keys(sort)[0];
                        const sortValue = sort[sortKey] === 'ascend' ? '' : '-';
                        query += `&sort=${sortValue}${sortKey}`;
                    } else {
                        //default sort
                        query += `&sort=-updatedAt`;
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
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
                headerTitle="Table Book"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateBook(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}
            />
            <ViewBook
                openViewBook={openViewBook}
                setOpenViewBook={setOpenViewBook}
                currentBook={currentBook}
            />
            <CreateBook
                openCreateBook={openCreateBook}
                setOpenCreateBook={setOpenCreateBook}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableBook;