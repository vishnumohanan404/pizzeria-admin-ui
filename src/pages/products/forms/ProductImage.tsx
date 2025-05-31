import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      <Upload listType="picture-card" maxCount={1} {...uploaderConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }}></img>
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
