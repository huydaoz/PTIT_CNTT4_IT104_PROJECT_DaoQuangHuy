import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/layout/HeaderAdmin";
import {
  Layout,
  Avatar,
  Button,
  Input,
  Row,
  Col,
  Table,
  Space,
  Card,
  Pagination,
  Spin,
  message,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import SidebarAdmin from "../../components/layout/SidebarAdmin";
import { GrLinkNext } from "react-icons/gr";
import { BiArrowBack } from "react-icons/bi";

const { Content } = Layout;

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  status: string;
  avatar?: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/users");

        const usersWithName = [...res.data].map((u: any) => ({
          ...u,
          name: `${u.firstname} ${u.lastname}`,
          username: `@${u.lastname.toLowerCase()}`,
        }));

        setUsers(usersWithName);
      } catch (error: any) {
        message.error("Lấy dữ liệu thất bại!", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm cập nhật trạng thái
  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8080/users/${id}`, {
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );

      message.success(newStatus === "Đã chặn" ? "Đã chặn!" : "Đã chặn!");
    } catch (error: any) {
      message.error("Cập nhật trạng thái thất bại!", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    const t = searchText.trim().toLowerCase();
    if (!t) return users;
    return users.filter((u) =>
      [u.name, u.username, u.email].some((v) => v.toLowerCase().includes(t))
    );
  }, [searchText, users]);

  // Phân trang
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  // Cấu hình cột
  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: User) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>
              {record.username}
            </div>
          </div>
        </div>
      ),
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: (a: User, b: User) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <span
          style={{
            color: status === "Đã chặn" ? "#d32f2f" : "#2e7d32",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "action",
      width: 160,
      align: "center",
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            style={{
              background: "#F9F5FF",
              color: "#6a1b9a",
              border: "none",
              borderRadius: "999px",
              fontWeight: 500,
              opacity: record.status === "Đã chặn" ? 0.5 : 1,
              cursor: record.status === "Đã chặn" ? "not-allowed" : "pointer",
            }}
            disabled={record.status === "Đã chặn"}
            onClick={() => handleChangeStatus(record.id, "Đã chặn")}
          >
            Block
          </Button>

          <Button
            size="small"
            style={{
              background: "#EFF8FF",
              color: "#175CD3",
              border: "none",
              borderRadius: "999px",
              fontWeight: 500,
              opacity: record.status === "Hoạt động" ? 0.5 : 1,
              cursor: record.status === "Hoạt động" ? "not-allowed" : "pointer",
            }}
            disabled={record.status === "Hoạt động"}
            onClick={() => handleChangeStatus(record.id, "Hoạt động")}
          >
            Unblock
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

        <Content style={{ paddingLeft: 24 }}>
          <div style={{ maxWidth: 1000 }}>
            <Card style={{ background: "transparent" }}>
              <Row justify={"space-between"}>
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    background: "#FFFFFF",
                    height: 50,
                    padding: "24px",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    Team members
                  </div>
                  <div
                    style={{
                      background: "#f2efff",
                      color: "#6c4cff",
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    {users.length} users
                  </div>
                </Col>

                <Col>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search user"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                      allowClear
                      style={{
                        width: 500,
                        background: "#FFFFFF",
                        height: 50,
                        fontSize: 18,
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: 50 }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={pageData}
                  pagination={false}
                  rowKey="id"
                />
              )}
            </Card>

            <div
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <BiArrowBack /> Previous
              </Button>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={(page) => setCurrentPage(page)}
              />
              <Button
                onClick={() =>
                  setCurrentPage((p) =>
                    p < Math.ceil(filteredData.length / pageSize) ? p + 1 : p
                  )
                }
              >
                Next <GrLinkNext />
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
