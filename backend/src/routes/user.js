import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { siginInput, sigupInput } from "@nandan_k/medium-common";
const userRoute = new Hono();
userRoute.post("/signup", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const success = sigupInput.safeParse(body);
    if (!success.success) {
        c.status(400);
        return c.json({ message: "Invalid Input" });
    }
    try {
        const res = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        });
        const secret = c.env.JWTSECRET;
        const jwtToken = await sign({ id: res.id }, secret);
        return c.json({
            data: res,
            jwtToken: jwtToken,
        });
    }
    catch (e) {
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
                password: body.password,
            },
            select: {
                id: true,
                email: true,
            },
        });
        if (!res) {
            c.status(403);
            return c.json({ error: "user not found" });
        }
        const jwt = await sign({ id: res.id }, c.env.JWTSECRET);
        return c.json({ res, jwt });
    }
    catch (e) {
        c.status(403);
        return c.json({ e });
    }
});
export default userRoute;
