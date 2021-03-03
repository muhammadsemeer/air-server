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
          data.status = "active";
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
  doLogin: (data) => {
    return new Promise(async(resolve, reject) => {
      try {
        let userData = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          $and: [
            { $or: [{ email: data.email }, { username: data.username }] },
            { $or: [{ status: "active" }, { status: "blocked" }] },
          ],
        });
        if (userData && userData.status === "blocked") {
          reject({ msg: "Your account is temporarily disabled" });
        } else if (userData) {
          bcrypt
            .compare(data.password, userData.password)
            .then((status) => {
              if (status) {
                resolve(userData);
              } else {
                reject({ msg: "Invalid Email Or Password" });
              }
            })
            .catch((error) => {
              reject({ code: 500 });
            });
        } else {
          reject({ msg: "Invalid Email Or Password" });
        }
      } catch (error) {
        reject({ code: 500 });
      }
    });
  },
};
