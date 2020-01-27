const express = require("express");
const router = express.Router();

const auth = require("../../modules/auth");
const Quiz = require("../../models/quiz");
const Admin = require("../../models/admin");

// list all quiz
router.get("/", (req, res, next) => {
  try {
    Quiz.find({})
      .populate("authorId")
      .exec((err, quizzes) => {
        if (err) return next(err);
        if (!quizzes)
          return res
            .status(400)
            .json({ success: false, msg: "No quizzes found!" });
        res.json({ quizzes, success: true });
      });
  } catch (err) {
    next(err);
  }
});

// single quiz
router.get("/:id", (req, res, next) => {
  try {
    Quiz.findById(req.params.id, (err, quiz) => {
      if (err) {
        next(err)
      }
      else if (!quiz) {
        res
        .status(400)
        .json({ success:false, msg:"Quiz Not Found" })
      }
      else {
        res.json(quiz)
      }
    })
  } catch (err) {
    next(err)
  }
})

// verify jwt
router.use(auth.verifyToken);

// create quiz
router.post("/", (req, res, next) => {
  try {
    Admin.findById(req.body.authorId, (err, author) => {
      if (err) {
        return next(err);
      }
      if (!author) {
        return res.status(401).json({ success: false, msg: "Unauthorized" });
      }
    });
    Quiz.create(req.body, (err, quizToCreate) => {
      if (err) return next(err);
      if (!quizToCreate) {
        return res.status(400).json({ success: false, msg: "No Quiz Found" });
      }

      res.status(200).json({
        success: true,
        msg: "Quiz created Successfully!",
        quizToCreate
      });
    });
  } catch (err) {
    next(err);
  }
});

// update quiz
router.put("/:id", (req, res, next) => {
  try {
    Quiz.findById(req.params.id, (err, quiz) => {
      if (err) {
        return next(err);
      }
      if (req.body.authorId === quiz.authorId) {
        Quiz.findByIdAndUpdate(req.params.id, req.body, (err, UpdatedQuiz) => {
          if (err) return next(err);
          if (!UpdatedQuiz) {
            return res
              .status(400)
              .json({ success: false, msg: "Quiz Not Found" });
          }
          res.json({ success: true, msg: "Quiz Updated" });
        });
      }
    });
  } catch (err) {
    next(err);
  }
});

// delete quiz
router.delete("/:id", (req, res, next) => {
  try {
    Quiz.findById(req.params.id, (err, quiz) => {
      if (err) {
        next(err);
      }

      if (req.user.userId == quiz.authorId) {
        Quiz.findByIdAndDelete(req.params.id, (err, quizToDelete) => {
          if (err) return next(err);
          if (!quizToDelete)
            return res.json({ success: false, msg: "Quiz Not Found!" });
          res.json({
            success: true,
            msg: "Quiz Successfully Deleted",
            quizToDelete
          });
        });
      } else {
        return res.status(401).json({ success: false, msg: "Unauthorized" });
      }
    });
  } catch (err) {
    next(err);
  }
});

// list of quizzes created by current admin
router.get("/list", (req, res, next) => {
  try {
    Quiz.find({ authorId: req.user.userId }, (err, list) => {
      if (error) {
         next(err)
      }

      else if (!list) {
        res.json({ success: false, msg: "Quiz Not Found" })
      }
      else {
        res.json({ list });
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
