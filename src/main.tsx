import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from '@/layout';
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import 'styles/globe.scss'
import HomePage from 'pages/client/home';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from '@/context/app.context';
import ProtectedRoute from 'components/auth';
import LayoutAdmin from 'components/layout/layout.admin';
import DashboardPage from 'pages/admin/dashboard';
import ManaBookPage from 'pages/admin/manage.book';
import ManaUserPage from 'pages/admin/manage.user';
import ManaOrderPage from 'pages/admin/manage.order';
import enUS from 'antd/locale/en_US';
import { ThemeProvider } from '@/context/theme.context';
import ProfileAdmin from 'pages/admin/profile.admin';
import SettingAdmin from 'pages/admin/setting.admin';
import './i18n';

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <HomePage />
                },
                {
                    path: "/book",
                    element: <BookPage />,
                },
                {
                    path: "/about",
                    element: <AboutPage />,
                },
                {
                    path: "/checkout",
                    element: (
                        <ProtectedRoute>
                            <div>Checkout page</div>
                        </ProtectedRoute>
                    ),
                },
            ]
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/register",
            element: <RegisterPage />,
        },
        {
            path: "admin",
            element: <LayoutAdmin />,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "book",
                    element: (
                        <ProtectedRoute>
                            <ManaBookPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "user",
                    element: (
                        <ProtectedRoute>
                            <ManaUserPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "order",
                    element: (
                        <ProtectedRoute>
                            <ManaOrderPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "profile",
                    element: (
                        <ProtectedRoute>
                            <ProfileAdmin />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "settings",
                    element: (
                        <ProtectedRoute>
                            <SettingAdmin />
                        </ProtectedRoute>
                    ),
                },
            ]
        },
    ],
    {
        future: {
            v7_relativeSplatPath: true,
        },
    }
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <ConfigProvider locale={enUS}>
                    <ThemeProvider>
                        <RouterProvider
                            router={router}
                            future={{
                                v7_startTransition: true,
                            }}
                        />
                    </ThemeProvider>
                </ConfigProvider>
            </AppProvider>
        </App>
    </StrictMode>,
)
