const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/students requires JWT", async () => {
  const response = await request(app).get("/api/students");

  assert.equal(response.status, 401);
});
