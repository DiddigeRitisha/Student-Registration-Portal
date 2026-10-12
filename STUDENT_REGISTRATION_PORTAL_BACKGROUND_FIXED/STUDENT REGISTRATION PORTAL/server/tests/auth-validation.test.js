const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("POST /api/auth/register rejects invalid data", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ name: "A", email: "wrong-email", password: "123" });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Validation failed");
});

test("POST /api/auth/login rejects invalid data", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "wrong-email", password: "" });

  assert.equal(response.status, 400);
});
