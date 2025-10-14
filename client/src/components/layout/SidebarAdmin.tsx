import { Button, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import Users_Group from "../../assets/image/Users_Group.png";
import Book from "../../assets/image/Book.png";
import Book_Open from "../../assets/image/Book_Open.png";
import Log_Out from "../../assets/image/Log_Out.png";

const { Sider } = Layout;

const siderItems = [
  {
    key: "users",
    icon: Users_Group,
    label: "Manage Users",
    path: "/user-manager",
  },
  {
    key: "entries",
    icon: Book,
    label: "Manage Entries",
    path: "/category-manager",
  },
  {
    key: "articles",
    icon: Book_Open,
    label: "Manage Article",
    path: "/articles-manager",
  },
  { key: "logout", icon: Log_Out, label: "Log out", path: "/login" },
];

export default function SidebarAdmin() {
  const navigate = useNavigate();

  const handleClick = (item: any) => {
    if (item.key === "logout") {
      localStorage.removeItem("admin");
    }

    navigate(item.path);
  };

  return (
    <Sider
      width={220}
      style={{ background: "transparent", margin: "50px 0 24px 24px" }}
    >
      <div style={{ padding: 16 }}>
        {siderItems.map((it) => (
          <Button
            key={it.key}
            block
            onClick={() => handleClick(it)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
              borderRadius: 8,
              background: "#e7f0ff",
              border: "none",
              color: "#1565d8",
              fontWeight: 500,
              height: 40,
              marginBottom: 8,
              textAlign: "left",
            }}
          >
            <img
              src={it.icon}
              alt=""
              style={{ width: 18, height: 18, marginRight: 6 }}
            />
            <span>{it.label}</span>
          </Button>
        ))}
      </div>
    </Sider>
  );
}
