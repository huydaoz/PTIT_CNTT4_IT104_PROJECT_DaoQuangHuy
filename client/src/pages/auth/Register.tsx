import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import registerBg from "../../assets/image/register-bgr.png";
import { registerUser } from "../../services/authService";
import Swal from "sweetalert2";

const { Title, Text, Link } = Typography;

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { firstname, lastname, email, password } = values;
    const status = "Hoạt động";
    const role = "user";
    const newUser = { firstname, lastname, email, password, status, role };

    try {
      await registerUser(newUser);
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div
      className="register-container"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 100px",
        gap: "90px",
      }}
    >
      <div className="register-left" style={{ textAlign: "center" }}>
        <Title style={{ color: "#E8EFFD", fontWeight: "bold", fontSize: 48 }}>
          Welcome to the website
        </Title>
        <Text style={{ color: "#BAD0F8" }}>RIKKEI EDUCATION</Text>
      </div>

      <div className="register-right">
        <Card
          style={{
            width: 450,
            borderRadius: 6,
            padding: 20,
            backgroundColor: "#e9ebef",
          }}
        >
          <Form
            layout="vertical"
            name="register"
            onFinish={onFinish}
            autoComplete="off"
          >
            <div style={{ display: "flex", gap: "60px" }}>
              <Form.Item
                name="firstname"
                rules={[{ required: true, message: "Họ không được trống" }]}
                style={{ flex: 1 }}
                extra={
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                    }}
                  >
                    First name
                  </span>
                }
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastname"
                rules={[{ required: true, message: "Tên không được trống" }]}
                style={{ flex: 1 }}
                extra={
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                    }}
                  >
                    Last name
                  </span>
                }
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email không được để trống" },
                { type: "email", message: "Email phải đúng định dạng" },
              ]}
              extra={
                <span
                  style={{
                    color: "#000",
                    fontSize: "14px",
                  }}
                >
                  Email address
                </span>
              }
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Mật khẩu không được để trống" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              ]}
              extra={
                <span
                  style={{
                    color: "#000",
                    fontSize: "14px",
                  }}
                >
                  Password
                </span>
              }
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Mật khẩu xác nhận không được để trống",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu phải trùng khớp")
                    );
                  },
                }),
              ]}
              extra={
                <span
                  style={{
                    color: "#000",
                    fontSize: "14px",
                  }}
                >
                  Confirm Password
                </span>
              }
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ fontWeight: 400 }}
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <div style={{ fontWeight: 700 }}>
            <Text>Already have an account? </Text>
            <Link
              href="/login"
              style={{ color: "red", textDecoration: "underline" }}
            >
              login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
