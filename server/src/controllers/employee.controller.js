import employeeModel from "../models/employee.model.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const where = {};

    if(department) where.department = department;
    const employees = await employeeModel.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    if (!employees) {
      return res.status(404).json({
        success: false,
        message: "Employees not found!!",
      });
    }

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? { email: emp.userId.email, role: emp.userId.role }
        : null,
    }));

    return res.status(202).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const isUser = await userModel.findOne({ email });

    if (isUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      password: hashedPassword,
      role: role || "EMPLOYEE",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not created",
      });
    }

    const employee = await employeeModel.create({
      userId: user._id,
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(allowances) || 0,
      joinDate: new Date(joinDate),
      bio: bio || "",
    });

    if (!employee) {
      return res.status(402).json({
        success: false,
        message: "Employee not created",
      });
    }

    return res.status(201).json({ success: true, employee });
  } catch (error) {
    console.error("Create employee error: ", error);
    return res.status(500).json({ error: "Failed to create an employee" });
  }
};

const updateEmployee = async (req, res) => {
  try {

    const {id} = req.params
    
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      password,
      role,
      bio,
      employmentStatus
    } = req.body;

    const employee = await employeeModel.findById(id)
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      })
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(allowances) || 0,
      bio: bio || "",
      employmentStatus: employmentStatus || "ACTIVE"
    });

    const userUpdate = {email}

    if(role) userUpdate.role = role
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      userUpdate.password = hashedPassword
    }

    await userModel.findByIdAndUpdate(employee.userId, userUpdate)

    return res.status(200).json({ success: true, message: "Employee updated successfully", employee: updatedEmployee});

  } catch (error) {
    console.error("Update employee error: ", error);
    return res.status(500).json({ error: "Failed to update an employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {

    const {id} = req.params

    const employee = await employeeModel.findById(id)
    if (!employee ) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      })
    }

    employee.isDeleted = true
    employee.employmentStatus = "INACTIVE"
    await employee.save()

    return res.status(201).json({
      success: true,
      message: "Employee deleted successfully"
    })
    
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete an employee"
    })
  }
  
};

export { getEmployees, createEmployee, updateEmployee, deleteEmployee };
