import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import AppHeader from "../layouts/Header/Header";
import AppFooter from "../layouts/Footer/Footer";
import Register from "../pages/auth/Register";
import Home from "../pages/user/Home";
import PostDetail from "../pages/user/PostDetail";
import UserManager from "../pages/admin/UserManager";
import ManageCategories from "../pages/admin/CategoryManager";
import ManageArticlesPage from "../pages/admin/ArticleManager";
import MyPosts from "../pages/user/MyPosts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="/header" element={<AppHeader />} />
      <Route path="/footer" element={<AppFooter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post-detail/:id" element={<PostDetail />} />
      <Route path="/user-manager" element={<UserManager />} />
      <Route path="/category-manager" element={<ManageCategories />} />
      <Route path="/articles-manager" element={<ManageArticlesPage />} />
    </Routes>
  );
}
