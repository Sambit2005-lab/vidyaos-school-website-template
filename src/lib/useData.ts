"use client";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "./AppContext";
import { t } from "./translations";
import {
  subscribeSchools, subscribeStudents, subscribeTeachers,
  subscribeNotices, subscribeCirculars, subscribeLeaveRequests,
  subscribeAdmissions, subscribeSalaries, subscribeHomework,
  subscribeTeacherAssignments, subscribeTeacherClasses,
  subscribeOrganizations, subscribeMonthlyReports, subscribeTenantStats,
  subscribeExams, subscribeMarks,
  subscribeClasses, subscribeFeeRecords, subscribeSalaryRecords,
} from "./firestoreService";
import {
  schools as mockSchools,
  studentsData as mockStudents,
  teachersData as mockTeachers,
  noticesData as mockNotices,
  circularsData as mockCirculars,
  leaveRequests as mockLeaveRequests,
  admissionLeads as mockAdmissionLeads,
  salariesData as mockSalaries,
  homeworkData as mockHomework,
  teacherClasses as mockTeacherClasses,
  teacherAssignments as mockTeacherAssignments,
  dashboardStats as mockDashboardStats,
  districtWiseData as mockDistrictWise,
  recentActivities as mockRecentActivities,
  organizations as mockOrganizations,
  allMonthlyReports as mockMonthlyReports,
  admissionFormsData as mockAdmissionForms,
} from "./data";
import type {
  School, Student, Teacher, Notice, Circular, LeaveRequest,
  AdmissionLead, AdmissionFormData, Salary, Homework, TeacherClass, TeacherAssignment,
  DashboardStats, DistrictWiseItem, Activity, Organization, MonthlyReportEntry,
} from "./data";

function useDemoOrSnapshot<T>(
  demoValue: T,
  subscribe: (cb: (data: T) => void) => (() => void) | undefined,
): T {
  const { demoMode } = useApp();
  
  const getCleanValue = (): T => {
    if (Array.isArray(demoValue)) return [] as unknown as T;
    if (typeof demoValue === "object" && demoValue !== null) {
      return {} as T;
    }
    return demoValue;
  };

  const [data, setData] = useState<T>(demoMode ? demoValue : getCleanValue());

  useEffect(() => {
    if (demoMode) {
      setData(demoValue);
      return;
    }
    setData(getCleanValue());
    const unsub = subscribe(setData);
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  return data;
}

// ─── Schools ───

export function useSchools() {
  const { tenantId, role, userProfile } = useApp();
  const targetTenantId = role === "super-admin" ? "all" : tenantId;
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<School[]>(mockSchools, (cb) =>
    subscribeSchools(targetTenantId, cb, activeSchoolId)
  );
}

// ─── Students ───

export function useStudents(schoolId?: string | number) {
  const { tenantId, role, userProfile } = useApp();
  const targetTenantId = role === "super-admin" ? "all" : tenantId;
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : schoolId;
  return useDemoOrSnapshot<Student[]>(mockStudents, (cb) =>
    subscribeStudents(targetTenantId, cb, activeSchoolId)
  );
}

// ─── Teachers ───

export function useTeachers(schoolId?: string | number) {
  const { tenantId, role, userProfile } = useApp();
  const targetTenantId = role === "super-admin" ? "all" : tenantId;
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : schoolId;
  return useDemoOrSnapshot<Teacher[]>(mockTeachers, (cb) =>
    subscribeTeachers(targetTenantId, cb, activeSchoolId)
  );
}

// ─── Notices ───

export function useNotices(audience?: string) {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  const filteredMock = audience
    ? mockNotices
    : mockNotices;
  return useDemoOrSnapshot<Notice[]>(filteredMock, (cb) =>
    subscribeNotices(tenantId, audience, cb, activeSchoolId) as (() => void)
  );
}

// ─── Circulars ───

export function useCirculars() {
  const { tenantId } = useApp();
  return useDemoOrSnapshot<Circular[]>(mockCirculars, (cb) =>
    subscribeCirculars(tenantId, cb)
  );
}

// ─── Leave Requests ───

export function useLeaveRequests() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<LeaveRequest[]>(mockLeaveRequests, (cb) =>
    subscribeLeaveRequests(tenantId, cb, activeSchoolId)
  );
}

// ─── Admissions ───

export function useAdmissions() {
  const { tenantId, role, userProfile } = useApp();
  const targetTenantId = role === "super-admin" ? "all" : tenantId;
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<AdmissionFormData[]>(mockAdmissionForms, (cb) =>
    subscribeAdmissions(targetTenantId, cb, activeSchoolId)
  );
}

// ─── Salaries ───

export function useSalaries() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<Salary[]>(mockSalaries, (cb) =>
    subscribeSalaries(tenantId, cb, activeSchoolId)
  );
}

