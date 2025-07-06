import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import User from "@/models/userModel";
import ConnectDb from "@/lib/ConnectDb";

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await ConnectDb();
    const { id } = event.data;
    return User.findByIdAndDelete(id);
  }
);

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await ConnectDb();

    const {
      id,
      first_name,
      last_name,
      username,
      email_addresses,
      image_url,
      phone_numbers,
    } = event.data;

    let name = "Unnamed User";
    if (first_name || last_name) {
      name = `${first_name || ""} ${last_name || ""}`.trim();
    } else if (username) {
      name = username;
    }

    const userData = {
      _id: id,
      name,
      username,
      email: email_addresses[0].email_address,
      image: image_url,
      phoneNumber: phone_numbers?.[0]?.phone_number || "not-provided",
      role: "user",
    };

    console.log("✅ Creating user:", userData);
    return await User.create(userData);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await ConnectDb();
    console.log("📢 user.updated data:", JSON.stringify(event.data, null, 2));

    const {
      id,
      first_name,
      last_name,
      username,
      email_addresses,
      image_url,
      phone_numbers,
    } = event.data;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    let name = "Unnamed User";
    if (first_name || last_name) {
      name = `${first_name || ""} ${last_name || ""}`.trim();
    } else if (username) {
      name = username;
    }

    const userData = {
      name,
      username,
      email: email_addresses[0].email_address,
      image: image_url,
      phoneNumber: phone_numbers?.[0]?.phone_number || "not-provided",
      role: existingUser.role,
    };

    console.log("✅ Updating user:", userData);
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }
);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDeletion, syncUserUpdation],
});
