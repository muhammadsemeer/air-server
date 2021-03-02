const USER = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  doSignup: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userExist = USER.findOne({
          $and: [
            { email: data.email },
            { $or: [{ status: "active" }, { status: "blocked" }] },
          ],
        });
        if (userExist && userExist.status === "blocked") {
          reject({ msg: "Your account is temporarily disabled for 30 Days" });
        } else if (userExist) {
          reject({ msg: "User Already Registered" });
        } else {
          data.password = await bcrypt.hash(data.password, 10);
          USER.insertOne(data).then((data) => {
            resolve(data.ops[0]);
          });
        }
      } catch (error) {
        resolve({ code: 500 });
      }
    });
  },
};
