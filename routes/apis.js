const express = require("express");
const router = express.Router();
const md5 = require("md5");
const User = require("../models/user");

router.post("/register", (req, res) => {
  let { userName, phoneNumber, password } = req.body;
  password = md5(password);
  const user = new User({
    userName,
    phoneNumber,
    password,
  });

  user
    .save()
    .then(() => {
      res.json({
        status: true,
        response: "User Added",
        user: user,
      });
    })
    .catch((err) => res.status(422).send({ error: err.message }));
});

router.post("/login", (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    res.json({
      status: false,
      response: "Please enter all details",
    });
  }

  User.findOne({ phoneNumber: phoneNumber }).then((user) => {
    if (user) {
      const dbPass = user.password;
      const encPass = md5(password);
      if (dbPass == encPass) {
        res.json({
          status: true,
          response: "User logged in Successfully",
          userId: user.phoneNumber,
        });

        user.active = true;
        user
          .save()
          .catch((err) => res.status(422).send({ error: err.message }));
      } else {
        res.json({
          status: false,
          response: "Wrong password. Try Again!",
        });
      }
    } else {
      res.json({
        satus: false,
        response: "No such user exists",
      });
    }
  });
});

router.post("/logout", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.json({
      status: false,
      response: "Bad authentication",
    });
  }

  User.findOne({ phoneNumber: phoneNumber }).then(user => {
    if(user){
        user.active = false;
        user.save()
        .catch((err) => res.status(422).send({ error: err.message }));
        res.json({
            status: true,
            response: 'User Logged out successfully'
        })
    }else{
        res.json({
            status: false,
            response: 'Bad authentication'
        })
    }
  });
});

module.exports = router;
