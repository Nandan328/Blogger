import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@nandan_k/medium-common";
const blogRoute = new Hono();
blogRoute.use("//*", async (c, next) => {
    const header = await c.req.header("Token");
    const secret = c.env.JWTSECRET;
    if (!header)
        return;
    const res = await verify(header, secret);
    if (res.id) {
        await next();
    }
    else {
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
    if (!success.success) {
        c.status(400);
        return c.json({ message: "Invalid Input" });
    }
    try {
        const res = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: body.authorId,
            },
        });
        return c.json({ res });
    }
    catch (e) {
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
    if (success.success) {
        c.status(400);
        return c.json({ message: "Invalid Input" });
    }
    const blogId = c.req.query();
    try {
        const res = await prisma.post.update({
            where: {
                id: blogId.id,
            },
            data: {
                title: body.title,
                content: body.content,
            },
        });
        return c.json(res);
    }
    catch (e) {
        c.status(411);
        return c.json({ e });
    }
});
blogRoute.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try {
        const res = await prisma.post.findMany();
        return c.json(res);
    }
    catch (e) {
        c.status(411);
        return c.json({ e });
    }
});
blogRoute.get("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
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
                authorId: true,
            },
        });
        return c.json(res);
    }
    catch (e) {
        c.status(411);
        return c.json({ e });
    }
});
export default blogRoute;
