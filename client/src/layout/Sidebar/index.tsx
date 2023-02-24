import { Menu, Layout } from "antd";
import "./style.css";
import menuItems from "./menuItems";
import { Redirect, useHistory } from "react-router-dom";

const Sidebar = (activeItemId) => {
  const history = useHistory();
  function redirect(path) {
    history.push(path);
  }

  return (
    <Layout.Sider className="sidebar" width={250}>
      <div className="logo">
        <img height="72px" src="/logo192.png" />
      </div>
      <Menu
        className="main-nav"
        mode="inline"
        defaultSelectedKeys={[menuItems[0].id]}>
        {menuItems.map((item) => (
          <Menu.Item
            key={item.id}
            className={
              activeItemId == item.id
                ? "custom-background ant-menu-item-selected"
                : "custom-background"
            }>
            <div
              className="menu-item"
              onClick={() => {
                redirect(item.path);
              }}>
              <span className="mg-right-sm">{item.icon}</span>
              <span>{item.title}</span>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  );
};

export default Sidebar;
