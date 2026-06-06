import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { query, withTransaction } from "../config/db.js";
import { env } from "../config/env.js";
import { asyncHandler, sendOk } from "../utils/http.js";

const router = Router();
const VENDOR_ROLE = "vendor";

function signUser(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendor_id || null,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function toAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    vendorId: user.vendor_id || null,
  };
}

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { rows } = await query(
      `select id, name, email, role, password, vendor_id
       from users
       where lower(email) = lower($1)
       limit 1`,
      [email]
    );

    const user = rows[0];
    const storedPassword = user?.password || "";
    const isHashed = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$");
    const isValid = user
      ? isHashed
        ? await bcrypt.compare(password, storedPassword)
        : password === storedPassword
      : false;

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return sendOk(res, {
      token: signUser(user),
      user: toAuthUser(user),
    });
  })
);

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Full name, email, password, and role are required" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await withTransaction(async (client) => {
      const existing = await client.query("select id from users where lower(email) = lower($1)", [email]);
      if (existing.rows.length) {
        const error = new Error("Email is already registered");
        error.status = 409;
        throw error;
      }

      const inserted = await client.query(
        `insert into users (name, email, password, role)
         values ($1, $2, $3, $4)
         returning id, name, email, role, vendor_id`,
        [fullName, email, passwordHash, role]
      );

      const user = inserted.rows[0];

      if (role === VENDOR_ROLE) {
        const vendorResult = await client.query(
          `insert into vendors (company_name, email, status, rating)
           values ($1, $2, 'Active', 0)
           returning id`,
          [fullName, email]
        );

        const updated = await client.query(
          `update users
           set vendor_id = $2
           where id = $1
           returning id, name, email, role, vendor_id`,
          [user.id, vendorResult.rows[0].id]
        );

        return updated.rows[0];
      }

      return user;
    });

    return sendOk(
      res,
      {
        token: signUser(user),
        user: toAuthUser(user),
      },
      201
    );
  })
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    return sendOk(res, { message: "If the account exists, password reset instructions were sent." });
  })
);

export default router;
