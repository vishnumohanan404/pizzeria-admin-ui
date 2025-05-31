import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Category, Tenant } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";

const ProductForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const selectedCategory = Form.useWatch("categoryId");
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getCategories();
    },
  });

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      return getTenants(`perPage=100&currentPage=1`);
    },
  });

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpegOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpegOrPng) {
        messageApi.error("You can only upload JPG/PNG file!");
      }
      // todo: size validation
      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"}>
          <Card title="Product Info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name is required",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category is required",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Category"
                    size="large"
                  >
                    {categories?.data.map((category: Category) => (
                      <Select.Option
                        key={category._id}
                        value={JSON.stringify(category)}
                      >
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    style={{ resize: "none" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product Image" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label=""
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please upload a product image",
                    },
                  ]}
                >
                  {contextHolder}
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    {...uploaderConfig}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      ></img>
                    ) : (
                      <Space direction="vertical">
                        <PlusOutlined />
                        <Typography.Text>Upload</Typography.Text>
                      </Space>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Tenant Info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Restaurant is required",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={() => {}}
                    placeholder="Select Restaurant"
                    size="large"
                  >
                    {restaurants?.data?.map((tenant: Tenant) => (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}
          <Card title="Other Properties" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Space>
                  <Form.Item name={"isPublish"}>
                    <Switch
                      onChange={() => {}}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    ></Switch>
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
