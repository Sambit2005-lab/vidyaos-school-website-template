import { db } from "./firebase";
import {
  collection as firestoreCollection,
  collectionGroup as firestoreCollectionGroup,
  doc as firestoreDoc,
  getDoc as firestoreGetDoc,
  getDocs as firestoreGetDocs,
  addDoc as firestoreAddDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  query as firestoreQuery,
  where,
  orderBy,
  onSnapshot as firestoreOnSnapshot,
  type Unsubscribe,
  setDoc as firestoreSetDoc,
  Timestamp,
  serverTimestamp,
  type Query
} from "firebase/firestore";
import type {
  Organization, School, Student, Teacher, Salary, AdmissionLead,
  AdmissionFormData, Notice, Circular, DashboardStats, SchoolGrowthItem,
  RevenueItem, Activity, DistrictWiseItem, StateWiseItem, LeaveRequest,
  TeacherClass, Homework, TeacherMonthlyReport, TeacherAssignment,
  MonthlyReportEntry,
} from "./data";

// Safe wrapper functions to prevent client-side crashes if db is not initialized
const collection = (database: any, path: string, ...pathSegments: string[]) => {
  if (!database) return null as any;
  return firestoreCollection(database, path, ...pathSegments);
};

const collectionGroup = (database: any, collectionId: string) => {
  if (!database) return null as any;
  return firestoreCollectionGroup(database, collectionId);
};

const doc = (database: any, path: string, ...pathSegments: string[]) => {
  if (!database) return null as any;
  return firestoreDoc(database, path, ...pathSegments);
};

const onSnapshot = (q: any, onNext: any, onError?: any) => {
  if (!q) return (() => {}) as any;
  return firestoreOnSnapshot(q, onNext, onError);
};

const query = (base: any, ...queryConstraints: any[]) => {
  if (!base) return null as any;
  return firestoreQuery(base, ...queryConstraints);
};

const getDocs = async (q: any) => {
  if (!q) return { docs: [] } as any;
  return firestoreGetDocs(q);
};

const getDoc = async (ref: any) => {
  if (!ref) return { exists: () => false, data: () => null } as any;
  return firestoreGetDoc(ref);
};

const addDoc = async (ref: any, data: any) => {
  if (!ref) return null as any;
  return firestoreAddDoc(ref, data);
};

const updateDoc = async (ref: any, data: any) => {
  if (!ref) return null as any;
  return firestoreUpdateDoc(ref, data);
};

const deleteDoc = async (ref: any) => {
  if (!ref) return null as any;
  return firestoreDeleteDoc(ref);
};

const setDoc = async (ref: any, data: any, options?: any) => {
  if (!ref) return null as any;
  return firestoreSetDoc(ref, data, options);
};

export { onSnapshot, query, where, orderBy, collection, doc };
export type { Unsubscribe };

// Safe ID parser for Firestore documents (handles string and numeric IDs)
const parseId = (idStr: string): any => {
  const num = Number(idStr);
  return isNaN(num) ? idStr : num;
};

// ─── Generic helpers ───

function tenantPath(tenantId: string) {
  return `tenants/${tenantId}`;
}

// ─── Schools ───

export function getSchoolsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "schools");
}

export async function fetchSchools(tenantId: string): Promise<School[]> {
  const snap = await getDocs(getSchoolsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as School));
}

export function subscribeSchools(tenantId: string, cb: (schools: School[]) => void, schoolId?: string | number): Unsubscribe {
  const base = tenantId === "all" ? collectionGroup(db, "schools") : getSchoolsRef(tenantId);
  const q = schoolId ? query(base, where("id", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => {
      const data = d.data();
      const parentTenantId = d.ref.parent.parent?.id || tenantId;
      return { id: parseId(d.id), tenantId: parentTenantId, ...data } as any;
    }));
  }, error => {
    console.error("subscribeSchools error:", error);
    cb([]);
  });
}

