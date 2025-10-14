import {
  Layout,
  Input,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Card,
  List,
} from "antd";
import type { MenuProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

export default function AppHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    lastname?: string;
    image?: string;
    email?: string;
  } | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    // Lấy user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Lấy danh sách bài viết để tìm kiếm
    axios.get("http://localhost:8080/articles").then((res) => {
      setArticles(res.data);
    });
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất?",
      text: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        setUser(null);
        Swal.fire({
          icon: "success",
          title: "Đăng xuất thành công!",
          showConfirmButton: false,
          timer: 1200,
        });
        navigate("/login");
      }
    });
  };

  // Khi người dùng nhập từ khóa tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword.trim() === "") {
      setSearchResults([]);
      setSearchVisible(false);
      return;
    }

    const filtered = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.content.toLowerCase().includes(keyword)
    );

    setSearchResults(filtered);
    setSearchVisible(true);
  };

  // Khi click vào một bài viết
  const handleSelectArticle = (id: number) => {
    setSearchVisible(false);
    navigate(`/post-detail/${id}`);
  };

  // Menu dropdown user
  const menuItems: MenuProps["items"] = [
    {
      key: "info",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            src={user?.image}
            size={40}
            style={{ backgroundColor: "#1677ff" }}
          >
            {!user?.image && user?.lastname?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{user?.lastname || "User"}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    { key: "profile", label: "View profile" },
    { key: "update-picture", label: "Update profile picture" },
    { key: "change-password", label: "Change password" },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <Text
          style={{ cursor: "pointer", color: "red" }}
          onClick={handleLogout}
        >
          Log out
        </Text>
      ),
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/src/assets/image/logo.png"
          alt="logo"
          style={{ width: 30, height: 30 }}
        />
        <span
          style={{ fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          RIKKEI_EDU_BLOG
        </span>
      </div>

      {/* Search Box */}
      <div
        style={{
          flex: 1,
          margin: "0 300px",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Search
          placeholder="Search for articles"
          enterButton={<SearchOutlined />}
          size="middle"
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setSearchVisible(false), 200)}
          onFocus={() => {
            if (searchResults.length > 0) setSearchVisible(true);
          }}
        />

        {/* Hiển thị kết quả tìm kiếm */}
        {searchVisible && searchResults.length > 0 && (
          <Card
            style={{
              position: "absolute",
              top: 40,
              width: "100%",
              zIndex: 10,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              maxHeight: 250,
              overflowY: "auto",
            }}
          >
            <List
              dataSource={searchResults}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectArticle(item.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Text
                        type="secondary"
                        ellipsis={{ tooltip: item.content }}
                      >
                        {item.content.slice(0, 100)}...
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>

      {/* Avatar hoặc nút đăng nhập */}
      {user ? (
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              src={user?.image}
              style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
            >
              {!user?.image && user?.lastname?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Space>
        </Dropdown>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button href="/register">Sign up</Button>
          <Button href="/login">Sign in</Button>
        </div>
      )}
    </Header>
  );
}
