const request = require("supertest");
const app = require("../app");

jest.mock('../third_party/db', () => {
  const mockUsers = {
    'existinguser@example.com': {
      id: 'userId1',
      email: 'existinguser@example.com',
      password: '$2a$12$exampleHashedPassword',
      name: 'Existing User'
    }
  };

  const mockDoc = jest.fn((id) => ({
    get: jest.fn().mockResolvedValue({
      exists: !!mockUsers[id],
      data: () => mockUsers[id],
      id,
    }),
    set: jest.fn().mockImplementation((data) => {
      mockUsers[data.email] = { ...data, id: 'newUserId' };
    }),
    update: jest.fn().mockImplementation((data) => {
      if (mockUsers[id]) {
        mockUsers[id] = { ...mockUsers[id], ...data };
      }
    })
  }));

  const mockCollection = jest.fn((name) => ({
    doc: mockDoc,
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockImplementation(() => {
      return Promise.resolve({ empty: true });
    }),
  }));

  return {
    getInstance: jest.fn().mockReturnValue({
      getDatabase: jest.fn(() => ({
        collection: mockCollection,
      })),
    }),
  };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedJwtToken'),
}));

jest.mock("../middlewares/auth", () => ({
    verifyAuthentication: (req, res, next) => {
        if (req.headers.authentication) {
        req.user = { id: "mockUserId", role: "mockUserRole" };
        next();
        } else {
        res.status(401).json({ message: "Authentication token not provided" });
        }
    },
}));

describe("User API Endpoints", () => {
  describe("POST /api/user/register", () => {
    test("should register a new user successfully", async () => {
      const newUser = {
        email: "testuser@example.com",
        password: "TestPassword123",
        name: "Test User"
      };

      const response = await request(app)
        .post("/api/user/register")
        .send(newUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });
});
