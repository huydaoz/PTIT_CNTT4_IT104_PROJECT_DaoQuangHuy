import { Avatar, Badge, Tooltip, Dropdown, Layout } from "antd";
import { MailOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function HeaderAdmin() {
  const profileMenuItems = [
    { key: "profile", label: "Profile" },
    { key: "settings", label: "Settings" },
    { key: "logout", label: "Log out" },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "8px 30px",
        paddingTop: 15,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 30,
        }}
      >
        <Tooltip title="Messages">
          <Badge count={2} size="small" style={{ backgroundColor: "#4F46E5" }}>
            <MailOutlined style={{ fontSize: 18 }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Notifications">
          <Badge dot style={{ backgroundColor: "#4F46E5" }}>
            <BellOutlined style={{ fontSize: 18 }} />
          </Badge>
        </Tooltip>
        <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </div>
    </Header>
  );
}