export async function addSchool(tenantId: string, data: Omit<School, "id">) {
  return addDoc(getSchoolsRef(tenantId), data);
}

export async function updateSchool(tenantId: string, schoolId: string, data: Partial<School>) {
  return updateDoc(doc(db, tenantPath(tenantId), "schools", schoolId), data);
}

// ─── Students ───

export function getStudentsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "students");
}

export async function fetchStudents(tenantId: string): Promise<Student[]> {
  const snap = await getDocs(getStudentsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Student));
}

export function subscribeStudents(tenantId: string, cb: (students: Student[]) => void, schoolId?: string | number): Unsubscribe {
  const base = tenantId === "all" ? collectionGroup(db, "students") : getStudentsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Student)));
  }, error => {
    console.error("subscribeStudents error:", error);
    cb([]);
  });
}

export async function addStudent(tenantId: string, data: any) {
  const studentId = data.id || "std_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "students", studentId), { ...data, id: studentId });
}

export async function updateStudent(tenantId: string, studentId: string, data: Partial<any>) {
  return updateDoc(doc(db, tenantPath(tenantId), "students", studentId), data);
}

// ─── Teachers ───

export function getTeachersRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "teachers");
}

export async function fetchTeachers(tenantId: string): Promise<Teacher[]> {
  const snap = await getDocs(getTeachersRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Teacher));
}

export async function addTeacher(tenantId: string, data: Omit<Teacher, "id"> & { id?: string }) {
  if (data.id) {
    const docId = data.id;
    const { id, ...rest } = data;
    return setDoc(doc(db, tenantPath(tenantId), "teachers", docId), rest);
  }
  return addDoc(getTeachersRef(tenantId), data);
}

export function subscribeTeachers(tenantId: string, cb: (teachers: Teacher[]) => void, schoolId?: string | number): Unsubscribe {
  const base = tenantId === "all" ? collectionGroup(db, "teachers") : getTeachersRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Teacher)));
  }, error => {
    console.error("subscribeTeachers error:", error);
    cb([]);
  });
}

// ─── Notices ───

export function getNoticesRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "notices");
}

export async function fetchNotices(tenantId: string, audience?: string): Promise<Notice[]> {
  const ref = getNoticesRef(tenantId);
  const q = audience ? query(ref, where("audience", "==", audience)) : ref;
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Notice));
}

export function subscribeNotices(tenantId: string, audience?: string, cb?: (notices: Notice[]) => void, schoolId?: string | number): Unsubscribe {
  const ref = getNoticesRef(tenantId);
  let q: Query = ref;
  if (audience && schoolId) {
    q = query(ref, where("audience", "==", audience), where("schoolId", "in", [Number(schoolId), String(schoolId)]));
  } else if (audience) {
    q = query(ref, where("audience", "==", audience));
  } else if (schoolId) {
    q = query(ref, where("schoolId", "in", [Number(schoolId), String(schoolId)]));
  }
  return onSnapshot(q, snap => {
    if (cb) cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Notice)));
  }, error => {
    console.error("subscribeNotices error:", error);
    if (cb) cb([]);
  });
}

export async function addNotice(tenantId: string, data: { title: { en: string; or: string }; content: { en: string; or: string }; date: string; audience: string }) {
  return addDoc(getNoticesRef(tenantId), data);
}

// ─── Circulars ───

export function getCircularsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "circulars");
}

export async function fetchCirculars(tenantId: string): Promise<Circular[]> {
  const snap = await getDocs(getCircularsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Circular));
}

export function subscribeCirculars(tenantId: string, cb: (circulars: Circular[]) => void): Unsubscribe {
  return onSnapshot(getCircularsRef(tenantId), snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Circular)));
  }, error => {
    console.error("subscribeCirculars error:", error);
    cb([]);
  });
}

export async function addCircular(tenantId: string, data: Omit<Circular, "id">) {
  return addDoc(getCircularsRef(tenantId), data);
}

