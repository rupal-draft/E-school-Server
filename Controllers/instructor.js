import User from "./../Models/user.js";

export const makeInstructor = async (req, res) => {
  try {
    const { qualification, experience, bankName, branchName, accountNumber } =
      req.body;
    const user = await User.findById(req.userId).exec();
    const statusUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        qualification: qualification,
        experience: experience,
        bankName: bankName,
        branchName: branchName,
        accountNumber: accountNumber,

        $addToSet: { role: "Instructor" },
      },
      { new: true }
    ).exec();
    res.json(statusUpdated);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating role");
  }
};
