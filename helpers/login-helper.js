const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");

module.exports = {
  doSignup: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userExist = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({
            $and: [
              { email: data.email },
              { $or: [{ status: "active" }, { status: "blocked" }] },
            ],
          });
        if (userExist && userExist.status === "blocked") {
          reject({ msg: "Your account is temporarily disabled" });
        } else if (userExist) {
          reject({ msg: "User Already Registered" });
        } else {
          data.password = await bcrypt.hash(data.password, 10);
          data.status = "active"
          db.get()
            .collection(collection.USER_COLLECTION)
            .insertOne(data)
            .then((data) => {
              resolve(data.ops[0]);
            });
        }
      } catch (error) {
        reject({ code: 500 });
      }
    });
  },
};
