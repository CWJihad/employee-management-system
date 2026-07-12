import employeeModel from "../models/employee.model.js";



const getProfile = async (req, res) => {
    console.log(req.session);
    try {
        const session = req.session;
        const employee = await employeeModel.findOne({ userId: session.userId });

    // console.log(req.session?.userId);

    if (!employee) {
      // if user not employee it's mean it's admin
      return res.status(200).json({
        success: true,
        firstName: "Admin",
        lastName: "",
        email: session.email,
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch profile!",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await employeeModel.findOne({ userId: session.userId });

    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    if (employee.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated!",
      });
    }

    await employeeModel.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });

    return res.status(202).json({
      success: true,
      message: "Your profile is updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed!!",
    });
  }
};

export { getProfile, updateProfile };
