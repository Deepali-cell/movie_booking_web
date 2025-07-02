// models/Admin.ts
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },

    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageTheaters: { type: Boolean, default: true },
      manageBookings: { type: Boolean, default: true },
      viewReports: { type: Boolean, default: true },
    },

    superAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
