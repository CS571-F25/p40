import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Heart, Globe } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
{/* Hero Section */}
<div
  className="py-5"
  style={{
    backgroundImage: 'url("https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg")', 
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* 加一层半透明黑色遮罩，保证字清晰可见 */}
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      width: "100%",
      height: "100%",
    }}
  >
    <Container className="py-5">
      <Row className="align-items-center">
        <Col lg={8} className="mx-auto text-center fade-in">
          <h1 className="display-3 fw-bold mb-4 text-white">
            Discover Your Next Adventure
          </h1>
          <p className="lead mb-4 fs-4 text-white-50">
            Find curated trips, hidden gems, and AI-powered travel plans
            tailored just for you.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button
              size="lg"
              variant="light"
              onClick={() => navigate("/search")}
              className="px-4 py-3"
            >
              <Search size={20} className="me-2" />
              Start Exploring
            </Button>
            <Button
              size="lg"
              variant="outline-light"
              onClick={() => navigate("/ai-search")}
              className="px-4 py-3"
            >
              <Sparkles size={20} className="me-2" />
              Try AI Search
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
</div>


      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">Why Global Explorer?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <Globe size={48} className="text-primary" />
                </div>
                <Card.Title className="fw-bold">Curated Destinations</Card.Title>
                <Card.Text className="text-muted">
                  Hand-picked cities and regions from around the world, each with unique highlights and cultural experiences.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <Sparkles size={48} className="text-primary" />
                </div>
                <Card.Title className="fw-bold">AI-Powered Search</Card.Title>
                <Card.Text className="text-muted">
                  Describe your dream trip in your own words and let AI help you find the perfect destinations.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <Heart size={48} className="text-danger" />
                </div>
                <Card.Title className="fw-bold">Save Favorites</Card.Title>
                <Card.Text className="text-muted">
                  Build your personal collection of dream destinations and access them anytime.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5">
          <p className="lead text-muted mb-4">
            Ready to explore the world?
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate("/search")}
            className="px-5 py-3"
          >
            Browse Destinations
          </Button>
        </div>
      </Container>
    </>
  );
}
