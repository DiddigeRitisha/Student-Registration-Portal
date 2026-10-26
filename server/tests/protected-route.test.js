const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/students requires JWT", async () => {
  const response = await request(app).get("/api/students");

  assert.equal(response.status, 401);
});

test("POST /api/students rejects unauthenticated create requests", async () => {
  const response = await request(app)
    .post("/api/students")
    .send({ name: "Test Student", email: "student@example.com" });

  assert.equal(response.status, 401);
});

test("DELETE /api/students/:id rejects unauthenticated delete requests", async () => {
  const response = await request(app).delete("/api/students/507f1f77bcf86cd799439011");

  assert.equal(response.status, 401);
});
