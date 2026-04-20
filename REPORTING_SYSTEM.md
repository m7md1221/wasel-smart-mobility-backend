# Crowdsourced Reporting System - Implementation Guide

## Overview
The Crowdsourced Reporting System enables citizens to submit reports about mobility disruptions with built-in validation, duplicate detection, community voting, and comprehensive moderation capabilities.

## Database Models

### Report
- **Fields**: id, user_id, title, latitude, longitude, category, description, status, confidence_score, duplicate_of, created_at, updated_at
- **Categories**: Traffic, Accident, Road Closure, Construction, Public Transport, Hazard, Other
- **Status**: pending, approved, rejected, flagged, hidden
- **Confidence Score**: 0-100 (calculated from community votes)

### ReportVote
- **Fields**: id, report_id, user_id, vote (up/down), created_at
- **Purpose**: Community credibility scoring

### ModerationLog
- **Fields**: id, event_type, event_id, performed_by, action, reason, created_at
- **Actions**: approve, reject, flag_review, hide, unhide
- **Purpose**: Full auditability of all moderation actions

## API Endpoints

### Public Endpoints

#### Get All Reports
```
GET /api/v1/reports?category=Traffic&latitude=40.7128&longitude=-74.0060&radius_km=5&min_confidence=70&limit=20&page=0
```
**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status (pending, approved, rejected, etc.)
- `latitude` - Center latitude for geographic filter
- `longitude` - Center longitude for geographic filter
- `radius_km` - Search radius in kilometers (0-50)
- `min_confidence` - Minimum confidence score (0-100)
- `limit` - Results per page (1-100, default 20)
- `page` - Page number (0-indexed)

**Response:**
```json
{
  "message": "Reports retrieved successfully",
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "pages": 8
  }
}
```

#### Get Single Report
```
GET /api/v1/reports/:id
```
**Response:**
```json
{
  "message": "Report retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "title": "Traffic congestion on Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "category": "Traffic",
    "description": "Heavy traffic due to accident",
    "status": "approved",
    "confidence_score": 85,
    "created_at": "2024-03-31T10:30:00Z",
    "votes": {
      "upvotes": 42,
      "downvotes": 8,
      "total": 50
    }
  }
}
```

#### Get Report Statistics
```
GET /api/v1/reports/stats?category=Traffic
```
**Response:**
```json
{
  "message": "Report statistics retrieved",
  "data": {
    "total": 250,
    "approved": 180,
    "pending": 50,
    "rejected": 20,
    "by_category": [
      { "category": "Traffic", "count": 120 },
      { "category": "Accident", "count": 80 },
      { "category": "Road Closure", "count": 50 }
    ]
  }
}
```

#### Get Audit Trail
```
GET /api/v1/reports/:id/audit?limit=50
```
**Response:**
```json
{
  "message": "Audit trail retrieved successfully",
  "data": [
    {
      "id": 1,
      "action": "approve",
      "reason": "Verified by on-site inspection",
      "performed_by": 3,
      "timestamp": "2024-03-31T11:00:00Z"
    },
    {
      "id": 2,
      "action": "flag_review",
      "reason": "Low confidence score",
      "performed_by": null,
      "timestamp": "2024-03-31T10:45:00Z"
    }
  ]
}
```

### Authenticated User Endpoints

#### Submit Report
```
POST /api/v1/reports
Content-Type: application/json
Authorization: Bearer <token>

{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "category": "Traffic",
  "description": "Heavy congestion on Main Street near downtown",
  "title": "Main Street Traffic Jam" (optional)
}
```

**Validation Rules:**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Category: Must be valid category
- Description: 5-1000 characters, no spam keywords
- No more than 5 reports per hour (rate limit)

**Response (Success - 201):**
```json
{
  "message": "Report submitted successfully",
  "data": {
    "id": 42,
    "user_id": 5,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "category": "Traffic",
    "description": "Heavy congestion on Main Street",
    "status": "pending",
    "confidence_score": 50,
    "created_at": "2024-03-31T10:30:00Z"
  },
  "isDuplicate": false,
  "duplicates": []
}
```

