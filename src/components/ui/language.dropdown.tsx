import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from 'antd';
import i18n from '@/i18n';

const LanguageDropdown = () => {
    const languageItems: MenuProps['items'] = [
        {
            key: 'en',
            label: 'English',
            onClick: () => i18n.changeLanguage('en')
        },
        {
            key: 'vi',
            label: 'Tiếng Việt',
            onClick: () => i18n.changeLanguage('vi')
        }
    ];

    return (
        <Dropdown
            menu={{
                items: languageItems,
                selectable: true,
                selectedKeys: [i18n.language]
            }}
            trigger={['click']}
        >
            <Button>
                <Space>
                    {i18n.language.toUpperCase()}
                    <span>🌐</span>
                </Space>
            </Button>
        </Dropdown>
    )
}

export default LanguageDropdown;