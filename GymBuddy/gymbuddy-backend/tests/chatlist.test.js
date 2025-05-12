const request = require("supertest");
const { app, onlineUsers} = require("../app");

// Mock the ChatList model
jest.mock("../models/ChatList", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

const ChatList = require("../models/ChatList");

// Get chat partners and last message for a user
describe("GET /api/chatlist/:userId", () => {
    test("returns [] if no chatlist found", async () => {
        const mockFinalPopulate = jest.fn().mockResolvedValue(null);
        const mockFirstPopulate = jest.fn(() => ({ populate: mockFinalPopulate }));
        ChatList.findOne.mockReturnValue({ populate: mockFirstPopulate });
        const res = await request(app).get("/api/chatlist/user1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
      });

    test("returns chatlist if found", async () => {
      const mockChatList = {
        chatPartners: [
          {
            partnerId: {
              _id: "abc",
              name: "test_user",
              profilePicture: "url",
              lastActive: new Date()
            },
            lastMessage: { text: "Hello!!!" }
          }
        ]
      };
      const mockPopulate = jest.fn().mockResolvedValue(mockChatList);
      const mockFirstPopulate = jest.fn(() => ({ populate: mockPopulate }));
      ChatList.findOne.mockReturnValue({ populate: mockFirstPopulate });
      const res = await request(app).get("/api/chatlist/user1");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe("test_user");
    });

    test("returns 500 on error", async () => {
      ChatList.findOne.mockImplementation(() => {
        throw new Error("DB error");
      });
      const res = await request(app).get("/api/chatlist/user1");
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch(/error/i);
    });
  });
  
// Add a chat partner to a user's chat list
describe("POST /api/chatlist/add", () => {
  test("returns 400 if userId or partnerId is missing", async () => {
    const res = await request(app).post("/api/chatlist/add").send({});
    expect(res.statusCode).toBe(400);
  });

  test("creates new chatlist if none exists", async () => {
    ChatList.findOne.mockResolvedValue(null);
    ChatList.create.mockResolvedValue({ userId: "user1", chatPartners: [{ partnerId: "user2" }] });
    const res = await request(app)
      .post("/api/chatlist/add")
      .send({ userId: "user1", partnerId: "user2" });
    expect(res.statusCode).toBe(200);
    expect(res.body.chatPartners).toBeDefined();
  });

  test("adds partner to existing chatlist", async () => {
    const chatList = {
      userId: "user1",
      chatPartners: [],
      save: jest.fn().mockResolvedValue()
    };
    ChatList.findOne.mockResolvedValue(chatList);
    const res = await request(app)
      .post("/api/chatlist/add")
      .send({ userId: "user1", partnerId: "user2" });
    expect(res.statusCode).toBe(200);
  });

  test("returns 500 on error", async () => {
    ChatList.findOne.mockImplementation(() => {
      throw new Error("DB error");
    });
    const res = await request(app)
      .post("/api/chatlist/add")
      .send({ userId: "user1", partnerId: "user2" });
    expect(res.statusCode).toBe(500);
  });
});

// Remove a chat partner from a user's chat list
describe("DELETE /api/chatlist/:userId/:partnerId", () => {
  test("removes partner from chatlist", async () => {
    ChatList.findOneAndUpdate.mockResolvedValue({ userId: "user1", chatPartners: [] });
    const res = await request(app).delete("/api/chatlist/user1/user2");
    expect(res.statusCode).toBe(200);
  });
  
  test("returns 500 on error", async () => {
    ChatList.findOneAndUpdate.mockImplementation(() => {
      throw new Error("DB error");
    });
    const res = await request(app).delete("/api/chatlist/user1/user2");
    expect(res.statusCode).toBe(500);
  });
});