import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";
import { useAuthStore } from "../../store";

type ProductsFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductsFilterProps) => {
  const { user } = useAuthStore();
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      return getTenants(`perPage=100&currentPage=1`);
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getCategories();
    },
  });
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={18}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name={"q"} style={{ marginBottom: 0 }}>
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={"categoryId"} style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Category"
                  allowClear={true}
                >
                  {categories?.data.map((category: Category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {user!.role === "admin" && (
              <Col span={6}>
                <Form.Item name={"tenantId"} style={{ marginBottom: 0 }}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Restaurant"
                    allowClear={true}
                  >
                    {restaurants?.data.data.map((restaurant: Tenant) => (
                      <Select.Option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col span={6}>
              <Space>
                <Form.Item name={"isPublish"}>
                  <Switch onChange={() => {}}></Switch>
                </Form.Item>
                <Typography.Text style={{ marginBottom: 22, display: "block" }}>
                  Show only published
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilter;