**Response (Duplicate Report - 200):**
```json
{
  "message": "Report submitted successfully. Similar reports exist in this area.",
  "data": {...},
  "isDuplicate": true,
  "duplicates": [
    {
      "report_id": 41,
      "distance_km": 0.05,
      "description_similarity": 0.85,
      "is_duplicate": true
    }
  ]
}
```

**Error Response (400):**
```json
{
  "message": "Validation failed",
  "errors": [
    "Description must be at least 5 characters",
    "Report contains spam keywords"
  ]
}
```

**Error Response (429 - Rate Limit):**
```json
{
  "message": "Rate limit exceeded. Maximum 5 reports per hour"
}
```

#### Vote on Report
```
POST /api/v1/reports/:id/vote
Content-Type: application/json
Authorization: Bearer <token>

{
  "vote": "up"
}
```

**Vote Values:** "up" or "down"

**Response:**
```json
{
  "message": "Vote recorded successfully",
  "data": {
    "vote": {
      "id": 15,
      "report_id": 42,
      "user_id": 5,
      "vote": "up",
      "created_at": "2024-03-31T10:31:00Z"
    },
    "votes": {
      "upvotes": 43,
      "downvotes": 8,
      "confidence": 84
    }
  }
}
```

### Moderator/Admin Endpoints

#### Get Moderation Queue
```
GET /api/v1/reports/moderation/queue?limit=20&page=0
Authorization: Bearer <moderator_token>
```

**Requires:** role = "moderator" or "admin"

**Response:**
```json
{
  "message": "Moderation queue retrieved",
  "data": [
    {
      "id": 40,
      "title": "Accident on Highway 101",
      "description": "Multi-vehicle collision",
      "status": "flagged",
      "confidence_score": 15,
      "created_at": "2024-03-31T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0,
    "pages": 1
  }
}
```

#### Get Moderation Statistics
```
GET /api/v1/reports/moderation/stats
Authorization: Bearer <moderator_token>
```

**Response:**
```json
{
  "message": "Moderation statistics retrieved",
  "data": {
    "pending_review": 12,
    "flagged_for_review": 3,
    "approved": 180,
    "rejected": 20,
    "total_in_queue": 15
  }
}
```

#### Moderate Report
```
POST /api/v1/reports/:id/moderate
Content-Type: application/json
Authorization: Bearer <moderator_token>

{
  "action": "approve",
  "reason": "Verified through official channels"
}
```

**Actions:** approve, reject, flag_review, hide, unhide

**Response:**
```json
{
  "message": "Report approved successfully",
  "data": {
    "report": {
      "id": 42,
      "status": "approved",
      "updated_at": "2024-03-31T11:00:00Z"
    },
    "moderation_log": {
      "action": "approve",
      "reason": "Verified through official channels",
      "performed_by": 3,
      "timestamp": "2024-03-31T11:00:00Z"
    }
  }
}
```

#### Get Duplicate Reports
```
GET /api/v1/reports/moderation/duplicates
Authorization: Bearer <moderator_token>
```

**Response:**
```json
{
  "message": "Duplicate reports retrieved",
  "data": [
    {
      "id": 42,
      "duplicate_of": 41,
      "title": "Traffic on Main St",
      "status": "pending"
    }
  ],
  "count": 5
}
```

### Admin Endpoints