// ─── Leave Requests ───

export function getLeaveRequestsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "leave-requests");
}

export async function fetchLeaveRequests(tenantId: string): Promise<LeaveRequest[]> {
  const q = query(getLeaveRequestsRef(tenantId), orderBy("appliedOn", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as LeaveRequest));
}

export function subscribeLeaveRequests(tenantId: string, cb: (requests: LeaveRequest[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getLeaveRequestsRef(tenantId);
  const q = schoolId 
    ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)]), orderBy("appliedOn", "desc"))
    : query(base, orderBy("appliedOn", "desc"));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as LeaveRequest)));
  }, error => {
    console.error("subscribeLeaveRequests error:", error);
    cb([]);
  });
}

export async function addLeaveRequest(tenantId: string, data: Omit<LeaveRequest, "id">) {
  return addDoc(getLeaveRequestsRef(tenantId), data);
}

export async function updateLeaveRequestStatus(tenantId: string, requestId: string, status: "approved" | "rejected") {
  return updateDoc(doc(db, tenantPath(tenantId), "leave-requests", requestId), { status });
}

// ─── Admissions / Leads ───

export function getAdmissionsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "admissions");
}

export async function fetchAdmissions(tenantId: string): Promise<AdmissionLead[]> {
  const snap = await getDocs(getAdmissionsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as AdmissionLead));
}

export function subscribeAdmissions(tenantId: string, cb: (admissions: AdmissionFormData[]) => void, schoolId?: string | number): Unsubscribe {
  const base = tenantId === "all" ? collectionGroup(db, "admissions") : getAdmissionsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as unknown as AdmissionFormData)));
  }, error => {
    console.error("subscribeAdmissions error:", error);
    cb([]);
  });
}

export async function addAdmission(tenantId: string, data: Omit<AdmissionFormData, "id">) {
  return addDoc(getAdmissionsRef(tenantId), data);
}

export async function updateAdmissionStatus(tenantId: string, admissionId: string, status: string) {
  return updateDoc(doc(db, tenantPath(tenantId), "admissions", admissionId), { status });
}

// ─── Salary ───

export function getSalariesRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "salaries");
}

export async function fetchSalaries(tenantId: string): Promise<Salary[]> {
  const snap = await getDocs(getSalariesRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Salary));
}

export async function addSalary(tenantId: string, data: Omit<Salary, "id"> & { id?: string }) {
  if (data.id) {
    const docId = data.id;
    const { id, ...rest } = data;
    return setDoc(doc(db, tenantPath(tenantId), "salaries", docId), rest);
  }
  return addDoc(getSalariesRef(tenantId), data);
}

export async function updateSalaryStatus(tenantId: string, salaryId: string, status: string, additionalData?: any) {
  return updateDoc(doc(db, tenantPath(tenantId), "salaries", salaryId), { status, ...additionalData });
}

export function subscribeSalaries(tenantId: string, cb: (salaries: Salary[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getSalariesRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Salary)));
  }, error => {
    console.error("subscribeSalaries error:", error);
    cb([]);
  });
}

export async function updateSalary(tenantId: string, salaryId: string, data: Partial<Salary>) {
  return updateDoc(doc(db, tenantPath(tenantId), "salaries", salaryId), data);
}

// ─── Teacher Classes (teacher document subcollection or root) ───

export function getTeacherClassesRef(tenantId: string, teacherId: string) {
  return collection(db, tenantPath(tenantId), "teachers", teacherId, "classes");
}

export async function fetchTeacherClasses(tenantId: string, teacherId: string): Promise<TeacherClass[]> {
  const snap = await getDocs(getTeacherClassesRef(tenantId, teacherId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as TeacherClass));
}

export function subscribeTeacherClasses(tenantId: string, teacherId: string, cb: (classes: TeacherClass[]) => void): Unsubscribe {
  return onSnapshot(getTeacherClassesRef(tenantId, teacherId), snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as TeacherClass)));
  }, error => {
    console.error("subscribeTeacherClasses error:", error);
    cb([]);
  });
}

