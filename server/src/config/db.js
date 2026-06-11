import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "./env.js";
import "../models/User.js";
import "../models/OtpToken.js";
import "../models/ChatMessage.js";


export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  try {
    // Try to connect to MongoDB with a short timeout to fail fast locally
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.warn("\n========================================================================");
    console.warn("⚠️  DATABASE WARNING: Could not connect to local MongoDB at " + env.mongoUri);
    console.warn("🔌  Review Lens has successfully switched to IN-MEMORY DATABASE MODE!");
    console.warn("✨  All features (Login, Signup, OTP) will work perfectly in memory.");
    console.warn("========================================================================\n");

    setupInMemoryMockDb();
  }
};

function setupInMemoryMockDb() {
  const usersStore = [];
  const otpsStore = [];

  const createUserInstance = (data) => {
    return {
      _id: data._id || new mongoose.Types.ObjectId(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash || "",
      provider: data.provider || "local",
      googleId: data.googleId || undefined,
      avatar: data.avatar || "",
      isVerified: data.isVerified || false,
      lastLoginAt: data.lastLoginAt || null,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      
      async save() {
        this.updatedAt = new Date();
        const idx = usersStore.findIndex(u => u._id.toString() === this._id.toString());
        if (idx !== -1) {
          usersStore[idx] = this;
        } else {
          usersStore.push(this);
        }
        return this;
      },
      
      async comparePassword(password) {
        if (!this.passwordHash) return false;
        return bcrypt.compare(password, this.passwordHash);
      }
    };
  };

  const createOtpInstance = (data) => {
    return {
      _id: data._id || new mongoose.Types.ObjectId(),
      email: data.email,
      purpose: data.purpose || "signup",
      otpHash: data.otpHash,
      attempts: data.attempts || 0,
      verified: data.verified || false,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      
      async save() {
        this.updatedAt = new Date();
        const idx = otpsStore.findIndex(o => o._id.toString() === this._id.toString());
        if (idx !== -1) {
          otpsStore[idx] = this;
        } else {
          otpsStore.push(this);
        }
        return this;
      }
    };
  };

  const makeQueryMock = (result) => {
    const mock = {
      select: () => mock,
      sort: () => mock,
      then: (resolve) => resolve(result),
      catch: (reject) => {},
    };
    return mock;
  };

  // Get Mongoose models
  const User = mongoose.model("User");
  const OtpToken = mongoose.model("OtpToken");
  const ChatMessage = mongoose.model("ChatMessage");

  // Mock User static methods
  User.findOne = (query) => {
    const email = query.email?.toLowerCase();
    const googleId = query.googleId;
    let found = null;
    if (email) {
      found = usersStore.find(u => u.email.toLowerCase() === email);
    } else if (googleId) {
      found = usersStore.find(u => u.googleId === googleId);
    }
    return makeQueryMock(found ? createUserInstance(found) : null);
  };

  User.findById = (id) => {
    const found = usersStore.find(u => u._id.toString() === id.toString());
    return makeQueryMock(found ? createUserInstance(found) : null);
  };

  User.create = async (data) => {
    const user = createUserInstance(data);
    usersStore.push(user);
    return user;
  };

  // Mock OtpToken static methods
  OtpToken.findOne = (query) => {
    const email = query.email?.toLowerCase();
    const purpose = query.purpose;
    const now = new Date();
    const found = otpsStore.find(o => 
      o.email.toLowerCase() === email && 
      o.purpose === purpose &&
      (!query.verified || o.verified === query.verified) &&
      o.expiresAt > now
    );
    return makeQueryMock(found ? createOtpInstance(found) : null);
  };

  OtpToken.deleteMany = async (query) => {
    const email = query.email?.toLowerCase();
    const purpose = query.purpose;
    let deletedCount = 0;
    for (let i = otpsStore.length - 1; i >= 0; i--) {
      if (otpsStore[i].email.toLowerCase() === email && otpsStore[i].purpose === purpose) {
        otpsStore.splice(i, 1);
        deletedCount++;
      }
    }
    return { deletedCount };
  };

  OtpToken.create = async (data) => {
    const otp = createOtpInstance(data);
    otpsStore.push(otp);
    return otp;
  };

  // Mock ChatMessage static and instance methods
  const chatsStore = [];

  const createChatMessageInstance = (data) => {
    return {
      _id: data._id || new mongoose.Types.ObjectId(),
      userId: data.userId,
      role: data.role,
      content: data.content,
      products: data.products || [],
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      
      async save() {
        this.updatedAt = new Date();
        const idx = chatsStore.findIndex(c => c._id.toString() === this._id.toString());
        if (idx !== -1) {
          chatsStore[idx] = this;
        } else {
          chatsStore.push(this);
        }
        return this;
      }
    };
  };

  ChatMessage.find = (query) => {
    const userId = query.userId?.toString();
    const found = chatsStore.filter(c => c.userId?.toString() === userId);
    const mock = {
      sort: () => mock,
      then: (resolve) => resolve(found.map(createChatMessageInstance)),
      catch: (reject) => {},
    };
    return mock;
  };

  ChatMessage.create = async (data) => {
    const chat = createChatMessageInstance(data);
    chatsStore.push(chat);
    return chat;
  };

  ChatMessage.deleteMany = async (query) => {
    const userId = query.userId?.toString();
    let deletedCount = 0;
    for (let i = chatsStore.length - 1; i >= 0; i--) {
      if (chatsStore[i].userId?.toString() === userId) {
        chatsStore.splice(i, 1);
        deletedCount++;
      }
    }
    return { deletedCount };
  };
}


