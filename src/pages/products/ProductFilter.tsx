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

type ProductsFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductsFilterProps) => {
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
              <Form.Item name={"category"} style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Category"
                  allowClear={true}
                >
                  <Select.Option value="pizza">Pizza </Select.Option>
                  <Select.Option value="beverages">Beverages</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={"restaurant"} style={{ marginBottom: 0 }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Restaurant"
                  allowClear={true}
                >
                  <Select.Option value="pizza">Pizza hub </Select.Option>
                  <Select.Option value="beverages">Softy corner</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space>
                <Switch
                  title="Show only published"
                  defaultChecked
                  onChange={() => {}}
                ></Switch>
                <Typography.Text>Show only published</Typography.Text>
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
