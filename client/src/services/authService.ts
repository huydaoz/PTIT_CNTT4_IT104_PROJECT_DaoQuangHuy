import axios from "axios";

const API_URL = "http://localhost:8080/users";

// Đăng ký
export const registerUser = async (userData: any) => {
  try {
    const res = await axios.post(API_URL, userData);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại!");
  }
};

// Đăng nhập
export const loginUser = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const res = await axios.get(API_URL);
    const users = res.data;

    const user = users.find(
      (u: any) =>
        u.email.trim().toLowerCase() === normalizedEmail &&
        u.password === password
    );

    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Đăng nhập thất bại!");
  }
};
