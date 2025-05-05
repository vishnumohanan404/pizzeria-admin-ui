import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Restaurants from "../components/icons/Restaurants";
import Home from "../components/icons/Home";
import Products from "../components/icons/Products";
import Promos from "../components/icons/Promos";
import Users from "../components/icons/Users";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const { Sider, Header, Content, Footer } = Layout;

const items = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={"/"}>Home</NavLink>,
  },
  {
    key: "/users",
    icon: <Icon component={Users} />,
    label: <NavLink to={"/users"}>Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <Icon component={Restaurants} />,
    label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
  },
  {
    key: "/products",
    icon: <Icon component={Products} />,
    label: <NavLink to={"/products"}>Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <Icon component={Promos} />,
    label: <NavLink to={"/promos"}>Promos</NavLink>,
  },
];

const Dashboard = () => {
  const { logOut } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logOut();
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge text="Global" status="success"></Badge>
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar style={{ backgroundColor: "", color: "" }}>U</Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Pizzeria</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
