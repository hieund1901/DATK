import { Dropdown, Layout, Menu, Space } from "antd";
import "./style.css";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import * as React from "react";
import { useAppDispatch } from "../../hooks";
import { logoutAction } from "../../redux/slices/user.slice";
import {authLogOut} from "../../service/auth";
import {useHistory} from "react-router-dom";

const DropdownMenu = () => {
    const history = useHistory();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
      authLogOut().then(()=>{
          dispatch(logoutAction())
          history.push('/login')
      });
  };

  return (
    <Menu>
      <Menu.Item icon={<UserOutlined />} onClick={()=>{history.push('/user-profile')}} className="center-items">
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item
        icon={<LogoutOutlined />}
        className="center-items"
        danger
        onClick={handleLogout}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
};

const Header = (
  props: React.PropsWithoutRef<{ user: { userId: string; userName?: string, email: string } }>
) => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(true);
  const { user } = props;
  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Layout.Header className="header">
      <div>
        {menuOpen ? (
          <MenuFoldOutlined onClick={handleToggleMenu} />
        ) : (
          <MenuUnfoldOutlined onClick={handleToggleMenu} />
        )}
      </div>
      <Dropdown overlay={<DropdownMenu />}>
        <Space>
          <div>
            <img className="avatar" src="/avatar.png" />
          </div>
          <span>{user.email}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Layout.Header>
  );
};

export default Header;
