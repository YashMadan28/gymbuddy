const request = require("supertest");
const { app, onlineUsers } = require("../app");

// Mock Firebase admin auth and stroage
jest.mock("../firebase/firebaseAdmin", () => ({
  verifyToken: (req, res, next) => {
    req.user = { uid: "test-user-id" };
    next();
  },
  bucket: {
    file: () => ({
      save: jest.fn().mockResolvedValue(),
      metadata: { metadata: { firebaseStorageDownloadTokens: "mock-token" } }
    })
  }
}));

// Mock for User model
jest.mock("../models/User", () => {
  const userData = {
    firebaseUid: "test-uid",
    name: "test_user",
    email: "test@example.com"
  };
  const save = jest.fn().mockResolvedValue(userData);
  const mockConstructor = jest.fn(() => ({
    ...userData,
    save
  }));
  mockConstructor.findOneAndUpdate = jest.fn();
  mockConstructor.find = jest.fn();
  mockConstructor.aggregate = jest.fn();
  mockConstructor.findOne = jest.fn();
  mockConstructor.findById = jest.fn();
  return mockConstructor;
});

const User = require("../models/User");

// Get users by gym
describe("GET /api/users/by-gym", () => {
  test("returns 400 if gym_display is missing", async () => {
    const res = await request(app)
      .get("/api/users/by-gym")
      .set("Authorization", "Bearer mock");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/gym_display/i);
  });

  test("returns users when gym_display is provided", async () => {
    const mockUsers = [
      { name: "John", firebaseUid: "abc", gym: { display: "Wrec" } }
    ];
    User.aggregate.mockResolvedValue(mockUsers);
    const res = await request(app)
      .get("/api/users/by-gym")
      .query({ gym_display: "Wrec" })
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockUsers);
  });
});

// Get users by name
describe("GET /api/users/search", () => {
  test("returns 400 if name query is not provided", async () => {
    const res = await request(app)
      .get("/api/users/search")
      .set("Authorization", "Bearer mock");

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ users: [] });
  });

  test("returns 200 and users if name query is provided", async () => {
    const mockUsers = [
      { _id: "1", name: "John Smith" },
      { _id: "2", name: "James Smith" }
    ];

    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue(mockUsers)
    });

    const res = await request(app)
      .get("/api/users/search")
      .query({ name: "Smith" })
      .set("Authorization", "Bearer mock");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ users: mockUsers });
  });
});

// User account creation
describe("POST /api/users", () => {
  test("returns 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/users")
      // Missing firebaseUid, name, and email
      .send({})
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(400);
  });

  test("creates user and returns 201", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        firebaseUid: "test-uid",
        name: "test_user",
        email: "test@example.com"
      })
      .set("Authorization", "Bearer mock");
  
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("test_user");
  });
})

// User account update
describe("PUT /api/users/:firebaseUid", () => {
  test("returns 404 if user not found", async () => {
    User.findOneAndUpdate.mockResolvedValue(null);
    const res = await request(app)
      .put("/api/users/test-uid")
      .send({ name: "Updated User" })
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test("updates user and returns 200", async () => {
    const mockUser = { firebaseUid: "test-uid", name: "Updated User" };
    User.findOneAndUpdate.mockResolvedValue(mockUser);
    const res = await request(app)
      .put("/api/users/test-uid")
      .send({ name: "Updated User" })
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated User");
  });
});

const path = require("path");
const fs = require("fs");
// Upload user profile image
describe("POST /api/users/:firebaseUid/upload", () => {
  test("returns 400 if no file is uploaded", async () => {
    const res = await request(app)
      .post("/api/users/test-uid/upload")
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no file/i);
  });

  test("uploads image and updates user", async () => {
    const mockUser = { firebaseUid: "test-uid", profilePicture: "mock-url" };
    User.findOneAndUpdate.mockResolvedValue(mockUser);
    const filePath = path.join(__dirname, "test-image.jpg");
    const res = await request(app)
      .post("/api/users/test-uid/upload")
      .set("Authorization", "Bearer mock")
      .attach("profileImage", filePath);
    expect(res.statusCode).toBe(200);
    expect(res.body.imageUrl).toMatch(/^https:\/\/firebasestorage/);
  });
});

// Get full user object by firebaseUid
describe("GET /api/users/:firebaseUid", () => {
  test("returns 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app)
      .get("/api/users/test-uid")
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(404);
  });

  test("returns user if found", async () => {
    const mockUser = { firebaseUid: "test-uid", name: "test_user" };
    User.findOne.mockResolvedValue(mockUser);
    const res = await request(app)
      .get("/api/users/test-uid")
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("test_user");
  });
});

// Get public user profile
describe("GET /api/users/:userId/public", () => {
  test("returns 404 if user not found", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue(null)
      })
    });
    const res = await request(app)
      .get("/api/users/123/public")
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(404);
  });
  
  test("returns public profile", async () => {
    const mockPublicUser = {
      name: "public_user",
      age: 23,
      gender: "male",
      gym: { display: "Wrec" },
      about: "Hello!!!",
      profilePicture: "https://..."
    };
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue(mockPublicUser)
      })
    });
    const res = await request(app)
      .get("/api/users/123/public")
      .set("Authorization", "Bearer mock");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("public_user");
  });
});
