import { useState, useEffect } from "react";
import { Avatar, Card, List, Typography, Space, Button, Spin } from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "./PostDetail.css";

const { Title, Text } = Typography;

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:8080/articles/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy bài viết");
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleBack = () => navigate(-1);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );

  if (!article)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Text type="danger">Không tìm thấy bài viết</Text>
      </div>
    );

  const staticComments = [
    {
      id: 1,
      avatar:
        "https://nhadepqueta.com/wp-content/uploads/2025/08/avatar-fb-mac-dinh.jpg",
      content: "Very good!",
      likes: "15 Like",
      replies: "6 Replies",
    },
    {
      id: 2,
      avatar:
        "https://nhadepqueta.com/wp-content/uploads/2025/08/avatar-fb-mac-dinh.jpg",
      content: "hello rikkei!",
      likes: "15 Like",
      replies: "6 Replies",
    },
  ];

  return (
    <div className="post-detail">
      <div className="post-back">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          aria-label="Back"
        />
      </div>

      <div className="post-main">
        <List.Item.Meta
          avatar={
            <Avatar src="https://nhadepqueta.com/wp-content/uploads/2025/08/avatar-fb-mac-dinh.jpg" />
          }
        />
        <Card bordered={false} className="post-card">
          <div className="post-title-box">
            <Title level={4} className="post-title">
              {article.title}
            </Title>
          </div>

          <div className="post-body">
            <Text>{article.content}</Text>
          </div>

          <div className="post-actions">
            <Space>
              <span className="action-item">
                <span style={{ marginLeft: 6 }}>15 Like</span> <LikeOutlined />
              </span>
              <span className="action-item">
                <span style={{ marginLeft: 6 }}>6 Replies</span>{" "}
                <MessageOutlined />
              </span>
            </Space>
          </div>
        </Card>
      </div>

      <div className="view-all" style={{ marginLeft: 35 }}>
        <Text style={{ color: "#047857", fontWeight: 600 }}>
          View all 12 comments
        </Text>
        <DownOutlined style={{ marginLeft: 8, color: "#047857" }} />
      </div>

      <div className="comments-inline" style={{ marginLeft: 35 }}>
        <List
          itemLayout="horizontal"
          dataSource={staticComments}
          renderItem={(item) => (
            <List.Item className="comment-list-item">
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                description={
                  <div className="comment-bubble">
                    <div>{item.content}</div>
                    <div
                      style={{
                        marginTop: 7,
                        color: "#888",
                        fontSize: 13,
                        display: "flex",
                        gap: 15,
                      }}
                    >
                      <span>
                        {item.likes} <LikeOutlined />
                      </span>
                      <span>
                        {item.replies} <MessageOutlined />
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
