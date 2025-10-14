import {
  Layout,
  Button,
  Card,
  Table,
  Space,
  Tag,
  Select,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "antd/dist/reset.css";
import HeaderAdmin from "../../components/layout/HeaderAdmin";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import ArticleFormModal from "../../components/articles/ArticleFormModal";
import { GrLinkNext } from "react-icons/gr";
import { BiArrowBack } from "react-icons/bi";

const { Content } = Layout;

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

export default function ArticleManager() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const pageSize = 3;

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articleRes, entryRes] = await Promise.all([
        axios.get("http://localhost:8080/articles"),
        axios.get("http://localhost:8080/entries"),
      ]);
      //dng.
      const newArticles = articleRes.data;
      setArticles(newArticles);
      setEntries(entryRes.data);

      const totalPages = Math.ceil(newArticles.length / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Xoá bài viết
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Xoá bài viết?",
      text: "Bạn có chắc chắn muốn xoá bài viết này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:8080/articles/${id}`);
      Swal.fire("Đã xoá!", "Bài viết đã được xoá.", "success");
      fetchData();
    }
  };

  // Đổi trạng thái bài viết
  const handleStatusChange = async (value: string, record: Article) => {
    await axios.patch(`http://localhost:8080/articles/${record.id}`, {
      status: value,
    });
    Swal.fire("Cập nhật!", "Trạng thái bài viết đã thay đổi.", "success");
    fetchData();
  };

  // Mở modal thêm
  const handleAdd = () => {
    setEditMode(false);
    setSelectedArticle(null);
    setOpen(true);
  };

  // Mở modal sửa
  const handleEdit = (record: Article) => {
    setEditMode(true);
    setSelectedArticle(record);
    setOpen(true);
  };

  // Phân trang
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Cấu hình bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (src: string) => (
        <img
          src={src}
          alt="thumb"
          style={{
            width: 60,
            height: 40,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      ),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    {
      title: "Chủ đề",
      dataIndex: "entryId",
      key: "entryId",
      render: (id: number) => {
        const entry = entries.find((e) => e.id === id);
        return entry ? entry.name : "—";
      },
    },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "Public" ? (
          <Tag style={{ color: "#065F46", background: "#D1FAE5" }}>Public</Tag>
        ) : (
          <Tag style={{ color: "#991B1B", background: "#FEE2E2" }}>Private</Tag>
        ),
    },
    {
      title: "Chỉnh sửa trạng thái",
      key: "editStatus",
      render: (_: any, record: Article) => (
        <Select
          value={record.status}
          style={{ width: 100 }}
          onChange={(val) => handleStatusChange(val, record)}
          options={[
            { value: "Public", label: "Public" },
            { value: "Private", label: "Private" },
          ]}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Article) => (
        <Space>
          <Button
            size="small"
            style={{ background: "#44EF55", color: "#FFFFFF" }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            size="small"
            style={{ background: "#EF4444", color: "#FFFFFF" }}
            onClick={() => handleDelete(record.id)}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <HeaderAdmin />
      <Layout>
        <SidebarAdmin />
        <Content style={{ padding: 24 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              maxWidth: 1000,
            }}
          >
            <Button
              type="primary"
              onClick={handleAdd}
              style={{
                background: "#65558F",
                borderRadius: 999,
                height: 40,
                fontWeight: 500,
                padding: "0 18px",
              }}
            >
              Thêm mới bài viết
            </Button>

            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                paddingLeft: 256,
                margin: 0,
              }}
            >
              Quản lý bài viết
            </h2>
          </div>

          {/* Table */}
          <div style={{ maxWidth: 1000 }}>
            <Card style={{ borderRadius: 12, padding: 24, background: "#fff" }}>
              <Table
                columns={columns}
                dataSource={paginatedArticles}
                pagination={false}
                bordered
                rowKey="id"
              />
            </Card>

            {/* Phân trang */}
            <div
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <BiArrowBack /> Previous
              </Button>

              <Pagination
                current={currentPage}
                total={articles.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
              />

              <Button
                disabled={currentPage * pageSize >= articles.length}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next <GrLinkNext />
              </Button>
            </div>
          </div>
        </Content>
      </Layout>

      <ArticleFormModal
        open={open}
        setOpen={setOpen}
        editMode={editMode}
        article={selectedArticle}
        entries={entries}
        refresh={fetchData}
      />
    </Layout>
  );
}
