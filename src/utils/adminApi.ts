
// Re-export all admin API functionality
export { adminLogin } from './api/auth';
export { getAllStudents, getStudentById, addStudent, updateStudentProgress } from './api/students';
export { updateCourse, createCourse, deleteCourse } from './api/courses';
export { getStudentAnalytics } from './api/analytics';
