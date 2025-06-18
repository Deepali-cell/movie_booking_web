import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import User from "@/models/userModel";
import ConnectDb from "@/lib/ConnectDb";

// function for users
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🧩 Event received:", event.data);
    try {
      await ConnectDb();
      console.log("✅ MongoDB connected");

      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        image: image_url,
      };

      const savedUser = await User.create(userData);
      console.log("✅ User created in MongoDB:", savedUser);

      return savedUser;
    } catch (err) {
      console.error("❌ Error creating user:", err);
      throw err;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await ConnectDb();
    const { id } = event.data;

    return User.findByIdAndDelete(id);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    await ConnectDb();
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      image: image_url,
    };
    return User.findByIdAndUpdate(id, userData);
  }
);

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDeletion, syncUserUpdation],
});
