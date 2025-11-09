import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Home() {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        // 如果为空，跳转到 /search?q=all
        const target = trimmed === "" ? "all" : encodeURIComponent(trimmed);
        navigate(`/search?q=${target}`);
    };

    return (
        <Container className="mt-5 text-center">
            {/* 简介部分 */}
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <h1 className="mb-4">Welcome to the Home Page of Global Explorer</h1>
                    <p style={{ fontSize: "1.1rem" }}>
                        Global Explorer helps you discover travel destinations around the world through what makes
                        each place unique. Instead of planning detailed trips, our site focuses on inspiration — showing
                        cities and regions through their special highlights, local food, nature, and culture. 
                        Each destination card gives you a short introduction, key features, and the best seasons to visit.
                        You can search by anything that interests you — a country, a keyword, or a theme — and save your
                        favorite places to explore later.
                    </p>
                </Col>
            </Row>

            {/* 搜索部分 */}
            <Row className="justify-content-center mt-5">
                <Col md={6} lg={5}>
                    <Form onSubmit={handleSearch}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Type anything — country, city, food..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="px-5"
                        >
                            Search
                        </Button>
                    </Form>
                    <p className="mt-3 text-muted">
                        🔍 Try typing “Japan”, “food”, or “nature” — or just click Search to explore all destinations.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
