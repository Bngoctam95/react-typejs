import { formatDate } from "@/services/helper";
import { Avatar, Badge, Descriptions, DescriptionsProps, Drawer } from "antd";

interface IProps {
    openViewUser: boolean;
    setOpenViewUser: (v: boolean) => void;
    currentUser: IUserTable | null;
}

const ViewUser = ({ openViewUser, setOpenViewUser, currentUser }: IProps) => {
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${currentUser?.avatar}`;
    const items: DescriptionsProps['items'] = [
        {
            label: 'Id',
            children: currentUser?._id,
        },
        {
            label: 'Full Name',
            children: currentUser?.fullName,
        },
        {
            label: 'Email',
            children: currentUser?.email,
        },
        {
            label: 'Phone',
            children: currentUser?.phone,
        },
        {
            label: 'Role',
            children: <Badge status="processing" text={currentUser?.role} />,
        },
        {
            label: 'Avatar',
            children: <Avatar src={urlAvatar} />,
        },
        {
            label: 'Created At',
            children: formatDate(currentUser?.createdAt),
        },
        {
            label: 'Updated At',
            children: formatDate(currentUser?.updatedAt),
        },
    ];

    const onClose = () => {
        setOpenViewUser(false);
    };

    return (
        <Drawer
            title="View user"
            width={720}
            onClose={onClose}
            open={openViewUser}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
        >
            <Descriptions title="User Info" bordered items={items} column={2} />
        </Drawer>
    )
}

export default ViewUser;