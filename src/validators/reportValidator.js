const Validator = require("fastest-validator");
const { REPORT_CATEGORIES } = require("../services/reportService");

const v = new Validator();

const submitReportSchema = {
  latitude: {
    type: "number",
    min: -90,
    max: 90,
    required: true,
  },
  longitude: {
    type: "number",
    min: -180,
    max: 180,
    required: true,
  },
  category: {
    type: "enum",
    values: REPORT_CATEGORIES,
    required: true,
  },
  description: {
    type: "string",
    min: 5,
    max: 1000,
    required: true,
  },
  title: {
    type: "string",
    max: 200,
    optional: true,
  },
  $$strict: true,
};

const submitReportValidator = v.compile(submitReportSchema);

const voteSchema = {
  vote: {
    type: "enum",
    values: ["up", "down"],
    required: true,
  },
  $$strict: true,
};

const voteValidator = v.compile(voteSchema);

const moderationSchema = {
  action: {
    type: "enum",
    values: ["approve", "reject", "flag_review", "hide", "unhide"],
    required: true,
  },
  reason: {
    type: "string",
    max: 500,
    optional: true,
  },
  $$strict: true,
};

const moderationValidator = v.compile(moderationSchema);

const commentSchema = {
  comment: {
    type: "string",
    min: 1,
    max: 500,
    required: true,
    trim: true,
  },
  $$strict: true,
};

const commentValidator = v.compile(commentSchema);

module.exports = {
  submitReportValidator,
  voteValidator,
  moderationValidator,
  commentValidator,
  submitReportSchema,
  voteSchema,
  moderationSchema,
  commentSchema,
};