// ─── Homework ───

export function useHomework() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<Homework[]>(mockHomework, (cb) =>
    subscribeHomework(tenantId, cb, activeSchoolId)
  );
}

// ─── Teacher Classes ───

export function useTeacherClasses(teacherId?: string) {
  const { tenantId } = useApp();
  return useDemoOrSnapshot<TeacherClass[]>(mockTeacherClasses, (cb) =>
    subscribeTeacherClasses(tenantId, teacherId || "current", cb)
  );
}

// ─── Teacher Assignments ───

export function useTeacherAssignments() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<TeacherAssignment[]>(mockTeacherAssignments, (cb) =>
    subscribeTeacherAssignments(tenantId, cb, activeSchoolId)
  );
}

// ─── Dashboard Stats ───

export function useDashboardStats() {
  const { demoMode, tenantId } = useApp();
  const [tenantStats, setTenantStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeSchools: 0,
    admissionsThisMonth: 0,
  });

  useEffect(() => {
    if (demoMode) return;
    const unsub = subscribeTenantStats(tenantId, setTenantStats);
    return unsub;
  }, [demoMode, tenantId]);

  if (demoMode) {
    return mockDashboardStats;
  }

  return {
    superAdmin: {
      totalOrganizations: 0,
      totalSchools: 0,
      totalStudents: 0,
      totalTeachers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      pendingRenewals: 0,
    },
    sansthanAdmin: {
      totalSchools: tenantStats.totalSchools,
      totalStudents: tenantStats.totalStudents,
      totalTeachers: tenantStats.totalTeachers,
      activeSchools: tenantStats.activeSchools,
      admissionsThisMonth: tenantStats.admissionsThisMonth,
    },
    schoolAdmin: {
      totalStudents: 0,
      totalTeachers: 0,
      monthlySalaryDue: 0,
      activeNotices: 0,
      admissions: 0,
    },
    teacher: {
      myClassesCount: 0,
      activeHomeworks: 0,
      pendingLeaveRequests: 0,
      upcomingEvents: 0,
    }
  };
}

// ─── District Wise ───

export function useDistrictWiseData() {
  return useDemoOrSnapshot<DistrictWiseItem[]>(mockDistrictWise, (_cb) => {
    return undefined;
  });
}

// ─── Recent Activities ───

export function useRecentActivities() {
  const { demoMode } = useApp();
  return demoMode ? mockRecentActivities : [];
}

// ─── Organizations ───

export function useOrganizations() {
  return useDemoOrSnapshot<Organization[]>(mockOrganizations, (cb) =>
    subscribeOrganizations(cb)
  );
}

// ─── Monthly Reports ───

export function useMonthlyReports() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<MonthlyReportEntry[]>(mockMonthlyReports, (cb) =>
    subscribeMonthlyReports(tenantId, cb, activeSchoolId)
  );
}

export function useSchoolName(): string {
  const { demoMode, userProfile } = useApp();
  const schools = useSchools();
  return useMemo(() => {
    if (!demoMode && userProfile?.schoolId) {
      const sch = schools.find(s => String(s.id) === String(userProfile.schoolId));
      if (sch) return sch.name;
    }
    return t("schoolExample");
  }, [demoMode, userProfile, schools]);
}

export function useExams() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<any[]>([], (cb) =>
    subscribeExams(tenantId, cb, activeSchoolId)
  );
}

export function useMarksRecords(filters?: { schoolId?: string | number; examId?: string; className?: string; studentId?: string }) {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : filters?.schoolId;
  return useDemoOrSnapshot<any[]>([], (cb) =>
    subscribeMarks(tenantId, cb, activeSchoolId, filters?.examId, filters?.className, filters?.studentId)
  );
}

export function useClasses() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<any[]>([], (cb) =>
    subscribeClasses(tenantId, cb, activeSchoolId)
  );
}

export function useFeeRecords() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<any[]>([], (cb) =>
    subscribeFeeRecords(tenantId, cb, activeSchoolId)
  );
}

export function useSalaryRecords() {
  const { tenantId, role, userProfile } = useApp();
  const activeSchoolId = (role === "school-admin" || role === "teacher") ? userProfile?.schoolId : undefined;
  return useDemoOrSnapshot<any[]>([], (cb) =>
    subscribeSalaryRecords(tenantId, cb, activeSchoolId)
  );
}
