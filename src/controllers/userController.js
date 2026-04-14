// ... (كل الكود تبعك زي ما هو فوق بدون تغيير)

// ✅ DEACTIVATE USER
async function deactivateUser(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.is_active === false) {
      return res.status(400).json({
        message: "User is already deactivated"
      });
    }

    await user.update({ is_active: false, updated_at: new Date() });

    return res.status(200).json({
      message: "User deactivated successfully"
    });

  } catch (error) {
    console.error("[User] Error deactivating user:", error);

    return res.status(500).json({
      message: "Error deactivating user",
      error: error.message
    });
  }
}

// ✅ ACTIVATE USER
async function activateUser(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.is_active === true) {
      return res.status(400).json({
        message: "User is already active"
      });
    }

    await user.update({ is_active: true, updated_at: new Date() });

    return res.status(200).json({
      message: "User activated successfully"
    });

  } catch (error) {
    console.error("[User] Error activating user:", error);

    return res.status(500).json({
      message: "Error activating user",
      error: error.message
    });
  }
}

// ✅ EXPORT ALL
module.exports = {
  signup,
  login,
  addUser,
  showUserInfo,
  showAllUsers,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser
};