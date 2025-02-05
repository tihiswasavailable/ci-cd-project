import request from "supertest";
import { jest } from "@jest/globals";

// Create mock before importing the app
const mockFetch = jest.fn();
jest.unstable_mockModule("node-fetch", () => ({
  default: mockFetch,
}));

// Import app after setting up mocks
const { default: app } = await import("../index.js");

describe("Wikipedia Search App Tests", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("Home Page", () => {
    test("GET / should return the home page", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
    });
  });

  describe("Search Endpoint", () => {
    test("GET /index without query parameter should return 400", async () => {
      const response = await request(app).get("/index");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Person query is required" });
    });

    test("GET /index should return results for valid search", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            "Einstein",
            ["Albert Einstein"],
            ["German physicist"],
            ["https://en.wikipedia.org/wiki/Albert_Einstein"],
          ]),
      });

      const response = await request(app)
        .get("/index")
        .query({ person: "Einstein" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        url: "https://en.wikipedia.org/wiki/Albert_Einstein",
        title: "Albert Einstein",
        description: "German physicist",
      });
    });

    test("GET /index should handle no results", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["NonExistentPerson", [], [], []]),
      });

      const response = await request(app)
        .get("/index")
        .query({ person: "NonExistentPerson" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Person not found" });
    });

    test("handles API errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error());
      const response = await request(app)
        .get("/index")
        .query({ person: "Einstein" });
      expect(response.status).toBe(500);
    });
  });
});
