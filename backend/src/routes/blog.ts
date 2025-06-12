import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "../zod";
import { Tag } from "@prisma/client";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWTSECRET: string;
  };
}>();

blogRoute.use("//*", async (c, next) => {
  const header = await c.req.header("Token");
  const secret = c.env.JWTSECRET;
  if (!header) return;
  const res = await verify(header, secret);

  if (res.id) {
    await next();
  } else {
    c.status(403);
    return c.json({ error: "unauthorized" });
  }
});

blogRoute.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const success = createBlogInput.safeParse(body);

  if(!success.success) {
    c.status(400)
    return c.json({ message: "Invalid Input" });
  }

  try {
    await Promise.all(
      body.tags.map((tag: string) =>
        prisma.tags.upsert({
          where: { name: tag as Tag },
          update: {},
          create: { name: tag as Tag },
        })
      )
    );

    const res = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: body.authorId,
        published: body.published,
        tags: {
          connect: body.tags.map((tag: string) => ({
            name: tag as Tag,
          })),
        },
      },
    });

    return c.json({ res });
  } catch (e) {
    c.status(411);
    return c.json({ e });
  }
});

blogRoute.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  
  const success = updateBlogInput.safeParse(body);

  if(!success.success) {
    c.status(400);
    return c.json({ message: "Invalid Inputs" });
  }

  const blogId = c.req.query();

  try {
    await Promise.all(
      body.tags.map((tag: string) =>
        prisma.tags.upsert({
          where: { name: tag as Tag },
          update: {},
          create: { name: tag as Tag },
        })
      )
    );

    const res = await prisma.post.update({
      where: {
        id: blogId.id,
      },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
        tags: {
          connect: body.tags.map((tag: string) => ({
            name: tag as Tag,
          })),
        },
      },
    });

    return c.json(res);
  } catch (e) {
    c.status(411);
    return c.json({ e });
  }
});

blogRoute.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const res = await prisma.post.findMany(
      {
        where: {
          published: true,
        },
        select:{
          id: true,
          title: true,
          content: true,
          author: {
            select: {
              name: true,
            },
          },
          publishedAt: true,
          tags: {
            select: {
              name: true,
            },
          },
        }
      }
    );
    return c.json(res);
  } catch (e) {
    c.status(411);
    return c.json({ e });
  }
});

blogRoute.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.query().id;
  try {
    const res = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        publishedAt: true,
        author:{
          select:{
            name: true,
          }
        },
        tags: {
          select: {
            name: true,
          },
        }, 
      },
    });

    return c.json(res);
  } catch (e) {
    c.status(411);
    return c.json({ e });
  }
});

blogRoute.delete("/",  async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogId = c.req.query().id;

  try {
    const res = await prisma.post.delete({
      where: {
        id: blogId,
      },
    });
  } catch (e) {
    c.status(411);
    return c.json({ e });
  }
  return c.json({ message: "Blog deleted successfully" });
})

export default blogRoute;