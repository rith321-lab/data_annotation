# Synthetic Data Breakdown

This document provides a comprehensive overview of all synthetic data currently stored in the Verita AI database.

**Generated:** January 31, 2025  
**Database:** `verita_ai`  
**Tables:** 3 (users, projects, tasks)

---

## 📊 Database Overview

| Table | Record Count | Status |
|-------|-------------|--------|
| **users** | 3 | ✅ Active |
| **projects** | 4 | ✅ Active |
| **tasks** | 0 | ⚠️ Empty |

---

## 👥 User Accounts

### Admin User
- **ID:** `d2aff4cb-2927-4649-aead-979923e2f998`
- **Email:** `admin@demo.com`
- **Full Name:** Admin User
- **Role:** Super User (Administrator)
- **Status:** Active
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Permissions:** Full system access, project management, user management

### Annotator User
- **ID:** `9cece6cc-9c6d-42a8-a8cf-1806b5ee71d5`
- **Email:** `annotator@demo.com`
- **Full Name:** Annotator User
- **Role:** Standard User (Annotator)
- **Status:** Active
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Permissions:** Data annotation, task completion

### Client User
- **ID:** `2a9f4830-d6dc-482e-bf19-1f993236fd2e`
- **Email:** `client@demo.com`
- **Full Name:** Client User
- **Role:** Standard User (Client)
- **Status:** Active
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Permissions:** Project viewing, results access

---

## 📋 Projects

### 1. E-commerce Product Classification
- **ID:** `11a70092-2bc3-4f23-a289-9efb16d5db8f`
- **Owner:** Admin User (`d2aff4cb-2927-4649-aead-979923e2f998`)
- **Description:** Classify product images into categories
- **Status:** 🟢 Active
- **Progress:** 750/1000 tasks completed (75%)
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Project Type:** Image Classification
- **Industry:** E-commerce/Retail

### 2. Medical Image Annotation
- **ID:** `d804b3b3-8415-49f7-9366-40c775cbd24d`
- **Owner:** Admin User (`d2aff4cb-2927-4649-aead-979923e2f998`)
- **Description:** Annotate medical images for ML training
- **Status:** 🟢 Active
- **Progress:** 320/500 tasks completed (64%)
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Project Type:** Medical Image Annotation
- **Industry:** Healthcare/Medical AI

### 3. Text Sentiment Analysis
- **ID:** `f6d6eb93-2cf6-4994-834a-36ddf143df38`
- **Owner:** Admin User (`d2aff4cb-2927-4649-aead-979923e2f998`)
- **Description:** Label text data for sentiment analysis
- **Status:** ⏸️ Paused
- **Progress:** 1200/2000 tasks completed (60%)
- **Created:** July 31, 2025 at 02:42:04 UTC
- **Project Type:** Text Classification/NLP
- **Industry:** Social Media/Marketing Analytics

### 4. Fun Time Project
- **ID:** `cd1de4d9-5750-4891-bbd5-6f50d7b6cb07`
- **Owner:** Admin User (`d2aff4cb-2927-4649-aead-979923e2f998`)
- **Description:** Best Project Ever !!!
- **Status:** 📝 Draft
- **Progress:** 0/0 tasks completed (0%)
- **Created:** July 31, 2025 at 04:38:29 UTC
- **Project Type:** Unknown/Test
- **Industry:** Demo/Testing

---

## 📈 Analytics Summary

### Project Status Distribution
- **Active Projects:** 2 (50%)
- **Paused Projects:** 1 (25%)
- **Draft Projects:** 1 (25%)
- **Completed Projects:** 0 (0%)

### Task Completion Overview
- **Total Tasks Across All Projects:** 3,500
- **Total Completed Tasks:** 2,270
- **Overall Completion Rate:** 64.9%

### User Distribution
- **Administrators:** 1 (33.3%)
- **Standard Users:** 2 (66.7%)
- **Active Users:** 3 (100%)
- **Inactive Users:** 0 (0%)

### Project Ownership
- **Projects Owned by Admin User:** 4 (100%)
- **Projects per User Average:** 1.33

---

## 🎯 Project Industry Breakdown

| Industry | Projects | Total Tasks | Completed | Completion % |
|----------|----------|-------------|-----------|--------------|
| E-commerce/Retail | 1 | 1,000 | 750 | 75% |
| Healthcare/Medical | 1 | 500 | 320 | 64% |
| Social Media/Marketing | 1 | 2,000 | 1,200 | 60% |
| Demo/Testing | 1 | 0 | 0 | 0% |

---

## 🔐 Security & Access

### Password Security
- All user passwords are properly hashed using bcrypt
- Hash format: `$2b$12$...` (bcrypt with 12 rounds)

### User Permissions
- **Super Users:** 1 (can manage users and all projects)
- **Standard Users:** 2 (limited to assigned tasks and projects)

### Active Sessions
- All users currently active
- No disabled or suspended accounts

---

## 🗄️ Data Relationships

### User-Project Relationships
- **Admin User** owns all 4 projects
- No projects assigned to Annotator or Client users yet
- All projects created by the same owner (centralized structure)

### Task Assignments
- **Tasks table is currently empty** (0 records)
- Projects have task counts but no individual task records
- Ready for task creation and assignment workflow

---

## 🚀 Next Steps & Recommendations

### Immediate Actions
1. **Create individual tasks** for existing projects
2. **Assign tasks** to Annotator and Client users
3. **Add more diverse users** with different roles
4. **Create projects** owned by different users

### Data Expansion Opportunities
1. Add more project types (audio, video, document annotation)
2. Create team-based projects with multiple collaborators
3. Implement project templates for common use cases
4. Add project categories and tags for better organization

### Testing Scenarios
1. **Login Testing:** Use provided demo accounts
2. **Project Management:** Test project creation, editing, status changes
3. **User Management:** Test user role assignments and permissions
4. **Task Workflow:** Create and assign annotation tasks

---

## 📚 Technical Notes

### Database Schema
- **UUIDs used for all primary keys** (good for distributed systems)
- **Timestamps in UTC** (2025-07-31 format)
- **Boolean flags for user permissions** (is_active, is_superuser)
- **Enum-like status fields** for projects (active, paused, draft)

### Data Quality
- ✅ All required fields populated
- ✅ Consistent data formats
- ✅ Valid relationships between tables
- ✅ Appropriate data types used

### Performance Considerations
- Small dataset suitable for testing and development
- Indexes likely needed on commonly queried fields (email, status, owner_id)
- Consider pagination for task lists when populated

---

*This breakdown was generated automatically from the database inspection on January 31, 2025.* 