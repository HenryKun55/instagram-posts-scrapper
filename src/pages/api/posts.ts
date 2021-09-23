// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { getPosts } from "../../services/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const posts = await getPosts();

    res.status(200).json({ posts });
  } catch (error: any) {
    return res.status(503).json({
      error: "Error to get posts from instagram",
      message: error.message,
    });
  }
}
