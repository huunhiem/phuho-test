# Security Specification for PHÚ HỒ IT LMS

## 1. Data Invariants
- **Identity Invariant**: Submissions cannot be created with a `studentId` distinct from `request.auth.uid`.
- **Exam Integrity**: Question banks and answer keys are strictly inaccessible to students (`role == 'STUDENT'`).
- **Submission Immutability**: Once a submission status reaches `COMPLETED`, only authorized teachers or admins can update scores or feedback.
- **Administrative Invariant**: Role assignments and user modifications are strictly locked to `ADMIN` or the designated school super-admin email.

## 2. RBAC Tiers
- **ADMIN**: Full system administration (users, classes, academic years, system settings).
- **PRINCIPAL**: Institutional oversight, high-level school performance reports, curriculum audit.
- **DEPARTMENT_HEAD**: Tổ trưởng chuyên môn Tin học, bank audit, class assignments, subject reports.
- **TEACHER**: Question bank CRUD, test generation, assigning exams, manual essay grading, classroom analysis.
- **STUDENT**: View active assignments for their class, take exams, review personal scores.
