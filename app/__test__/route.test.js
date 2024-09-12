const request = require("supertest");
const express = require("express");
const app = express();

require("../routes/exampleRoutes")(app);

jest.mock("../middleware/exampleMiddleware", () => ({
  exampleMiddlewareFunction: (req, res, next) => next(),
}));

jest.mock("../controllers/exampleController", () => ({
  refactoreMe1: (req, res) => res.status(200).send({ success: true }),
  refactoreMe2: (req, res) => res.status(201).send({ success: true }),
  callmeWebSocket: (req, res) => res.status(200).send({ success: true }),
  getData: async (req, res) => {
    const data = { label: ["USA", "UK"], total: [100, 200] };
    res.status(200).send({ success: true, statusCode: 200, data });
  },
  login: (req, res) =>
    res
      .status(200)
      .send({ success: true, data: { accessToken: "dummy-token" } }),
}));

describe("Example Routes", () => {
  describe("GET /api/data/refactor-1", () => {
    it("should return success", async () => {
      const response = await request(app).get("/api/data/refactor-1");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/data/refactor-2", () => {
    it("should return success", async () => {
      const response = await request(app)
        .post("/api/data/refactor-2")
        .send({ userId: 1, values: [1, 2, 3] });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/data/socket", () => {
    it("should return success", async () => {
      const response = await request(app).get("/api/data/socket");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /api/data/get-data", () => {
    it("should return data with label and total", async () => {
      const response = await request(app).get("/api/data/get-data");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("label");
      expect(response.body.data).toHaveProperty("total");
    });
  });

  describe("POST /api/data/login", () => {
    it("should return success with accessToken", async () => {
      const response = await request(app)
        .post("/api/data/login")
        .send({ id: 1 });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
    });
  });
});
