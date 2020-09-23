const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");

//show add page
// GET/stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("events/add");
});

//       Process add form
//@route  POST/stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
//show single story
// GET/stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) {
      return res.render("error/404");
    }

    res.render("events/show", {
      story,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});
//       show all EVENTS
//@route  GET/events/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("events/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//       show edit page
//@route GET/events/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();
  if (!story) return res.render("error/404");

  if (story.user != req.user.id) {
    res.redirect("/events");
  } else {
    res.render("events/edit", {
      story,
    });
  }
});
//Process UPDATE STORY
//@route  PUT/stories/:id

router.put("/:id", ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id).lean();
  if (!story) {
    return res.render("error/404");
  }
  if (story.user != req.user.id) {
    res.redirect("/events");
  } else {
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/dashboard");
  }
});

//show delete story
// GET/ stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(err);
    return res.render("error/500");
  }
});

// user stories
// GET/stories/user/userid
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("events/index", {
      stories,
    });
  } catch (error) {
    console.error(err);
    res.render("error/404");
  }
});
module.exports = router;
