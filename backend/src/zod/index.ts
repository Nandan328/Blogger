import z from "zod";

export const siginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const sigupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()), 
  authorId: z.string(),
  published: z.boolean().optional(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  id: z.string(),
  published: z.boolean().optional(),
  authorId: z.string().optional(),
});

export type sigunInputType = z.infer<typeof sigupInput>;
export type siginInputType = z.infer<typeof siginInput>;
export type createBlogInputType = z.infer<typeof createBlogInput>;
export type updateBlogInputType = z.infer<typeof updateBlogInput>;
