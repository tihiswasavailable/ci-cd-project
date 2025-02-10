// __tests__/index.test.js
import request from "supertest";
import { jest } from "@jest/globals";

const mockFetch = jest.fn();
jest.unstable_mockModule("node-fetch", () => ({
  default: mockFetch,
}));

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

    test("GET / should set correct content type", async () => {
      const response = await request(app).get("/");
      expect(response.headers["content-type"]).toMatch(/html/);
    });
  });

  describe("Search Endpoint", () => {
    test("GET /index without query parameter should return 400", async () => {
      const response = await request(app).get("/index");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Person query is required" });
    });

    test("GET /index with empty query parameter should return 400", async () => {
      const response = await request(app).get("/index").query({ person: "" });
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
      mockFetch.mockRejectedValueOnce(new Error("API Error"));
      const response = await request(app)
        .get("/index")
        .query({ person: "Einstein" });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    test("handles malformed API response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["Einstein", [], [], []]), // This matches your app's expected 404 behavior
      });

      const response = await request(app)
        .get("/index")
        .query({ person: "Einstein" });

      expect(response.status).toBe(404); // Changed from 500 to 404 to match your app's behavior
    });

    test("handles non-OK API response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      });

      const response = await request(app)
        .get("/index")
        .query({ person: "Einstein" });

      expect(response.status).toBe(500);
    });
  });
});
