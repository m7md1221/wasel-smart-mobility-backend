const { Report, ReportVote, User, ReportComment } = require("../models");
const { Op } = require("sequelize");

const SPAM_KEYWORDS = [
  "buy now",
  "click here",
  "free money",
  "guaranteed",
  "limited offer",
  "act now",
  "risk free",
];
const REPORT_CATEGORIES = [
  "Traffic",
  "Accident",
  "Road Closure",
  "Construction",
  "Public Transport",
  "Hazard",
  "Other",
];
const DUPLICATE_RADIUS_KM = 0.1; // 100 meters
const REPORT_VALIDITY_HOURS = 24;
const RATE_LIMIT_REPORTS_PER_HOUR = 100; // غيّر من 5 إلى 100 للاختبار

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateStringSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  const editDistance = getEditDistance(shorter, longer);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastVal = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newVal = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
        }
        costs[j - 1] = lastVal;
        lastVal = newVal;
      }
    }
    if (i > 0) costs[s2.length] = lastVal;
  }
  return costs[s2.length];
}

function containsSpamKeywords(text) {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

function calculateConfidenceScore(upvotes, downvotes) {
  const total = upvotes + downvotes;
  if (total === 0) return 50;
  return Math.round((upvotes / total) * 100);
}

async function validateReportInput(reportData) {
  const errors = [];

  if (!reportData.latitude || !reportData.longitude) {
    errors.push("Location (latitude, longitude) is required");
  } else {
    if (reportData.latitude < -90 || reportData.latitude > 90) {
      errors.push("Latitude must be between -90 and 90");
    }
    if (reportData.longitude < -180 || reportData.longitude > 180) {
      errors.push("Longitude must be between -180 and 180");
    }
  }

  if (!reportData.category || !REPORT_CATEGORIES.includes(reportData.category)) {
    errors.push(
      `Category must be one of: ${REPORT_CATEGORIES.join(", ")}`
    );
  }

  if (!reportData.description || reportData.description.trim().length < 5) {
    errors.push("Description must be at least 5 characters");
  }

  if (reportData.description && reportData.description.length > 1000) {
    errors.push("Description must not exceed 1000 characters");
  }

  if (reportData.description && containsSpamKeywords(reportData.description)) {
    errors.push("Report contains spam keywords");
  }

  if (reportData.title && reportData.title.length > 200) {
    errors.push("Title must not exceed 200 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function checkDuplicates(latitude, longitude, category, description) {
  const oneHourAgo = new Date(Date.now() - REPORT_VALIDITY_HOURS * 60 * 60 * 1000);

  const recentReports = await Report.findAll({
    where: {
      category,
      created_at: {
        [Op.gte]: oneHourAgo,
      },
    },
    raw: true,
  });

  const duplicates = recentReports
    .map((report) => {
      const distanceKm = haversineDistance(
        latitude,
        longitude,
        report.latitude,
        report.longitude
      );

      const descriptionSimilarity = calculateStringSimilarity(
        description,
        report.description
      );

      const isDuplicate =
        distanceKm <= DUPLICATE_RADIUS_KM && descriptionSimilarity > 0.7;

      return {
        report_id: report.id,
        distance_km: distanceKm,
        description_similarity: descriptionSimilarity,
        is_duplicate: isDuplicate,
      };
    })
    .filter((d) => d.is_duplicate);

  return duplicates;
}

async function checkUserRateLimit(userId) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const count = await Report.count({
    where: {
      user_id: userId,
      created_at: {
        [Op.gte]: oneHourAgo,
      },
    },
  });

  return count < RATE_LIMIT_REPORTS_PER_HOUR;
}

async function submitReport(userId, reportData) {
  // Validate input
  const validation = await validateReportInput(reportData);
  if (!validation.valid) {
    throw {
      status: 400,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  // Check rate limit
  const rateLimitOk = await checkUserRateLimit(userId);
  if (!rateLimitOk) {
    throw {
      status: 429,
      message: `Rate limit exceeded. Maximum ${RATE_LIMIT_REPORTS_PER_HOUR} reports per hour`,
    };
  }

  // Check for duplicates
  const duplicates = await checkDuplicates(
    reportData.latitude,
    reportData.longitude,
    reportData.category,
    reportData.description
  );

  // Create report
  const report = await Report.create({
    user_id: userId,
    title: reportData.title || reportData.description.substring(0, 100),
    latitude: reportData.latitude,
    longitude: reportData.longitude,
    category: reportData.category,
    description: reportData.description,
    status: "pending",
    confidence_score: 50,
    duplicate_of: duplicates.length > 0 ? duplicates[0].report_id : null,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return {
    report: report.toJSON(),
    duplicates,
    isDuplicate: duplicates.length > 0,
  };
}

async function getReports(filters = {}) {
  const where = {};

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.latitude && filters.longitude && filters.radius_km) {
    // This is a simplified filter - in production, use PostGIS
    where.latitude = {
      [Op.between]: [
        filters.latitude - filters.radius_km / 111,
        filters.latitude + filters.radius_km / 111,
      ],
    };
    where.longitude = {
      [Op.between]: [
        filters.longitude - filters.radius_km / 111,
        filters.longitude + filters.radius_km / 111,
      ],
    };
  }

  if (filters.min_confidence !== undefined && filters.min_confidence !== null) {
    where.confidence_score = {
      [Op.gte]: filters.min_confidence,
    };
  }

  const limit = Math.min(filters.limit || 20, 100);
  const offset = (filters.page || 0) * limit;

  const reports = await Report.findAll({
    where,
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  const total = await Report.count({ where });

  return {
    reports,
    pagination: {
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getReportById(reportId) {
  const report = await Report.findByPk(reportId);

  if (!report) {
    throw {
      status: 404,
      message: "Report not found",
    };
  }

  // Get vote stats
  const votes = await ReportVote.findAll({
    where: { report_id: reportId },
    raw: true,
  });

  const upvotes = votes.filter((v) => v.vote === "up").length;
  const downvotes = votes.filter((v) => v.vote === "down").length;

  return {
    ...report.toJSON(),
    votes: {
      upvotes,
      downvotes,
      total: votes.length,
    },
  };
}

async function voteOnReport(reportId, userId, vote) {
  const report = await Report.findByPk(reportId);
  if (!report) {
    throw {
      status: 404,
      message: "Report not found",
    };
  }

  if (!["up", "down"].includes(vote)) {
    throw {
      status: 400,
      message: "Vote must be 'up' or 'down'",
    };
  }

  // Check if user already voted
  let existingVote = await ReportVote.findOne({
    where: {
      report_id: reportId,
      user_id: userId,
    },
  });

  if (existingVote) {
    // Update existing vote
    existingVote.vote = vote;
    existingVote.created_at = new Date();
    await existingVote.save();
  } else {
    // Create new vote
    existingVote = await ReportVote.create({
      report_id: reportId,
      user_id: userId,
      vote,
      created_at: new Date(),
    });
  }

  // Recalculate confidence score
  const votes = await ReportVote.findAll({
    where: { report_id: reportId },
    raw: true,
  });

  const upvotes = votes.filter((v) => v.vote === "up").length;
  const downvotes = votes.filter((v) => v.vote === "down").length;
  const confidence = calculateConfidenceScore(upvotes, downvotes);

  report.confidence_score = confidence;
  await report.save();

  return {
    vote: existingVote.toJSON(),
    votes: {
      upvotes,
      downvotes,
      confidence,
    },
  };
}

async function getReportStats(category = null) {
  const where = category ? { category } : {};

  const total = await Report.count({ where });
  const approved = await Report.count({
    where: { ...where, status: "approved" },
  });
  const pending = await Report.count({
    where: { ...where, status: "pending" },
  });
  const rejected = await Report.count({
    where: { ...where, status: "rejected" },
  });

  return {
    total,
    approved,
    pending,
    rejected,
    by_category: REPORT_CATEGORIES.length > 0
      ? await Promise.all(
          REPORT_CATEGORIES.map(async (cat) => ({
            category: cat,
            count: await Report.count({ where: { category: cat } }),
          }))
        )
      : [],
  };
}

async function addComment(reportId, userId, commentText) {
  // Validate report exists
  const report = await Report.findByPk(reportId);
  if (!report) {
    throw {
      status: 404,
      message: "Report not found",
    };
  }

  // Validate user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  // Create comment
  const comment = await ReportComment.create({
    report_id: reportId,
    user_id: userId,
    comment: commentText,
    created_at: new Date(),
  });

  return comment.toJSON();
}

async function getReportComments(reportId, limit = 50, offset = 0) {
  // Validate report exists
  const report = await Report.findByPk(reportId);
  if (!report) {
    throw {
      status: 404,
      message: "Report not found",
    };
  }

  const comments = await ReportComment.findAll({
    where: { report_id: reportId },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "email"],
      },
    ],
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  const total = await ReportComment.count({ where: { report_id: reportId } });

  return {
    comments: comments.map((c) => c.toJSON()),
    pagination: {
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    },
  };
}

async function deleteComment(commentId, userId) {
  const comment = await ReportComment.findByPk(commentId);
  if (!comment) {
    throw {
      status: 404,
      message: "Comment not found",
    };
  }

  // Only allow comment author or admin/moderator to delete
  if (comment.user_id !== userId) {
    throw {
      status: 403,
      message: "You can only delete your own comments",
    };
  }

  await comment.destroy();

  return {
    message: "Comment deleted successfully",
    comment_id: commentId,
  };
}

module.exports = {
  submitReport,
  getReports,
  getReportById,
  voteOnReport,
  getReportStats,
  checkDuplicates,
  calculateConfidenceScore,
  addComment,
  getReportComments,
  deleteComment,
  REPORT_CATEGORIES,
  RATE_LIMIT_REPORTS_PER_HOUR,
};