// ─── Homework ───

export function getHomeworkRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "homework");
}

export async function fetchHomework(tenantId: string): Promise<Homework[]> {
  const snap = await getDocs(getHomeworkRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Homework));
}

export function subscribeHomework(tenantId: string, cb: (homework: Homework[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getHomeworkRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as Homework)));
  }, error => {
    console.error("subscribeHomework error:", error);
    cb([]);
  });
}

export async function addHomework(tenantId: string, data: Omit<Homework, "id">) {
  return addDoc(getHomeworkRef(tenantId), data);
}

// ─── Teacher Monthly Reports ───

export function getTeacherReportsRef(tenantId: string, teacherId: string) {
  return collection(db, tenantPath(tenantId), "teachers", teacherId, "reports");
}

export async function fetchTeacherReports(tenantId: string, teacherId: string): Promise<TeacherMonthlyReport[]> {
  const snap = await getDocs(getTeacherReportsRef(tenantId, teacherId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as TeacherMonthlyReport));
}

// ─── Teacher Assignments ───

export function getTeacherAssignmentsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "teacher-assignments");
}

export async function fetchTeacherAssignments(tenantId: string): Promise<TeacherAssignment[]> {
  const snap = await getDocs(getTeacherAssignmentsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as TeacherAssignment));
}

export async function addTeacherAssignment(tenantId: string, data: Omit<TeacherAssignment, "id">) {
  return addDoc(getTeacherAssignmentsRef(tenantId), data);
}

export async function deleteTeacherAssignment(tenantId: string, id: string) {
  return deleteDoc(doc(db, tenantPath(tenantId), "teacher-assignments", id));
}

export async function updateTeacherAssignment(tenantId: string, id: string, data: Partial<TeacherAssignment>) {
  return updateDoc(doc(db, tenantPath(tenantId), "teacher-assignments", id), data);
}

export function subscribeTeacherAssignments(tenantId: string, cb: (assignments: TeacherAssignment[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getTeacherAssignmentsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as TeacherAssignment)));
  }, error => {
    console.error("subscribeTeacherAssignments error:", error);
    cb([]);
  });
}

// ─── School Website Config ───

export function getSchoolDocRef(tenantId: string, schoolId: string) {
  return doc(db, tenantPath(tenantId), "schools", schoolId);
}

export async function fetchSchoolConfig(tenantId: string, schoolId: string) {
  const snap = await getDoc(getSchoolDocRef(tenantId, schoolId));
  return snap.exists() ? snap.data() : null;
}

export async function updateSchoolConfig(tenantId: string, schoolId: string, data: Record<string, unknown>) {
  return setDoc(getSchoolDocRef(tenantId, schoolId), data, { merge: true });
}

export async function syncSchoolFeesToClasses(tenantId: string, schoolId: string, feeStructure: any[]) {
  if (!feeStructure || !Array.isArray(feeStructure)) return;
  const classesRef = collection(db, tenantPath(tenantId), "classes");
  const q = query(classesRef, where("schoolId", "in", [Number(schoolId), String(schoolId)]));
  const snap = await getDocs(q);
  for (const classDoc of snap.docs) {
    const classData = classDoc.data();
    const className = classData.name;
    const match = feeStructure.find((f: any) => f.class === className);
    if (match) {
      const currentFees = classData.feeStructure || {};
      await updateDoc(classDoc.ref, {
        feeStructure: {
          ...currentFees,
          tuitionFee: Number(match.tuitionFee || 0),
          transportFee: Number(match.transportFee || 0)
        }
      });
    }
  }
}

