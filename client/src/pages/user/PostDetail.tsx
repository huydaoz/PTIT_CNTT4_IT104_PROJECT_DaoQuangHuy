import { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  List,
  Typography,
  Input,
  Button,
  Space,
  Modal,
  Spin,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "./PostDetail.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const initialComments = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
  content:
    i === 0
      ? "very good!"
      : i === 1
      ? "hello rikkei!"
      : "Great post — thanks for sharing. I enjoyed reading your thoughts!",
  datetime: `${i + 1}h`,
  likes: Math.floor(Math.random() * 30),
  replies: Math.floor(Math.random() * 10),
}));

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newItem = {
      id: comments.length + 1,
      author: "Bạn",
      avatar: "https://i.pravatar.cc/40?img=65",
      content: newComment,
      datetime: "Vừa xong",
      likes: 0,
      replies: 0,
    };
    setComments([newItem, ...comments]);
    setNewComment("");
  };

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

  return (
    <div className="post-detail">
      {/* Back button */}
      <div className="post-back">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          aria-label="Back"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 5,
        }}
      >
        <List.Item.Meta
          avatar={
            <Avatar src="https://nhadepqueta.com/wp-content/uploads/2025/08/avatar-fb-mac-dinh.jpg" />
          }
        />
        {/* Main post */}
        <Card bordered={false} className="post-card">
          <div className="post-title-box">
            <Title level={4} className="post-title">
              {article.title}
            </Title>
          </div>

          <div className="post-body">
            <Text>{article.content}</Text>
          </div>

          {/* actions */}
          <div className="post-actions">
            <Space>
              <span className="action-item">
                <LikeOutlined /> <span style={{ marginLeft: 6 }}>15 Like</span>
              </span>
              <span className="action-item">
                <MessageOutlined />{" "}
                <span style={{ marginLeft: 6 }}>{comments.length} Replies</span>
              </span>
            </Space>
          </div>
        </Card>
      </div>

      {/* View all comments link */}
      <div
        className="view-all"
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsModalOpen(true);
        }}
        style={{ marginLeft: 35 }}
      >
        <Text style={{ color: "#1890ff", fontWeight: 600 }}>
          View all {comments.length} comments
        </Text>
        <DownOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
      </div>

      {/* Few inline comments */}
      <div className="comments-inline" style={{ marginLeft: 35 }}>
        <List
          itemLayout="horizontal"
          dataSource={comments.slice(0, 2)}
          renderItem={(item) => (
            <List.Item className="comment-list-item">
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                description={
                  <div className="comment-bubble">{item.content}</div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Add comment input */}
      <div className="add-comment-box">
        <Avatar src="https://i.pravatar.cc/40?img=65" />
        <TextArea
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onPressEnter={handleAddComment}
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ marginLeft: 12 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleAddComment}
          style={{ marginLeft: 12 }}
        />
      </div>

      {/* Modal: all comments */}
      <Modal
        title={`All ${comments.length} comments`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={760}
      >
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(item) => (
            <List.Item className="comment-list-item-modal">
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                description={
                  <div className="comment-bubble">{item.content}</div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
