import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { siginInput, sigupInput } from "../zod";
import { verify } from "hono/jwt";
import * as bcrypt from "bcryptjs";

const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWTSECRET: string;
  };
}>();

const saltRounds = 10;

userRoute.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const success = sigupInput.safeParse(body);

  if (!success.success) {
    c.status(400);
    console.error("Invalid input:", success.error);
    return c.json({ message: "Invalid Input" });
  }

  try {
    console.log("Creating user with data:", body);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashpassword = await bcrypt.hash(body.password, salt);

    const res = await prisma.user.create({
      data: {
        email: body.email,
        password: hashpassword,
        name: body.name,
      },
    });

    const secret = c.env.JWTSECRET;

    const jwt = await sign({ id: res.id }, secret);

    return c.json({
      token: jwt,
      id: res.id,
      profile: res.name ? res.name[0] : "U",
    });
  } catch (e) {
    return c.json({ e });
  }
});

userRoute.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const success = siginInput.safeParse(body);

  if (!success.success) {
    c.status(400);
    return c.json({ message: "Invalid Input" });
  }

  try {
    const res = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    const match = await bcrypt.compare(body.password, res?.password || "");
    if (!match) {
      c.status(403);
      return c.json({ error: "Invalid credentials" });
    }

    if (!res) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: res.id }, c.env.JWTSECRET);

    return c.json({
      token: jwt,
      id: res.id,
      profile: res.name ? res.name[0] : "U",
    });
  } catch (e) {
    c.status(403);
    return c.json({ e });
  }
});

userRoute.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.query("id");

  const token = c.req.header("Token");

  if (!token || !id) {
    c.status(403);
    return c.json({ error: "Token not found" });
  }

  const secret = c.env.JWTSECRET;

  const decoded = await verify(token, secret);

  if (!decoded) {
    c.status(403);
    return c.json({ error: "Invalid Token" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const blogs = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            name: true,
          },
        },
        content: true,
        published: true,
        publishedAt: true,
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({ user: user, blogs: blogs });
  } catch (e) {
    c.status(403);
    return c.json({ error: "User not found" });
  }
});

userRoute.get("/exists", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const email = c.req.query("email");

  if (!email) {
    c.status(400);
    return c.json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    if (!user) {
      console.log("User not found for email:", email);
      return c.json({ exists: false });
    }
    const jwt = await sign({ id: user?.id }, c.env.JWTSECRET);
    console.log("User found:", user);
    return c.json({
      exists: true,
      id: user.id,
      email: user.email,
      name: user.name,
      token: jwt,
    });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

export default userRoute;
