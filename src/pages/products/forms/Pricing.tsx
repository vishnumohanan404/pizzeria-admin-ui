import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { Category } from "../../../types";

type PricingProps = {
  selectedCategory: string;
};
const Pricing = ({ selectedCategory }: PricingProps) => {
  const category: Category | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null; // Assuming selectedCategory is a string ID, you might need to fetch the category details based on this ID
  if (!category) {
    return null;
  }
  return (
    <Card
      title={<Typography.Text>Product Price</Typography.Text>}
      variant="borderless"
    >
      {Object.entries(category?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space
                direction="vertical"
                size={"large"}
                style={{ width: "100%" }}
              >
                <Typography.Text>
                  {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>
                <Row gutter={20}>
                  {configurationValue.availableOptions.map((option: string) => {
                    return (
                      <Col span={8} key={option}>
                        <Form.Item
                          label={option}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter={"₹"} />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
