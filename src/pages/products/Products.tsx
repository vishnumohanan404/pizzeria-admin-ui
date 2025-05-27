import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { Product } from "../../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { PER_PAGE } from "../../constants";
import { useState } from "react";
import { render } from "@testing-library/react";
import { format } from "date-fns";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} height={60} src={record.image}></Image>
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: string, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_text: string, record: Product) => {
      return (
        <Typography.Text>
          {format(new Date(record.createdAt), "dd/MM/yy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [filterForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const { data: products } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]) // Filter out empty values
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
        <Form form={filterForm} onFieldsChange={() => {}}>
          <ProductFilter>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
              Add Product
            </Button>
          </ProductFilter>
        </Form>
        <Table
          dataSource={products?.data}
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: Product) => {
                return (
                  <Space>
                    <Button type="link" onClick={() => {}}>
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => ({
                ...prev,
                currentPage: page,
              }));
            },
            showTotal: (total: number, range: number[]) =>
              `Showing ${range[0]}-${range[1]} of ${total} results`,
          }}
        />
      </Space>
    </>
  );
};

export default Products;
