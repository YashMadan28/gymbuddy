const request = require("supertest");
const path = require("path");
const { app, onlineUsers } = require("../app");

// Mock Firebase bucket
jest.mock("../firebase/firebaseAdmin", () => ({
    verifyToken: (req, res, next) => {
      req.user = { uid: "test-user-id" };
      next();
    },
    bucket: {
      name: "mock-bucket",
      file: () => {
        const file = {
          save: jest.fn().mockResolvedValue(),
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: "mock-token"
            }
          }
        };
        return file;
      }
    }
  }));
  
// Mock Messages model
jest.mock("../models/Messages", () => ({
    create: jest.fn().mockResolvedValue({
        sender: "sender123",
        receiver: "receiver123",
        imageUrl: "https://mock-url.com/image.jpg",
        read: false
    }),
    find: jest.fn()
}));

const Messages = require("../models/Messages");

// Upload image in a message and notify both users via socket
describe("POST /api/messages/:senderId/:receiverId/upload", () => {
    beforeEach(() => {
        onlineUsers.clear();
        onlineUsers.set("receiver123", "fakeSocketId");
      });  
  test("returns 400 if no file is uploaded", async () => {
    const res = await request(app)
      .post("/api/messages/sender123/receiver123/upload");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no file/i);
  });

  test("uploads image and creates message", async () => {
    const filePath = path.join(__dirname, "test-image.jpg");
    const mockMessage = {
      sender: "sender123",
      receiver: "receiver123",
      imageUrl: "https://mock-url.com/image.jpg",
      read: false
    };
    Messages.create.mockResolvedValue(mockMessage);
    const res = await request(app)
      .post("/api/messages/sender123/receiver123/upload")
      .attach("file", filePath);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.imageUrl).toMatch(/^https:\/\/firebasestorage/);
  });
});

// Get all messages between two users
describe("GET /api/messages/:userId/:otherUserId", () => {
  test("returns messages between two users", async () => {
    const mockMessages = [
        {
          sender: "user1",
          receiver: "user2",
          text: "Hello!",
          createdAt: "2023-01-01T00:00:00.000Z"
        },
        {
          sender: "user2",
          receiver: "user1",
          text: "Hi!",
          createdAt: "2023-01-02T00:00:00.000Z"
        }
      ];      
    Messages.find.mockReturnValue({
      sort: jest.fn().mockReturnValue(mockMessages)
    });
    const res = await request(app)
      .get("/api/messages/user1/user2");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockMessages);
  });
  
  test("returns 500 on DB error", async () => {
    Messages.find.mockImplementation(() => {
      throw new Error("DB failed");
    });
    const res = await request(app)
      .get("/api/messages/user1/user2");
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("DB failed");
  });
});