import {
  Tabs,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Pagination,
  Space,
  Spin,
} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppHeader from "../../layouts/Header/Header";
import AppFooter from "../../layouts/Footer/Footer";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  image: string;
  status: string;
  entryId: number;
  userId: number;
}

interface Entry {
  id: number;
  name: string;
}

export default function Home() {
  const navigate = useNavigate();

  // State
  const [activeKey, setActiveKey] = useState<string>("1");
  const [articles, setArticles] = useState<Article[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 6;

  // Lấy dữ liệu từ server
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/articles").then((res) => res.json()),
      fetch("http://localhost:8080/entries").then((res) => res.json()),
    ])
      .then(([articlesData, entriesData]) => {
        const publicPosts = articlesData.filter(
          (item: Article) => item.status === "Public"
        );

        setArticles(publicPosts);
        setEntries(entriesData);
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  // Chuyển tab My Posts
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === "2") navigate("/my-posts");
  };

  // Lấy tên mục từ ID
  const getEntryName = (entryId: number): string => {
    const entry = entries.find((e) => e.id === entryId);
    return entry ? entry.name : "Không xác định";
  };

  // Lọc bài viết theo mục
  const filteredArticles =
    selectedEntry === null
      ? articles
      : articles.filter((a) => a.entryId === selectedEntry);

  // Phân trang
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Hiển thị khi đang tải
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Không có bài viết
  if (articles.length === 0) {
    return (
      <>
        <AppHeader />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Title level={4}>Không có bài viết công khai nào.</Title>
        </div>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <Title level={3}>Recent blog posts</Title>

        {/* Phần bài viết nổi bật */}
        <Row gutter={32}>
          <Col span={12}>
            <Card
              hoverable
              cover={
                <img
                  alt={articles[0].title}
                  src={articles[0].image}
                  style={{
                    height: 320,
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
                Date: {articles[0].date}
              </Text>
              <Title level={4} style={{ marginTop: 10 }}>
                {articles[0].title}
              </Title>
              <Text>{articles[0].content}</Text>
              <br />
              <Tag color="blue" style={{ marginTop: 8 }}>
                {getEntryName(articles[0].entryId)}
              </Tag>
            </Card>
          </Col>

          {/* Hai bài tiếp theo */}
          <Col span={12}>
            <Row gutter={[0, 24]}>
              {articles.slice(1, 3).map((post) => (
                <Col span={24} key={post.id}>
                  <Card hoverable>
                    <div style={{ display: "flex", gap: 16 }}>
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{
                          width: "55%",
                          height: 190,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text
                          type="secondary"
                          style={{ color: "#6941C6", fontWeight: 500 }}
                        >
                          Date: {post.date}
                        </Text>
                        <Title level={5} style={{ marginTop: 5 }}>
                          {post.title}
                        </Title>
                        <Text>{post.content}</Text>
                        <br />
                        <Tag color="green" style={{ marginTop: 8 }}>
                          {getEntryName(post.entryId)}
                        </Tag>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/*All blog posts */}
        <div style={{ marginTop: 50 }}>
          <Tabs activeKey={activeKey} onChange={handleTabChange}>
            <TabPane tab="All blog posts" key="1">
              {/* Lọc theo mục*/}
              <div style={{ marginBottom: 20 }}>
                <Space size={[8, 12]} wrap>
                  <Tag
                    color={selectedEntry === null ? "blue" : "default"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedEntry(null);
                      setCurrentPage(1);
                    }}
                  >
                    Tất cả
                  </Tag>

                  {entries.map((entry) => (
                    <Tag
                      key={entry.id}
                      color={selectedEntry === entry.id ? "blue" : "default"}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedEntry(entry.id);
                        setCurrentPage(1);
                      }}
                    >
                      {entry.name}
                    </Tag>
                  ))}
                </Space>
              </div>

              {/* Danh sách bài viết */}
              <Row gutter={[24, 24]} align="stretch">
                {paginatedArticles.map((post) => (
                  <Col xs={24} sm={12} md={8} key={post.id}>
                    <Card
                      hoverable
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
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
                      onClick={() =>
                        (window.location.href = `/post-detail/${post.id}`)
                      }
                    >
                      <div>
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
                      </div>

                      <Tag color="blue" style={{ marginTop: 8 }}>
                        {getEntryName(post.entryId)}
                      </Tag>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Phân trang */}
              {filteredArticles.length > pageSize && (
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
                    Previous
                  </Button>

                  <Pagination
                    current={currentPage}
                    total={filteredArticles.length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                  />

                  <Button
                    disabled={currentPage * pageSize >= filteredArticles.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabPane>

            <TabPane tab="My posts" key="2" />
          </Tabs>
        </div>
      </div>

      <AppFooter />
    </>
  );
}
