const request = require("supertest");
const { app, onlineUsers } = require("../app");


// Mock Firebase admin auth and storage
jest.mock("../firebase/firebaseAdmin", () => ({
  verifyToken: (req, res, next) => {
    req.user = { uid: "test-user-id" };
    next();
  }
}));

// Mock Workout model
jest.mock("../models/Workout", () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

const Workout = require("../models/Workout");

// Get workouts for authenticated user
describe("GET /api/workouts/:userId", () => {
  test("returns 403 if user is unauthorized", async () => {
    const res = await request(app).get("/api/workouts/wrong-user-id");
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  test("returns workouts if found", async () => {
    const mockWorkout = { userId: "test-user-id", exercises: ["push-ups"] };
    Workout.findOne.mockResolvedValue(mockWorkout);

    const res = await request(app).get("/api/workouts/test-user-id");
    expect(res.statusCode).toBe(200);
    expect(res.body.exercises).toContain("push-ups");
  });

  test("returns empty workout object if not found", async () => {
    Workout.findOne.mockResolvedValue(null);
    const res = await request(app).get("/api/workouts/test-user-id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ exercises: [] });
  });

  test("returns 500 on error", async () => {
    Workout.findOne.mockImplementation(() => {
      throw new Error("DB error");
    });
    const res = await request(app).get("/api/workouts/test-user-id");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/db error/i);
  });
});

// Create or update workouts
describe("PUT /api/workouts/:userId", () => {
  test("returns 403 if user is unauthorized", async () => {
    const res = await request(app)
      .put("/api/workouts/wrong-user-id")
      .send({ exercises: ["sit-ups"] });
    expect(res.statusCode).toBe(403);
  });

  test("updates and returns workout", async () => {
    const updatedWorkout = {
      userId: "test-user-id",
      exercises: ["sit-ups"]
    };
    Workout.findOneAndUpdate.mockResolvedValue(updatedWorkout);
    const res = await request(app)
      .put("/api/workouts/test-user-id")
      .send({ exercises: ["sit-ups"] });
    expect(res.statusCode).toBe(200);
    expect(res.body.exercises).toContain("sit-ups");
  });
  
  test("returns 500 on error", async () => {
    Workout.findOneAndUpdate.mockImplementation(() => {
      throw new Error("Update error");
    });

    const res = await request(app)
      .put("/api/workouts/test-user-id")
      .send({ exercises: ["sit-ups"] });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/update error/i);
  });
});