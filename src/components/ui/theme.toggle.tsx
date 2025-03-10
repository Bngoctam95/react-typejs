import { useTheme } from "@/hooks/useTheme";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Switch } from "antd";

const ThemeToggle = () => {
    const { isDarkMode, setIsDarkMode } = useTheme();

    return (
        <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={isDarkMode}
            onChange={(checked) => setIsDarkMode(checked)}
        />
    )
}

export default ThemeToggle;