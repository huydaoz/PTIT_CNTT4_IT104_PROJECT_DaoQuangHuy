import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Pagination,
  Spin,
  Button,
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AppHeader from "../../layouts/Header/Header";
import AppFooter from "../../layouts/Footer/Footer";
import axios from "axios";
import ArticleFormModal from "../../components/articles/ArticleFormModal";
import { BiArrowBack } from "react-icons/bi";
import { GrLinkNext } from "react-icons/gr";

const { Title, Text } = Typography;

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  status: string;
  entryId: number;
  userId: number;
  mood: string;
}

interface Entry {
  id: number;
  name: string;
}

export default function MyPosts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, entriesRes] = await Promise.all([
        axios.get("http://localhost:8080/articles"),
        axios.get("http://localhost:8080/entries"),
      ]);

      const userArticles = articlesRes.data.filter(
        (a: Article) => a.userId === currentUser.id
      );

      setArticles(userArticles);
      setEntries(entriesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingArticle(null);
    setModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditMode(true);
    setEditingArticle(article);
    setModalOpen(true);
  };

  const getEntryName = (entryId: number) => {
    const entry = entries.find((e) => e.id === entryId);
    return entry ? entry.name : "Không xác định";
  };

  // Phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = articles.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <>
        <AppHeader />
        <div style={{ textAlign: "center", padding: 100 }}>
          <Spin size="large" />
        </div>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px" }}>
        {/* ADD NEW ARTICLE */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
            cursor: "pointer",
            color: "#0D6EFD",
          }}
        >
          <h2 onClick={openAddModal}>ADD NEW ARTICLE</h2>
        </div>

        {articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: 100 }}>
            <Title level={4}>Bạn chưa có bài viết nào.</Title>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {paginatedArticles.map((post) => (
              <Col xs={24} sm={12} md={8} key={post.id}>
                <Card
                  hoverable
                  onClick={() =>
                    (window.location.href = `/post-detail/${post.id}`)
                  }
                  cover={
                    <img
                      alt={post.title}
                      src={post.image}
                      style={{
                        height: 200,
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                  }
                >
                  <Text
                    type="secondary"
                    style={{ color: "#6941C6", fontWeight: 500 }}
                  >
                    Date: {post.date}
                  </Text>
                  <Title
                    level={5}
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {post.title} <ExportOutlined />
                  </Title>
                  <Text>{post.content}</Text>
                  <br />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tag color="blue" style={{ marginTop: 8 }}>
                      {getEntryName(post.entryId)}
                    </Tag>
                    <Tag
                      style={{ marginTop: 8, cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(post);
                      }}
                    >
                      <a style={{ fontSize: 12, color: "red" }}>
                        Edit your post
                      </a>
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Phân trang */}
        {articles.length > pageSize && (
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
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <BiArrowBack /> Previous
            </Button>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={articles.length}
              onChange={(page) => setCurrentPage(page)}
            />

            <Button
              disabled={currentPage * pageSize >= articles.length}
              onClick={() =>
                setCurrentPage((p) =>
                  p * pageSize < articles.length ? p + 1 : p
                )
              }
            >
              Next <GrLinkNext />
            </Button>
          </div>
        )}
      </div>

      <ArticleFormModal
        open={modalOpen}
        setOpen={setModalOpen}
        editMode={editMode}
        article={editingArticle}
        entries={entries}
        refresh={fetchData}
      />
    </>
  );
}
