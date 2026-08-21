const request = require("supertest");

jest.mock("../src/db", () => ({
  query: jest.fn(),
  end: jest.fn()
}));

const pool = require("../src/db");
const app = require("../src/app");

describe("Family App API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /health should return healthy", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /api/members should return family members", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: "Test Member",
          phone: "9999999999",
          email: "test@example.com",
          location: "Bhopal",
          gender: "Male",
          date_of_birth: "1995-01-01",
          photo_url: null
        }
      ]
    });

    const response = await request(app).get("/api/members");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("members");
    expect(Array.isArray(response.body.members)).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.members[0].name).toBe("Test Member");
  });
});

afterAll(async () => {
  await pool.end();
});