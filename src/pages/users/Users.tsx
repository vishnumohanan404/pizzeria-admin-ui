import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { CreateUserData, User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";

const columns = [
  { title: "ID", key: "id", dataIndex: "id" },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const Users = () => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  const queryClient = useQueryClient();
  const { mutate: userMutation } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const onHandleSubmit = async () => {
    await form.validateFields();
    await userMutation(form.getFieldsValue());
    setDrawerOpen(false);
    form.resetFields();
  };
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      return getUsers(queryString).then((res) => res.data);
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter onFilterChange={() => {}}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UsersFilter>
        <Table
          dataSource={users?.data}
          columns={columns}
          rowKey={"id"}
          pagination={{
            total: users?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => ({
                ...prev,
                currentPage: page,
              }));
            },
          }}
        />
        <Drawer
          title="Create User"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          styles={{ body: { background: colorBgLayout } }}
          onClose={() => {
            setDrawerOpen(false);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
