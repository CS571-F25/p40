// src/components/AboutMe.jsx
import { Container, Row, Col, Card } from "react-bootstrap";
import { Globe, Heart, Search, Users, Info } from "lucide-react";

export default function AboutMe() {
  const features = [
    {
      icon: Globe,
      title: "Curated Destinations",
      description:
        "Explore handpicked locations showcasing remarkable landmarks, cultural highlights, and natural wonders from around the world.",
    },
    {
      icon: Heart,
      title: "Save Your Favorites",
      description:
        "Build your own list of dream destinations. Favorites are saved locally in your browser for quick access.",
    },
    {
      icon: Search,
      title: "Smart Search & Filters",
      description:
        "Find exactly what you want with search and filters for region, tags, and best seasons to visit.",
    },
    {
      icon: Users,
      title: "Built by Students",
      description:
        "Created by a small team of students who love travel, data, and clean user interfaces.",
    },
  ];

  const team = [
    { name: "Fuyang Xu", role: "Developer", github: "xufuyang0724" },
    { name: "Oliver Sun", role: "Developer", github: "ZezhengSun0106" },
    { name: "Baolu Yu", role: "Developer", github: "dorothy110" },
  ];

  return (
    <div className="py-5">
      <Container>
        {/* Hero 区域 */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2">Global Explorer</h1>

          <p className="lead text-muted mb-2">Discover and Save Destinations</p>

          <p
            className="text-muted"
            style={{ maxWidth: "720px", margin: "0 auto" }}
          >
            Global Explorer is a travel website designed to introduce destinations
            from around the world. We highlight famous landmarks, cultural
            experiences, and natural scenery through short descriptions, key
            facts, and engaging images.
          </p>
        </div>

        {/* Features 区域 */}
        <section className="mb-5">
          <h2 className="text-center fw-bold mb-4">Features</h2>
          <Row className="g-4 justify-content-center">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Col key={idx} xs={12} md={6} lg={5}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: 48,
                            height: 48,
                            backgroundColor: "rgba(13,110,253,0.08)",
                          }}
                        >
                          <Icon size={24} className="text-primary" />
                        </div>
                        <h3 className="h5 mb-0 fw-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-muted mb-0">
                        {feature.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>

        {/* Team 区域 */}
        <section className="mb-5">
          <h2 className="text-center fw-bold mb-4">Our Team</h2>
          <Row className="g-4 justify-content-center">
            {team.map((member, idx) => (
              <Col key={idx} xs={12} md={4}>
                <Card className="border-0 shadow-sm h-100 text-center p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #0d6efd, #fd7e14)",
                      fontSize: "2rem",
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <Card.Title className="mb-1">{member.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    {member.role}
                  </Card.Subtitle>
                  <Card.Text className="mb-0">
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-none"
                    >
                      @{member.github}
                    </a>
                  </Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Project Purpose 区域 */}
        <section>
          <Card className="border-0 shadow-sm bg-light">
            <Card.Body className="p-4 p-md-5">
              <h3 className="h4 fw-semibold mb-3">Project Purpose</h3>
              <p className="text-muted mb-3">
                This project was created as part of CS571: Building User
                Interfaces at the University of Wisconsin–Madison. Our goal was
                to build an interactive web application that feels more like a
                living guide than a static brochure.
              </p>
              <p className="text-muted mb-0">
                By combining search, filters, and a favorites system, Global
                Explorer encourages users not only to learn about the world but
                also to curate their own global journey through thoughtful
                interface design and a responsive, modern user experience.
              </p>
            </Card.Body>
          </Card>
        </section>
      </Container>
    </div>
  );
}
