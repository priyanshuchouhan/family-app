const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db");

describe("Family App API", () => {
  test("GET /health should return healthy", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /api/members should return family members", async () => {
    const response = await request(app).get("/api/members");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("members");
    expect(Array.isArray(response.body.members)).toBe(true);
  });
});


afterAll(async () => {
  await pool.end();
});