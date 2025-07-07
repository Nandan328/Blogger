import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "../zod";
import { Tag } from "@prisma/client";
import { SupabaseClient, User } from "@supabase/supabase-js";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWTSECRET: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };
  Variables: {
    user?: User;
  };
}>();

blogRoute.use("/*", async (c, next) => {
  const supabase = new SupabaseClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_ANON_KEY
  );
  const header = await c.req.header("Token");
  const supabaseHeader = await c.req.header("Authorization");
  if (supabaseHeader) {
    const token = supabaseHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      c.status(403);
      return c.json({ error: "unauthorized" });
    }
    console.table(data.user);
    c.set("user", data.user);
  } else {
    console.error("No Authorization header found");
  }

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
        authorImage: c.get("user")?.user_metadata?.avatar_url || "",
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
          set: body.tags.map((tag: string) => ({
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
          authorImage: true,
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
        authorImage: true,
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