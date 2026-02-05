import express from 'express';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const router = express.Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const response = await clerkClient.users.getUserList({ limit: 100 });
    const userList = response.data || response; 
    res.json(userList);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// DELETE USER
router.delete('/:id', async (req, res) => {
  try {
    await clerkClient.users.deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 👇 ADD THIS: TOGGLE ADMIN ROLE ROUTE
router.patch('/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // Expect "admin" or "customer" (or null)

    // Update Clerk Metadata
    await clerkClient.users.updateUser(id, {
      publicMetadata: {
        role: role // Set 'admin' to promote, null to demote
      }
    });

    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

export default router;