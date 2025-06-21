// /pages/api/checkUserRole.ts
import { NextApiRequest, NextApiResponse } from "next";
import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing ID" });
    }

    await ConnectDb();
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ role: user.role || null });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
}
