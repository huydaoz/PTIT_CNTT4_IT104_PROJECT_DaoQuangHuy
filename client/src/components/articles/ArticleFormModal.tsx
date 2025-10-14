import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Button,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

interface Entry {
  id: number;
  name: string;
}

interface Article {
  id: number;
  image: string;
  title: string;
  entryId: number;
  content: string;
  mood: string;
  status: string;
  date: string;
}

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  editMode: boolean;
  article: Article | null;
  entries: Entry[];
  refresh: () => void;
}

export default function ArticleFormModal({
  open,
  setOpen,
  editMode,
  article,
  entries,
  refresh,
}: Props) {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (editMode && article) {
      form.setFieldsValue(article);
      setImageUrl(article.image);
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [editMode, article, form]);

  // Upload ảnh
  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_upload_preset");
    formData.append("cloud_name", "dtv22zbpt");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dtv22zbpt/image/upload`,
        formData
      );
      setImageUrl(res.data.secure_url);
      message.success("Tải ảnh thành công!");
    } catch (error: any) {
      message.error("Lỗi khi tải ảnh!", error.message);
    }

    return false;
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!editMode) {
        const existing = await axios.get("http://localhost:8080/articles");
        const isDuplicate = existing.data.some(
          (item: Article) =>
            item.title.trim().toLowerCase() ===
            values.title.trim().toLowerCase()
        );

        if (isDuplicate) {
          Swal.fire({
            title: "Tiêu đề đã tồn tại!",
            text: "Vui lòng nhập tiêu đề khác.",
            icon: "error",
            confirmButtonText: "Đóng",
          });
          return;
        }
      }

      // Lấy userId từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.role === "admin" ? 0 : user?.id || 0;

      const payload = {
        ...values,
        image: imageUrl || values.image,
        date: new Date().toISOString().slice(0, 10),
        userId,
      };

      if (editMode && article) {
        await axios.put(
          `http://localhost:8080/articles/${article.id}`,
          payload
        );
        Swal.fire("Đã cập nhật!", "Bài viết đã được chỉnh sửa.", "success");
      } else {
        await axios.post("http://localhost:8080/articles", payload);
        Swal.fire("Thành công!", "Đã thêm bài viết mới.", "success");
      }

      form.resetFields();
      setImageUrl("");
      setOpen(false);
      refresh();
    } catch (error: any) {
      message.error("Đã xảy ra lỗi!", error.message);
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          {editMode ? "Edit Article" : "Add New Article"}
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      width={700}
      bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Title:"
          name="title"
          rules={[{ required: true, message: "Nhập tiêu đề bài viết" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Article Categories:"
          name="entryId"
          rules={[{ required: true, message: "Chọn thể loại bài viết" }]}
        >
          <Select>
            {entries.map((e) => (
              <Option key={e.id} value={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Mood:" name="mood" initialValue="Vui vẻ">
          <Select>
            <Option value="Vui vẻ">😊 Happy</Option>
            <Option value="Bình thường">😐 Normal</Option>
            <Option value="Buồn">😢 Sad</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Content:"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung bài viết" }]}
        >
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Status:" name="status" initialValue="Public">
          <Radio.Group>
            <Radio value="Public">Public</Radio>
            <Radio value="Private">Private</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Upload Image:">
          <Upload
            beforeUpload={handleUploadImage}
            showUploadList={false}
            listType="picture"
          >
            <div
              style={{
                border: "1px dashed #d9d9d9",
                borderRadius: 6,
                textAlign: "center",
                padding: "18px 0",
                cursor: "pointer",
                background: "#fafafa",
              }}
            >
              <UploadOutlined style={{ fontSize: 28, color: "#999" }} />
              <div style={{ marginTop: 6, color: "#666" }}>
                Browse and choose the files you want
                <br />
                to upload from your computer
              </div>
            </div>
          </Upload>

          {imageUrl && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ textAlign: "left", marginTop: 16 }}>
          <Button
            htmlType="submit"
            type="primary"
            style={{
              backgroundColor: "green",
              borderColor: "green",
              borderRadius: 6,
              width: 80,
            }}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
