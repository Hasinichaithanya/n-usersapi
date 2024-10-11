const mongoose = require("mongoose");
const { User, uri } = require("./mongoose.js");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connection is Successful");
  })
  .catch((e) => {
    console.log("Error connecting to database: ", e);
  });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
//Get al users API
app.get("/all-users", (req, res) => {
  User.find({})
    .then((usersList) => {
      res.json(usersList);
    })
    .catch((e) => console.log(e));
});

app.get("/get-users", (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);
  if (page <= 0) {
    return res.status(400).json({
      message: "Invalid page size, page size must be greater than 0",
      success: false,
    });
  }
  if (size <= 0) {
    return res.status(400).json({
      message: "Invalid size, size must be greater than 0",
      success: false,
    });
  }
  User.find({})
    .skip((page - 1) * size)
    .limit(size)
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ message: "Fetched successfully", userList: result });
    })
    .catch((e) => {
      res.status(400).json("Error: ", e.message);
    });
});

//adding user API
app.post("/add-user", async (req, res) => {
 const userDetails = req.body;
  if (Object.keys(userDetails).length == 0)
    return res.status(400).json({ message: "Cannot add empty user!" });
  User.create(userDetails)
    .then((response) => {
      res.json({ response, Message: "Added successfully" });
      console.log(response);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        for (let key in error.errors) {
          console.log(key);
          validationErrors[key] = error.errors[key].message;
        }
        return res.status(400).json({ errors: validationErrors });
      }
    });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      if (user.password === password) {
        res
          .status(200)
          .json({ Message: "Login Success!", user: "user", userId: user._id });
      } else {
        res.status(401).json({ Message: "Incorrect password!" });
      }
    }  else {
      
      res
        .status(404)
        .json({ Message: "User does not exist, register to login!" });
    }
    console.log(user);
  } catch (err) {
 if (error.name === "ValidationError") {
        const validationErrors = {};
        for (let key in error.errors) {
          console.log(key);
          validationErrors[key] = error.errors[key].message;
        }
        return res.status(400).json({ errors: validationErrors });
      }    res.status(500).json({ Message: "Internal Server Error" });
  }
});
//update the user by id
app.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };
  const update = req.body;

  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (isValid == false) {
    return res
      .status(400)
      .json({ error: "Provided invalid ID, Could not update the user" });
  }
  User.findByIdAndUpdate(filter, update, { new: true })
    .exec()
    .then((response) => {
      res.json({ response, message: "Updated successfully" });
    })
    .catch((e) => res.status(400).json(e));
});
//delete the user based on ID
app.delete("/delete", async (req, res) => {
  const { id } = req.query;
  const condition = { _id: id };
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (isValid === false) {
    return res
      .status(400)
      .json({ error: "Provided invalid ID, Could not delete the user" });
  }
  User.findByIdAndDelete(condition)
    .then((response) => {
      res.json({ response, message: "Deleted successfully" });
    })
    .catch((e) => {
      res.status(400).send({ error: "Could not delete the user" });
    });
});
