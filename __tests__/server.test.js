// __tests__/server.test.js
import { jest } from "@jest/globals";

describe("Server", () => {
  let mockApp;
  let mockConsole;

  beforeEach(() => {
    mockConsole = jest.spyOn(console, "log").mockImplementation(() => {});

    mockApp = {
      listen: jest.fn((port, cb) => {
        cb();
        return { close: jest.fn() };
      }),
    };

    jest.unstable_mockModule("../index.js", () => ({
      default: mockApp,
    }));
  });

  afterEach(() => {
    mockConsole.mockRestore();
    jest.resetModules();
  });

  test("should start server with default port", async () => {
    const originalPort = process.env.PORT;
    delete process.env.PORT;

    await import("../server.js");

    expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(mockConsole).toHaveBeenCalledWith("Server is running on port 3000");

    process.env.PORT = originalPort;
  });

  test("should start server with custom port from env", async () => {
    const originalPort = process.env.PORT;
    process.env.PORT = "4000";

    await import("../server.js");

    // Changed to expect string "4000" instead of number 4000
    expect(mockApp.listen).toHaveBeenCalledWith("4000", expect.any(Function));
    expect(mockConsole).toHaveBeenCalledWith("Server is running on port 4000");

    process.env.PORT = originalPort;
  });
});