export async function syncClassFeeToSchoolConfig(tenantId: string, schoolId: string, className: string, tuitionFee: number, transportFee: number) {
  const schoolRef = getSchoolDocRef(tenantId, schoolId);
  const snap = await getDoc(schoolRef);
  if (snap.exists()) {
    const schoolData = snap.data();
    let feeStructure = schoolData.feeStructure || [];
    if (!Array.isArray(feeStructure)) feeStructure = [];
    
    const idx = feeStructure.findIndex((f: any) => f.class === className);
    if (idx >= 0) {
      feeStructure[idx] = {
        ...feeStructure[idx],
        tuitionFee: Number(tuitionFee),
        transportFee: Number(transportFee)
      };
    } else {
      feeStructure.push({
        class: className,
        admissionFee: 2000,
        tuitionFee: Number(tuitionFee),
        transportFee: Number(transportFee),
        examFee: 500
      });
    }
    await updateDoc(schoolRef, { feeStructure });
  }
}

// ─── Tenant Info ───

export async function fetchTenant(tenantId: string) {
  const snap = await getDoc(doc(db, "tenants", tenantId));
  return snap.exists() ? snap.data() : null;
}

// ─── Create user profile after signup ───

export async function createUserProfile(uid: string, data: {
  name: string;
  email: string;
  tenantId: string;
  tenantRole: "sansthan-admin" | "school-admin" | "teacher";
  schoolId?: string;
}) {
  return setDoc(doc(db, "users", uid), {
    ...data,
    globalRole: null,
    createdAt: serverTimestamp(),
  });
}

// ─── Monthly Reports ───

export function getMonthlyReportsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "monthly-reports");
}

export async function fetchMonthlyReports(tenantId: string): Promise<MonthlyReportEntry[]> {
  const snap = await getDocs(getMonthlyReportsRef(tenantId));
  return snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as unknown as MonthlyReportEntry));
}

export function subscribeMonthlyReports(tenantId: string, cb: (reports: MonthlyReportEntry[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getMonthlyReportsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as unknown as MonthlyReportEntry)));
  }, error => {
    console.error("subscribeMonthlyReports error:", error);
    cb([]);
  });
}

export async function addMonthlyReport(tenantId: string, data: Omit<MonthlyReportEntry, "id">) {
  return addDoc(getMonthlyReportsRef(tenantId), data);
}

export async function updateMonthlyReportStatus(tenantId: string, reportId: string, status: string) {
  return updateDoc(doc(db, tenantPath(tenantId), "monthly-reports", reportId), { status });
}

export function subscribeOrganizations(cb: (orgs: Organization[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "tenants"), snap => {
    cb(snap.docs.map(d => {
      const data = d.data();
      return {
        id: parseId(d.id),
        name: data.name || "",
        state: data.state || "",
        schools: data.schoolsCount || 0,
        students: data.studentsCount || 0,
        status: data.status || "Active",
        district: data.district || "",
      } as unknown as Organization;
    }));
  }, error => {
    console.error("subscribeOrganizations error:", error);
    cb([]);
  });
}

export function subscribeTenantStats(tenantId: string, cb: (stats: any) => void): Unsubscribe {
  return onSnapshot(doc(db, "tenants", tenantId), snap => {
    if (snap.exists()) {
      const data = snap.data();
      cb({
        totalSchools: data.schoolsCount || 0,
        totalStudents: data.studentsCount || 0,
        totalTeachers: data.teachersCount || 0,
        activeSchools: data.activeSchoolsCount || 0,
        admissionsThisMonth: data.admissionsThisMonth || 0,
      });
    } else {
      cb({
        totalSchools: 0,
        totalStudents: 0,
        totalTeachers: 0,
        activeSchools: 0,
        admissionsThisMonth: 0,
      });
    }
  }, error => {
    console.error("subscribeTenantStats error:", error);
    cb({
      totalSchools: 0,
      totalStudents: 0,
      totalTeachers: 0,
      activeSchools: 0,
      admissionsThisMonth: 0,
    });
  });
}

// ─── Exams ───