#### Get Moderation Logs
```
GET /api/v1/reports/moderation/logs?action=approve&performed_by=3&start_date=2024-03-01&end_date=2024-03-31&limit=50&page=0
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `event_type` - Filter by event type (report, comment, user)
- `action` - Filter by action (approve, reject, flag_review, etc.)
- `performed_by` - Filter by moderator user ID
- `start_date` - Filter from date (ISO format)
- `end_date` - Filter to date (ISO format)
- `limit` - Results per page (1-200)
- `page` - Page number

**Requires:** role = "admin"

**Response:**
```json
{
  "message": "Moderation logs retrieved",
  "data": [
    {
      "id": 15,
      "event_type": "report",
      "event_id": 42,
      "action": "approve",
      "reason": "Verified",
      "performed_by": 3,
      "created_at": "2024-03-31T11:00:00Z"
    }
  ],
  "pagination": {
    "total": 234,
    "limit": 50,
    "offset": 0,
    "pages": 5
  }
}
```

## Features

### Duplicate Detection
- Geographic clustering: Detects reports within 100 meters
- Text similarity: Uses Levenshtein distance algorithm
- Time-based: Only considers reports from last 24 hours
- Returns similarity score and distance for each duplicate

### Abuse Prevention
- **Rate Limiting**: 5 reports per hour per user
- **Spam Detection**: Checks descriptions for spam keywords
- **Input Validation**: Enforces length limits, valid categories, geographic bounds
- **Automatic Flagging**: Reports with confidence_score < 20 are auto-flagged

### Community Credibility Scoring
- **Vote System**: Users can upvote or downvote reports
- **Confidence Score**: Calculated as `upvotes / (upvotes + downvotes) * 100`
- **Dynamic Updates**: Score recalculates after each vote
- **Vote Replacement**: User can change their vote anytime

### Moderation Workflow
1. **Report Submission**: Marked as "pending"
2. **Moderation Review**: Moderators review pending/flagged reports
3. **Actions Available**: approve, reject, flag_review, hide, unhide
4. **Full Auditability**: Every action logged with moderator ID, timestamp, reason

### Audit Logging
- All moderation actions are logged
- Includes moderator ID, timestamp, action, reason
- Supports filtering by date, moderator, action type
- Retrievable per-report or system-wide

## Code Structure

```
src/
├── models/
│   ├── index.js                 # Model associations
│   ├── reportModel.js
│   ├── reportVoteModel.js
│   └── moderationLogsModel.js
├── services/
│   ├── reportService.js         # Core reporting logic
│   └── moderationService.js     # Moderation & audit logic
├── controllers/
│   └── reportController.js      # Route handlers
├── routes/
│   ├── reports.js              # Report routes
│   └── v1/index.js             # Route mounting
└── validators/
    └── reportValidator.js       # Input validation schemas
```

## Error Handling

### Common HTTP Status Codes
- `200 OK` - Successful GET/POST
- `201 Created` - Report successfully created
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Report not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Security Considerations

1. **Authentication**: All write operations require authentication
2. **Authorization**: Moderation endpoints require moderator/admin role
3. **Input Validation**: All inputs validated with fastest-validator
4. **Rate Limiting**: Prevents spam submissions
5. **Abuse Detection**: Automatically flags suspicious reports
6. **Audit Trail**: All moderation actions logged for compliance

## Future Enhancements

1. **Geographic Indexing**: Use PostGIS for better spatial queries
2. **ML-Based Spam Detection**: Advanced text analysis
3. **Reputation System**: User credibility based on voting accuracy
4. **Real-time Notifications**: Alert moderators of new reports
5. **Report Status Webhooks**: Notify users of moderation decisions
6. **Batch Operations**: Bulk moderation actions
7. **Report Analytics**: Visual dashboards for trending issues
8. **Multi-language Support**: Translate descriptions

## Testing the API

### 1. Submit a Report
```bash
curl -X POST http://localhost:4000/api/v1/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "category": "Traffic",
    "description": "Heavy traffic congestion on Main Street"
  }'
```

### 2. Get All Reports
```bash
curl "http://localhost:4000/api/v1/reports?category=Traffic&limit=10"
```

### 3. Vote on a Report
```bash
curl -X POST http://localhost:4000/api/v1/reports/1/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"vote": "up"}'
```

### 4. Moderate a Report (Admin Only)
```bash
curl -X POST http://localhost:4000/api/v1/reports/1/moderate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN" \
  -d '{
    "action": "approve",
    "reason": "Verified through official sources"
  }'
```
