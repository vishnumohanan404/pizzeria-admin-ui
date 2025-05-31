import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { FieldData, Product } from "../../types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { PER_PAGE } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./forms/helpers";

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
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [selectedProduct, setCurrentProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (selectedProduct) {
      setDrawerOpen(true);

      const priceConfiguration = Object.entries(
        selectedProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });
        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});
      const attributes = selectedProduct?.attributes.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: item.value,
        };
      });
      form.setFieldsValue({
        ...selectedProduct,
        priceConfiguration: priceConfiguration,
        attributes: attributes,
        categoryId: selectedProduct.category._id,
      });
    }
  }, [selectedProduct, form]);

  const { user } = useAuthStore();
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
  });
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
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

  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);
  const onFilterChange = async (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        page: 1,
      }));
    }
  };

  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) => {
      if (selectedProduct) {
        return updateProduct(data, selectedProduct._id).then((res) => res.data);
      } else {
        return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );
    const categoryId = form.getFieldValue("categoryId");
    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      image: form.getFieldValue("image"),
      priceConfiguration: pricing,
      categoryId: categoryId,
      attributes: attributes,
      tenantId:
        user!.role === "manager"
          ? user?.tenant?.id
          : form.getFieldValue("tenantId"),
    };
    const formData = makeFormData(postData);
    await productMutate(formData);
  };

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
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: "24" }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">
              {error instanceof Error ? error.message : "Something went wrong"}
            </Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
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
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentProduct(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          rowKey={"name"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              setQueryParams((prev) => ({
                ...prev,
                page: page,
              }));
            },
            showTotal: (total: number, range: number[]) =>
              `Showing ${range[0]}-${range[1]} of ${total} results`,
          }}
        />
        <Drawer
          title={selectedProduct ? "Update Product" : "Add Product"}
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          styles={{ body: { background: colorBgLayout } }}
          onClose={() => {
            setCurrentProduct(null);
            setDrawerOpen(false);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setCurrentProduct(null);
                  setDrawerOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={onHandleSubmit}
                loading={isCreateLoading}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm form={form} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
