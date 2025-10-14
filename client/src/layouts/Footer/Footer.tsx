import { Layout, Row, Col, Typography, Divider, Space } from "antd";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const { Footer } = Layout;
const { Title, Text } = Typography;

export default function AppFooter() {
  return (
    <Footer style={{ background: "#fff", borderTop: "1px solid #eee" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Row gutter={[32, 32]}>
          {/* Brand */}
          <Col xs={24} sm={24} md={4}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>MY BLOG</div>
          </Col>

          {/* About */}
          <Col xs={24} sm={24} md={8}>
            <Title level={4} style={{ marginBottom: 12 }}>
              About
            </Title>
            <Text strong>Rareblocks</Text>
            <p style={{ color: "#555", marginTop: 4 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dictum aliquet accumsan porta lectus ridiculus in mattis. Netus
              sodales in volutpat ullamcorper amet adipiscing fermentum.
            </p>
          </Col>

          {/* Company */}
          <Col xs={24} sm={12} md={4}>
            <Title level={4}>Company</Title>
            <Space direction="vertical">
              <p>About</p>
              <p>Features</p>
              <p>Works</p>
              <p>Career</p>
            </Space>
          </Col>

          {/* Help */}
          <Col xs={24} sm={12} md={4}>
            <Title level={4}>Help</Title>
            <Space direction="vertical">
              <p>Customer Support</p>
              <p>Delivery Details</p>
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
            </Space>
          </Col>

          {/* Resources */}
          <Col xs={24} sm={12} md={4}>
            <Title level={4}>Resources</Title>
            <Space direction="vertical">
              <p>Free eBooks</p>
              <p>Development Tutorial</p>
              <p>How to - Blog</p>
              <p>Youtube Playlist</p>
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* Bottom Socials */}
        <div style={{ textAlign: "center", color: "black" }}>
          <Space size="large">
            <FaTwitter />
            <FaFacebookF />
            <FaInstagram />
            <FaGithub />
          </Space>
        </div>
      </div>
    </Footer>
  );
}