export function getExamsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "exams");
}

export function subscribeExams(tenantId: string, cb: (exams: any[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getExamsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeExams error:", error);
    cb([]);
  });
}

export async function addExam(tenantId: string, data: any) {
  const examId = data.id || "exam_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "exams", examId), { ...data, id: examId });
}

export async function updateExam(tenantId: string, examId: string, data: Partial<any>) {
  return updateDoc(doc(db, tenantPath(tenantId), "exams", examId), data);
}

// ─── Marks ───

export function getMarksRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "marks");
}

export function subscribeMarks(
  tenantId: string, 
  cb: (marks: any[]) => void, 
  schoolId?: string | number,
  examId?: string,
  className?: string,
  studentId?: string
): Unsubscribe {
  const base = getMarksRef(tenantId);
  const constraints = [];
  if (schoolId) {
    constraints.push(where("schoolId", "in", [Number(schoolId), String(schoolId)]));
  }
  if (examId) {
    constraints.push(where("examId", "==", examId));
  }
  if (className) {
    constraints.push(where("className", "==", className));
  }
  if (studentId) {
    constraints.push(where("studentId", "==", String(studentId)));
  }

  const q = constraints.length > 0 ? query(base, ...constraints) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeMarks error:", error);
    cb([]);
  });
}

export async function saveMarksRecord(tenantId: string, data: any) {
  const recordId = data.id || `mark_${data.examId}_${data.studentId}`;
  return setDoc(doc(db, tenantPath(tenantId), "marks", recordId), { ...data, id: recordId });
}

// ─── Classes & Subjects ───

export function getClassesRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "classes");
}

export function subscribeClasses(tenantId: string, cb: (classes: any[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getClassesRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeClasses error:", error);
    cb([]);
  });
}

export async function saveClassRecord(tenantId: string, data: any) {
  const classId = data.id || "class_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "classes", classId), { ...data, id: classId });
}

export async function deleteClassRecord(tenantId: string, classId: string) {
  return deleteDoc(doc(db, tenantPath(tenantId), "classes", classId));
}

// ─── Fee Records ───

export function getFeeRecordsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "fee_records");
}

export function subscribeFeeRecords(tenantId: string, cb: (fees: any[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getFeeRecordsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeFeeRecords error:", error);
    cb([]);
  });
}

export async function saveFeeRecord(tenantId: string, data: any) {
  const recordId = data.id || "fee_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "fee_records", recordId), { ...data, id: recordId });
}

// ─── Fee Payments Receipt Submissions ───

export function getFeePaymentsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "fee_payments");
}

export function subscribeFeePayments(tenantId: string, cb: (payments: any[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getFeePaymentsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeFeePayments error:", error);
    cb([]);
  });
}

export async function saveFeePayment(tenantId: string, data: any) {
  const paymentId = data.id || "fp_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "fee_payments", paymentId), { ...data, id: paymentId });
}

export async function deleteFeePayment(tenantId: string, paymentId: string) {
  return deleteDoc(doc(db, tenantPath(tenantId), "fee_payments", paymentId));
}

// ─── Salary Records ───

export function getSalaryRecordsRef(tenantId: string) {
  return collection(db, tenantPath(tenantId), "salary_records");
}

export function subscribeSalaryRecords(tenantId: string, cb: (salaries: any[]) => void, schoolId?: string | number): Unsubscribe {
  const base = getSalaryRecordsRef(tenantId);
  const q = schoolId ? query(base, where("schoolId", "in", [Number(schoolId), String(schoolId)])) : base;
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: parseId(d.id), ...d.data() } as any)));
  }, error => {
    console.error("subscribeSalaryRecords error:", error);
    cb([]);
  });
}

export async function saveSalaryRecord(tenantId: string, data: any) {
  const recordId = data.id || "salary_" + Date.now();
  return setDoc(doc(db, tenantPath(tenantId), "salary_records", recordId), { ...data, id: recordId });
}
