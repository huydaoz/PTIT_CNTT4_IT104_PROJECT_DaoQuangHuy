import { useEffect, useState } from "react";
import { Layout, Button, Input, Card, Table, Space, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

import "antd/dist/reset.css";
import HeaderAdmin from "../../components/layout/HeaderAdmin";
import SidebarAdmin from "../../components/layout/SidebarAdmin";

const { Content } = Layout;

interface Entry {
  id: number;
  name: string;
}

export default function CategoryManager() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryName, setEntryName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const API_URL = "http://localhost:8080/entries";

  // LOAD DATA
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(API_URL);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // ADD
  const handleAdd = async () => {
    if (!entryName.trim()) return;

    try {
      const res = await axios.post(API_URL, { name: entryName });
      setEntries([...entries, res.data]);
      setEntryName("");

      Swal.fire({
        icon: "success",
        title: "Đã thêm!",
        text: "Danh mục mới đã được thêm thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setEntries(entries.filter((e) => e.id !== id));

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Danh mục đã được xóa thành công.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting entry:", err);
      }
    }
  };

  // EDIT
  const handleEdit = async (entry: Entry) => {
    const { value: newName } = await Swal.fire({
      title: "Chỉnh sửa danh mục",
      input: "text",
      inputLabel: "Tên danh mục mới:",
      inputValue: entry.name,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Tên danh mục không được để trống!";
        }
        return null;
      },
    });

    if (newName && newName.trim()) {
      try {
        const res = await axios.put(`${API_URL}/${entry.id}`, {
          ...entry,
          name: newName.trim(),
        });
        setEntries(entries.map((e) => (e.id === entry.id ? res.data : e)));

        Swal.fire({
          icon: "success",
          title: "Đã cập nhật!",
          text: "Tên danh mục đã được thay đổi.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error updating entry:", err);
      }
    }
  };

  // FILTER
  const filtered = entries.filter((e) =>
    e.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, i: number) => i + 1,
      width: 60,
    },
    { title: "Category Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: Entry) => (
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
      {/* HEADER */}
      <HeaderAdmin />

      <Layout>
        {/* SIDEBAR */}
        <SidebarAdmin />

        <Content style={{ padding: 24 }}>
          {/* SEARCH */}
          <div style={{ marginBottom: 24, marginLeft: 475 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Article Categories"
              style={{
                width: 500,
                background: "#FFFFFF",
                height: 50,
                fontSize: 18,
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div style={{ maxWidth: 1000 }}>
            <Card style={{ borderRadius: 12, background: "#fff" }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Manage Categories
              </h2>

              {/* FORM ADD CATEGORY */}
              <div>
                <label>Category Name:</label>
                <Input
                  placeholder="Enter category name"
                  value={entryName}
                  onChange={(e) => setEntryName(e.target.value)}
                  style={{ marginBottom: 6 }}
                />
                <Button
                  type="primary"
                  block
                  style={{
                    background: "#28a745",
                    borderColor: "#28a745",
                    height: 38,
                    fontWeight: 500,
                  }}
                  onClick={handleAdd}
                >
                  Add Category
                </Button>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                Category List
              </h3>
              <Table
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                rowKey="id"
                bordered
              />
            </Card>
            <div
              style={{
                padding: 11,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filtered.length}
                onChange={(page) => setCurrentPage(page)}
              />
              <Button
                onClick={() =>
                  setCurrentPage((p) =>
                    p < Math.ceil(filtered.length / pageSize) ? p + 1 : p
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
