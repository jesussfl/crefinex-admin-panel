const myService = require("./my-service");
const section = require("./section");
const lesson = require("./lesson");
const exercise = require("./exercise.service");
const world = require("./world.service");
const lessonCompleted = require("./lessonCompleted.service");
const sectionCompleted = require("./sectionCompleted.service");
const worldCompleted = require("./worldCompleted.service");
module.exports = {
  myService,
  section,
  lesson,
  exercise,
  world,
  "lesson-completed": lessonCompleted,
  "section-completed": sectionCompleted,
  "world-completed": worldCompleted,
};
