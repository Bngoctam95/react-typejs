import { DashboardOutlined, LogoutOutlined, ProfileOutlined, SearchOutlined, SettingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Dropdown, Input, MenuProps, Modal, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentApp } from '@/hooks/useCurrentApp';
import { logoutAPI } from "services/api";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "components/ui/language.dropdown";
import ThemeToggle from "components/ui/theme.toggle";

const AppHeader = () => {
    const [cartItemsCount] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();
    const { t } = useTranslation();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const handleSearch = (value: string) => {
        console.log('Search query:', value);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === "logout") {
            setIsModalOpen(true);
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
        }
    };

    const items: MenuProps['items'] = [
        ...(user?.role === 'ADMIN'
            ? [{
                key: 'admin',
                label: <Link to="/admin">{t("header.admin")}</Link>,
                icon: <DashboardOutlined />
            }]
            : []),
        {
            key: 'profile',
            label: <Link to="/profile">{t("header.profile")}</Link>,
            icon: <ProfileOutlined />
        },
        {
            key: 'settings',
            label: <Link to="/settings">{t("header.settings")}</Link>,
            icon: <SettingOutlined />
        },
        {
            key: 'logout',
            label: t("admin.logout"),
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => setIsModalOpen(true)
        }
    ];

    return (
        <Header style={{
            backgroundColor: "white"
        }}>
            <Row align={"middle"} style={{ height: "100%" }}>
                <Col xs={16} md={4}>
                    <Link to="/">
                        <img
                            src="src/assets/fancamping.jpg"
                            alt="Logo"
                            style={{
                                height: 40,
                                marginRight: 24
                            }}
                        />
                    </Link>
                </Col>
                <Col xs={0} md={16}>
                    <div style={{ display: 'flex', alignItems: "center", gap: 40 }}>
                        <Input
                            placeholder={t("header.searchTitle")}
                            prefix={<SearchOutlined />}
                            style={{
                                width: 600
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onPressEnter={() => handleSearch(searchQuery)}
                        />

                        <Badge count={cartItemsCount} style={{ marginRight: 24 }}>
                            <Link to="/cart">
                                <ShoppingCartOutlined
                                    style={{
                                        fontSize: 24,
                                        color: 'rgba(0, 0, 0, 0.65)'
                                    }}
                                />
                            </Link>
                        </Badge>
                    </div>
                </Col>
                <Col xs={16} md={4} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 10 }}>
                    <LanguageDropdown />
                    <ThemeToggle />
                    {isAuthenticated === false ?
                        <Button type="primary"><Link to="/login">{t("header.login")}</Link></Button>
                        :
                        <>
                            <Dropdown
                                menu={{
                                    items: items,
                                    onClick: handleMenuClick,
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
                                    }}
                                />
                            </Dropdown>
                            <Modal
                                title={t("header.logoutTitle")}
                                open={isModalOpen}
                                onOk={handleLogout}
                                onCancel={() => setIsModalOpen(false)}
                                okText={t("header.logoutText")}
                                cancelText={t("header.logoutCancel")}
                                confirmLoading={logoutLoading}
                            >
                                <p>{t("header.logoutConfirm")}</p>
                            </Modal>
                        </>
                    }
                </Col>
            </Row>
        </Header>
    );
}

export default AppHeader;