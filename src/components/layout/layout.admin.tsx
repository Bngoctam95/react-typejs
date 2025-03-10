import React, { useState } from 'react';
import {
    BookOutlined,
    DashboardOutlined,
    DollarCircleOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Modal, Row, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/hooks/useCurrentApp';
import { logoutAPI } from 'services/api';
import { useTranslation } from 'react-i18next';
import ThemeToggle from 'components/ui/theme.toggle';
import LanguageDropdown from 'components/ui/language.dropdown';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useCurrentApp();
    const navigate = useNavigate();
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const { t } = useTranslation();

    const sidebarItems: MenuItem[] = [
        getItem(<Link to="/admin">{t('admin.dashboard')}</Link>, 'dashboard', <DashboardOutlined />),
        getItem(t('admin.manageUsers'), '1', <UserOutlined />, [
            getItem(<Link to="/admin/user">{t('admin.crud')}</Link>, 'user'),
        ]),
        getItem(<Link to="/admin/book">{t('admin.manageBooks')}</Link>, 'book', <BookOutlined />),
        getItem(<Link to="/admin/order">{t('admin.manageOrders')}</Link>, 'order', <DollarCircleOutlined />),
    ];

    const profileDropdownItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: t('admin.profile'),
            icon: <UserOutlined />,
        },
        {
            key: 'settings',
            label: t('admin.settings'),
            icon: <SettingOutlined />,
        },
        {
            key: 'logout',
            label: t('admin.logout'),
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === "logout") {
            setIsModalOpen(true);
        } else {
            navigate(e.key);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            setIsModalOpen(false);
            setLogoutLoading(false);
            navigate('/login');
        }
    };

    if (isAuthenticated === false) {
        return <Outlet />;
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAdminRoute === true && isAuthenticated === true) {
        const role = user?.role;
        if (role === "USER") {
            return <Outlet />;
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                    <img src="src/assets/fancamping.jpg" alt="Logo" style={{ width: '50px' }} />
                </div>
                <Menu theme="dark" defaultSelectedKeys={[activeMenu]} mode="inline" items={sidebarItems} onClick={(e) => setActiveMenu(e.key)} />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer
                }}>
                    <Row>
                        <Col span={12}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>
                        <Col span={12} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 10 }}>
                            <LanguageDropdown />
                            <ThemeToggle />
                            <Dropdown
                                menu={{
                                    items: profileDropdownItems,
                                    onClick: handleMenuClick
                                }}
                                trigger={['click']}
                                placement="bottomRight"
                                arrow
                            >
                                <Avatar
                                    src={urlAvatar}
                                    style={{
                                        border: '1px solid #1890ff',
                                        cursor: 'pointer',
                                        marginRight: 20
                                    }}
                                />
                            </Dropdown>
                            <Modal
                                title="Xác nhận đăng xuất"
                                open={isModalOpen}
                                onOk={handleLogout}
                                onCancel={() => setIsModalOpen(false)}
                                okText="Đăng xuất"
                                cancelText="Hủy"
                                confirmLoading={logoutLoading}
                            >
                                <p>Bạn có chắc chắn muốn đăng xuất?</p>
                            </Modal>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;