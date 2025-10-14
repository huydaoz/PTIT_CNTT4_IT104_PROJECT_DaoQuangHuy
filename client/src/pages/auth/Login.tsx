import { Form, Input, Button, Typography, message } from "antd";
import "./Login.css";
import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/authService";
import Swal from "sweetalert2";
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const { Text, Link } = Typography;

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { email, password } = values;

    try {
      // 🔹 1. Lấy danh sách admin từ db.json
      const resAdmin = await fetch("http://localhost:8080/admin");
      const adminList = await resAdmin.json();

      // 🔹 2. Kiểm tra đăng nhập admin
      const adminUser = adminList.find(
        (a: any) => a.email === email && a.password === password
      );

      if (adminUser) {
        Swal.fire({
          icon: "success",
          title: "Đăng nhập admin thành công!",
          showConfirmButton: false,
          timer: 1500,
        });

        localStorage.setItem("admin", JSON.stringify(adminUser));
        navigate("/user-manager");
        return;
      }

      // 🔹 3. Nếu không phải admin → kiểm tra user
      const resUser = await fetch("http://localhost:8080/users");
      const userList = await resUser.json();

      const foundUser = userList.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại!",
          text: "Email hoặc mật khẩu không đúng",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // 🔹 4. Kiểm tra trạng thái tài khoản
      if (foundUser.status === "Đã chặn") {
        Swal.fire({
          icon: "error",
          title: "Tài khoản đã bị chặn!",
          text: "Vui lòng liên hệ quản trị viên để được hỗ trợ.",
          showConfirmButton: true,
        });
        return;
      }

      // 🔹 5. Nếu tài khoản hoạt động → cho đăng nhập
      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      localStorage.setItem("user", JSON.stringify(foundUser));
      navigate("/");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại!",
        text: "Có lỗi xảy ra khi kết nối máy chủ.",
        showConfirmButton: false,
        timer: 1300,
      });
      message.error("Không thể kết nối tới server", error);
    }
  };

  return (
    <>
      <div className="login-container">
        {/* Left image */}
        <div className="login-left">
          <Link href="/">
            <img
              src="/src/assets/image/imageLogin.png"
              alt="login-banner"
              className="login-image"
            />
          </Link>
        </div>

        {/* Right form */}
        <div className="login-right">
          <div style={{ maxWidth: 400, width: "100%" }}>
            <div style={{ display: "flex", gap: 20 }}>
              <Text style={{ fontSize: 16 }}>Sign in with</Text>
              <div style={{ display: "flex", gap: 5 }}>
                <Button style={{ color: "white", background: "#1677ff" }}>
                  <FaFacebookF />
                </Button>
                <Button style={{ color: "white", background: "#1677ff" }}>
                  <FaTwitter />
                </Button>
                <Button style={{ color: "white", background: "#1677ff" }}>
                  <FaLinkedinIn />
                </Button>
              </div>
            </div>

            <div style={{ margin: "20px 0", fontWeight: 600 }}>Or</div>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống" },
                  { type: "email", message: "Email phải đúng định dạng" },
                ]}
                extra={
                  <span style={{ color: "#000", fontSize: "14px" }}>
                    Email Address
                  </span>
                }
              >
                <Input placeholder="Enter a valid email address" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống" },
                ]}
                extra={
                  <span style={{ color: "#000", fontSize: "14px" }}>
                    Password
                  </span>
                }
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>

            <div style={{ fontWeight: 600 }}>
              <Text>Don't have an account? </Text>
              <Link
                href="/register"
                style={{ color: "#DC3545", textDecoration: "underline" }}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <div>Copyright © 2025. All rights reserved.</div>
        <div>
          <Button
            style={{ color: "white", background: "#1677ff", border: "none" }}
          >
            <FaFacebookF />
          </Button>
          <Button
            style={{ color: "white", background: "#1677ff", border: "none" }}
          >
            <FaTwitter />
          </Button>
          <Button
            style={{ color: "white", background: "#1677ff", border: "none" }}
          >
            <FaLinkedinIn />
          </Button>
          <Button
            style={{ color: "white", background: "#1677ff", border: "none" }}
          >
            <FaGoogle />
          </Button>
        </div>
      </footer>
    </>
  );
}
