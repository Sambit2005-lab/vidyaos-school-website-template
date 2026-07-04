export interface DashboardStats {
  [key: string]: number | undefined;
}

export interface SchoolGrowthItem {
  year: string;
  schools: number;
  students: number;
  teachers: number;
}

export interface RevenueItem {
  month: string;
  revenue: number;
  subscriptions: number;
}

export interface Organization {
  id: number;
  name: string;
  schools: number;
  students: number;
  status: string;
  district: string;
  state: string;
}

export interface School {
  id: number;
  name: string;
  principal: string;
  students: number;
  teachers: number;
  status: string;
  district: string;
  state: string;
  subscriptionOption?: string;
  subscriptionStatus?: string;
  subscriptionAdvancePaid?: boolean;
  subscriptionInstallmentsPaid?: number;
  subscriptionBalancePaid?: boolean;
  subscriptionPendingUtr?: string | null;
  subscriptionPendingUtrAmount?: number | null;
  subscriptionPendingUtrDate?: string | null;
  subscriptionPendingUtrDescription?: string | null;
  subscriptionPendingUtrScreenshot?: string | null;
  subscriptionPendingLogId?: string | null;
  subscriptionPaymentLogs?: any[];
}

export interface Student {
  id: number;
  name: string;
  class: string;
  parent: string;
  phone: string;
  status: string;
  schoolId?: string | number;
}

export interface StudentResult {
  academicYear: string;
  percentage: number;
  rank: number;
  status: string;
}

export interface StudentSubjectScore {
  subject: string;
  marks: number;
  grade: string;
}

export interface StudentFeePayment {
  month: string;
  amount: number;
  status: string;
}

export interface StudentAchievement {
  title: string;
}

export interface StudentDiscipline {
  type: string;
  date: string;
  remarks: string;
}

export interface StudentDocument {
  name: string;
  status: string;
}

export interface StudentTeacherRemark {
  teacherName: string;
  remark: string;
  date: string;
}

export interface StudentTimelineItem {
  date: string;
  event: string;
}

export interface StudentProfile {
  id: number;
  name: string;
  class: string;
  section: string;
  parent: string;
  phone: string;
  status: string;
  admissionNo: string;
  rollNo: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  admissionDate: string;
  motherName: string;
  guardianName: string;
  altPhone: string;
  address: string;
  city: string;
  district: string;
  currentPercentage: number;
  currentRank: number;
  attendancePercent: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  subjectsPassed: number;
  subjectsWeak: number;
  annualFee: number;
  paidAmount: number;
  nextDueDate: string;
  medhabruti: string;
  olympiad: string;
  ntse: string;
  otherScholarship: string;
  results: StudentResult[];
  subjects: StudentSubjectScore[];
  feeHistory: StudentFeePayment[];
  achievements: StudentAchievement[];
  disciplineRecords: StudentDiscipline[];
  documents: StudentDocument[];
  teacherRemarks: StudentTeacherRemark[];
  timeline: StudentTimelineItem[];
  strongSubject: string;
  weakSubject: string;
  riskScore: "Excellent" | "Good" | "Needs Attention";
}

export interface Teacher {
  id: number | string;
  name: string;
  subject: string;
  qualification: string;
  salary: number;
  status: string;
  schoolId?: string;
  email?: string;
  staffType?: string;
  vehicleNo?: string;
  licenseNo?: string;
  mobile?: string;
  phone?: string;
  whatsapp?: string;
  joiningDate?: string;
  designation?: string;
}

export interface Salary {
  id: number | string;
  name: string;
  salary: number;
  month: string;
  status: string;
  teacherId?: string;
  schoolId?: string;
  paymentMode?: string;
  paidDate?: string;
  bonus?: number;
  deductions?: number;
  netSalary?: number;
  remarks?: string;
  utrNo?: string;
  transactionId?: string;
}

export interface AdmissionLead {
  id: number;
  name: string;
  parent: string;
  phone: string;
  class: string;
}

export interface AdmissionDocument {
  name: string;
  uploaded: boolean;
}

export interface AdmissionFormData {
  id: number;
  schoolId: number;
  studentName: string;
  admissionNo: string;
  classApplyingFor: string;
  section: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  aadhaarNo: string;
  religion: string;
  category: string;
  nationality: string;
  fatherName: string;
  fatherOccupation: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string;
  motherOccupation: string;
  motherMobile: string;
  guardianName: string;
  guardianMobile: string;
  village: string;
  postOffice: string;
  policeStation: string;
  district: string;
  state: string;
  pinCode: string;
  fullAddress: string;
  prevSchoolName: string;
  prevClass: string;
  prevBoard: string;
  prevSchoolAddress: string;
  tcNumber: string;
  reasonForTransfer: string;
  prevYearPercent: string;
  scholarshipQualified: string;
  olympiadQualified: string;
  specialAchievements: string;
  sportsAchievements: string;
  otherAchievements: string;
  admissionFee: number;
  monthlyFee: number;
  transportFee: number;
  annualFee: number;
  discountPercent: number;
  scholarshipAmount: number;
  feeCategory: string;
  medicalConditions: string;
  allergies: string;
  emergencyContact: string;
  documents: AdmissionDocument[];
  status: "New" | "Pending Verification" | "Approved" | "Rejected";
  submittedDate: string;
  rejectionReason: string;
}

export interface StateWiseItem {
  state: string;
  schools: number;
  students: number;
  revenue: number;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: string;
}

export interface Circular {
  id: number;
  title: string;
  date: string;
  status: string;
  file: string;
}

export interface Activity {
  id: number;
  action: string;
  actor: string;
  time: string;
}

export interface DistrictWiseItem {
  district: string;
  schools: number;
  students: number;
  teachers: number;
}

export interface RoleDashboardStats {
  superAdmin: DashboardStats;
  sansthanAdmin: DashboardStats;
  schoolAdmin: DashboardStats;
  teacher: DashboardStats;
}

export const dashboardStats: RoleDashboardStats = {
  superAdmin: {
    totalOrganizations: 24,
    totalSchools: 1200,
    totalStudents: 482450,
    totalTeachers: 22380,
    activeSubscriptions: 1080,
    monthlyRevenue: 18600000,
    pendingRenewals: 120,
  },
  sansthanAdmin: {
    totalSchools: 1200,
    totalStudents: 482450,
    totalTeachers: 22380,
    activeSchools: 1150,
    admissionsThisMonth: 8450,
  },
  schoolAdmin: {
    totalStudents: 1248,
    totalTeachers: 52,
    monthlySalaryDue: 1875000,
    activeNotices: 5,
    admissions: 38,
  },
  teacher: {
    myStudents: 42,
    recentNotices: 3,
    schoolUpdates: 7,
  },
};

export const schoolGrowthData: SchoolGrowthItem[] = [
  { year: "2019", schools: 450, students: 180000, teachers: 8500 },
  { year: "2020", schools: 620, students: 248000, teachers: 11500 },
  { year: "2021", schools: 780, students: 312000, teachers: 14500 },
  { year: "2022", schools: 920, students: 368000, teachers: 17200 },
  { year: "2023", schools: 1050, students: 420000, teachers: 19800 },
  { year: "2024", schools: 1150, students: 460000, teachers: 21200 },
  { year: "2025", schools: 1200, students: 482450, teachers: 22380 },
];

export const revenueData: RevenueItem[] = [
  { month: "Jan", revenue: 14200000, subscriptions: 980 },
  { month: "Feb", revenue: 15300000, subscriptions: 1020 },
  { month: "Mar", revenue: 16500000, subscriptions: 1050 },
  { month: "Apr", revenue: 17200000, subscriptions: 1070 },
  { month: "May", revenue: 18000000, subscriptions: 1080 },
  { month: "Jun", revenue: 18600000, subscriptions: 1080 },
];

export const organizations: Organization[] = [
  { id: 1, name: "Bharatiya Siksha Vikash Sansthan", schools: 1200, students: 482450, status: "Active", district: "All India", state: "National" },
  { id: 2, name: "Odisha Shiksha Samiti", schools: 340, students: 136000, status: "Active", district: "Multi-District", state: "Odisha" },
  { id: 3, name: "Madhya Pradesh Shiksha Mandal", schools: 280, students: 112000, status: "Active", district: "Multi-District", state: "Madhya Pradesh" },
  { id: 4, name: "Uttar Pradesh Shiksha Parishad", schools: 420, students: 168000, status: "Active", district: "Multi-District", state: "Uttar Pradesh" },
  { id: 5, name: "Rajasthan Shiksha Vikas", schools: 195, students: 78000, status: "Active", district: "Multi-District", state: "Rajasthan" },
  { id: 6, name: "Bihar Shiksha Vikas Sansthan", schools: 310, students: 124000, status: "Active", district: "Multi-District", state: "Bihar" },
  { id: 7, name: "West Bengal Shiksha Kendra", schools: 165, students: 66000, status: "Inactive", district: "Multi-District", state: "West Bengal" },
  { id: 8, name: "Assam Shiksha Niketan", schools: 95, students: 38000, status: "Active", district: "Multi-District", state: "Assam" },
];

export const schools: School[] = [
  { 
    id: 1, 
    name: "Saraswati Sishu Mandir Bhubaneswar", 
    principal: "Dr. Rajendra Mohapatra", 
    students: 1248, 
    teachers: 52, 
    status: "Active", 
    district: "Khordha", 
    state: "Odisha",
    subscriptionOption: "option1",
    subscriptionStatus: "Setup Mode",
    subscriptionAdvancePaid: true,
    subscriptionBalancePaid: false,
    subscriptionInstallmentsPaid: 0,
    subscriptionPaymentLogs: [
      {
        id: "pay_log_1",
        date: "10 May 2026",
        description: "Advance Payment (30%)",
        amount: 4500,
        utr: "123456789012",
        screenshotUrl: "",
        status: "Approved",
        remarks: "Approved by Super Admin"
      }
    ]
  },
  { 
    id: 2, 
    name: "Saraswati Sishu Mandir Cuttack", 
    principal: "Sri. Pramod Kumar Das", 
    students: 980, 
    teachers: 41, 
    status: "Active", 
    district: "Cuttack", 
    state: "Odisha",
    subscriptionOption: "option2",
    subscriptionStatus: "Active",
    subscriptionAdvancePaid: true,
    subscriptionBalancePaid: false,
    subscriptionInstallmentsPaid: 4,
    subscriptionPaymentLogs: [
      { id: "pay_log_2_0", date: "12 Jan 2026", description: "Advance Activation Fee", amount: 3000, utr: "223456789012", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_2_1", date: "15 Feb 2026", description: "Installment #1", amount: 1000, utr: "223456789013", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_2_2", date: "15 Mar 2026", description: "Installment #2", amount: 1000, utr: "223456789014", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_2_3", date: "15 Apr 2026", description: "Installment #3", amount: 1000, utr: "223456789015", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_2_4", date: "15 May 2026", description: "Installment #4", amount: 1000, utr: "223456789016", screenshotUrl: "", status: "Approved" }
    ]
  },
  { 
    id: 3, 
    name: "Saraswati Sishu Mandir Puri", 
    principal: "Smt. Laxmi Panda", 
    students: 720, 
    teachers: 32, 
    status: "Active", 
    district: "Puri", 
    state: "Odisha",
    subscriptionOption: "option1",
    subscriptionStatus: "Pending",
    subscriptionAdvancePaid: false,
    subscriptionBalancePaid: false,
    subscriptionInstallmentsPaid: 0,
    subscriptionPaymentLogs: []
  },
  { 
    id: 4, 
    name: "Saraswati Sishu Mandir Rourkela", 
    principal: "Sri. Manoj Sahoo", 
    students: 850, 
    teachers: 36, 
    status: "Active", 
    district: "Sundargarh", 
    state: "Odisha",
    subscriptionOption: "option2",
    subscriptionStatus: "Completed",
    subscriptionAdvancePaid: true,
    subscriptionBalancePaid: false,
    subscriptionInstallmentsPaid: 12,
    subscriptionPaymentLogs: [
      { id: "pay_log_4_0", date: "05 Jun 2025", description: "Advance Activation Fee", amount: 3000, utr: "423456789012", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_1", date: "05 Jul 2025", description: "Installment #1", amount: 1000, utr: "423456789013", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_2", date: "05 Aug 2025", description: "Installment #2", amount: 1000, utr: "423456789014", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_3", date: "05 Sep 2025", description: "Installment #3", amount: 1000, utr: "423456789015", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_4", date: "05 Oct 2025", description: "Installment #4", amount: 1000, utr: "423456789016", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_5", date: "05 Nov 2025", description: "Installment #5", amount: 1000, utr: "423456789017", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_6", date: "05 Dec 2025", description: "Installment #6", amount: 1000, utr: "423456789018", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_7", date: "05 Jan 2026", description: "Installment #7", amount: 1000, utr: "423456789019", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_8", date: "05 Feb 2026", description: "Installment #8", amount: 1000, utr: "423456789020", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_9", date: "05 Mar 2026", description: "Installment #9", amount: 1000, utr: "423456789021", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_10", date: "05 Apr 2026", description: "Installment #10", amount: 1000, utr: "423456789022", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_11", date: "05 May 2026", description: "Installment #11", amount: 1000, utr: "423456789023", screenshotUrl: "", status: "Approved" },
      { id: "pay_log_4_12", date: "05 Jun 2026", description: "Installment #12", amount: 1000, utr: "423456789024", screenshotUrl: "", status: "Approved" }
    ]
  },
  { id: 5, name: "Saraswati Sishu Mandir Sambalpur", principal: "Dr. Anil Kumar Behera", students: 660, teachers: 28, status: "Active", district: "Sambalpur", state: "Odisha" },
  { id: 6, name: "Saraswati Sishu Mandir Balasore", principal: "Sri. Basant Rout", students: 590, teachers: 24, status: "Active", district: "Balasore", state: "Odisha" },
  { id: 7, name: "Saraswati Sishu Vidya Mandir Berhampur", principal: "Smt. Sukanti Nayak", students: 780, teachers: 34, status: "Active", district: "Ganjam", state: "Odisha" },
  { id: 8, name: "Saraswati Shishu Mandir Jajpur", principal: "Sri. Bhaskar Mohanty", students: 430, teachers: 19, status: "Inactive", district: "Jajpur", state: "Odisha" },
  { id: 9, name: "Saraswati Vidya Mandir Bhadrak", principal: "Dr. Saroj Sahoo", students: 510, teachers: 22, status: "Active", district: "Bhadrak", state: "Odisha" },
  { id: 10, name: "Saraswati Sishu Mandir Kendujhar", principal: "Sri. Nihar Rout", students: 380, teachers: 16, status: "Active", district: "Kendujhar", state: "Odisha" },
];

export const studentsData: Student[] = [
  { id: 1, name: "Aarav Mohapatra", class: "10th", parent: "Rajendra Mohapatra", phone: "+91-9876543210", status: "Active" },
  { id: 2, name: "Ananya Das", class: "9th", parent: "Pramod Das", phone: "+91-9876543211", status: "Active" },
  { id: 3, name: "Bibhuti Panda", class: "8th", parent: "Laxmi Panda", phone: "+91-9876543212", status: "Active" },
  { id: 4, name: "Chinmaya Sahoo", class: "10th", parent: "Manoj Sahoo", phone: "+91-9876543213", status: "Inactive" },
  { id: 5, name: "Dibyanshu Behera", class: "7th", parent: "Anil Behera", phone: "+91-9876543214", status: "Active" },
  { id: 6, name: "Eesha Rout", class: "9th", parent: "Basant Rout", phone: "+91-9876543215", status: "Active" },
  { id: 7, name: "Fagun Nayak", class: "6th", parent: "Sukanti Nayak", phone: "+91-9876543216", status: "Active" },
  { id: 8, name: "Gargi Mohanty", class: "8th", parent: "Bhaskar Mohanty", phone: "+91-9876543217", status: "Active" },
  { id: 9, name: "Harsh Sahoo", class: "5th", parent: "Saroj Sahoo", phone: "+91-9876543218", status: "Inactive" },
  { id: 10, name: "Ishan Rout", class: "10th", parent: "Nihar Rout", phone: "+91-9876543219", status: "Active" },
  { id: 11, name: "Jyoti Ranjan Patnaik", class: "9th", parent: "Suresh Patnaik", phone: "+91-9876543220", status: "Active" },
  { id: 12, name: "Kamini Sahu", class: "7th", parent: "Ramesh Sahu", phone: "+91-9876543221", status: "Active" },
  { id: 13, name: "Lipika Mishra", class: "8th", parent: "Gyan Mishra", phone: "+91-9876543222", status: "Active" },
  { id: 14, name: "Manaswini Swain", class: "6th", parent: "Pratap Swain", phone: "+91-9876543223", status: "Inactive" },
  { id: 15, name: "Nabakishore Jena", class: "10th", parent: "Hari Jena", phone: "+91-9876543224", status: "Active" },
  { id: 16, name: "Rakesh Patra", class: "1st", parent: "Parent Name", phone: "+91-9876543225", status: "Active" },
];

export const studentsProfileData: StudentProfile[] = [
  {
    id: 1, name: "Aarav Mohapatra", class: "10", section: "A", parent: "Rajendra Mohapatra", phone: "+91-9876543210", status: "Active",
    admissionNo: "SSM-BBS-2021-001", rollNo: "101", gender: "Male", dob: "15-Aug-2009", bloodGroup: "O+", admissionDate: "01-Apr-2021",
    motherName: "Smt. Sweta Mohapatra", guardianName: "Rajendra Mohapatra", altPhone: "+91-9876543200",
    address: "Plot 42, Nayapalli", city: "Bhubaneswar", district: "Khordha",
    currentPercentage: 89, currentRank: 4, attendancePercent: 96, presentDays: 172, absentDays: 5, leaveDays: 3, subjectsPassed: 6, subjectsWeak: 1,
    annualFee: 18000, paidAmount: 15000, nextDueDate: "15-Jul-2026",
    medhabruti: "Qualified", olympiad: "Qualified", ntse: "Applied", otherScholarship: "Not Qualified",
    results: [
      { academicYear: "2024-25", percentage: 78, rank: 12, status: "Passed" },
      { academicYear: "2025-26", percentage: 84, rank: 8, status: "Passed" },
      { academicYear: "2026-27", percentage: 89, rank: 4, status: "Ongoing" },
    ],
    subjects: [
      { subject: "Mathematics", marks: 89, grade: "A" },
      { subject: "Science", marks: 92, grade: "A+" },
      { subject: "English", marks: 84, grade: "A" },
      { subject: "Odia", marks: 80, grade: "B+" },
      { subject: "Social Studies", marks: 86, grade: "A" },
      { subject: "Sanskrit", marks: 78, grade: "B" },
    ],
    feeHistory: [
      { month: "April 2026", amount: 1500, status: "Paid" },
      { month: "May 2026", amount: 1500, status: "Paid" },
      { month: "June 2026", amount: 1500, status: "Pending" },
    ],
    achievements: [{ title: "Science Fair Winner — District Level" }, { title: "Olympiad Rank 12 — State Level" }],
    disciplineRecords: [],
    documents: [
      { name: "Aadhar Card", status: "Uploaded" },
      { name: "Transfer Certificate", status: "Uploaded" },
      { name: "Birth Certificate", status: "Uploaded" },
      { name: "Last Marksheet", status: "Uploaded" },
      { name: "Passport Photo", status: "Uploaded" },
    ],
    teacherRemarks: [
      { teacherName: "Dr. Rajendra Mohapatra", remark: "Excellent in Mathematics. Should participate in Olympiad.", date: "15-May-2026" },
      { teacherName: "Smt. Laxmi Panda", remark: "Good performance in Science practicals.", date: "10-May-2026" },
    ],
    timeline: [
      { date: "01-Apr-2021", event: "Admission Completed" },
      { date: "15-May-2021", event: "First Term Exam — Rank 15" },
      { date: "10-Aug-2024", event: "Medhabruti Scholarship Qualified" },
      { date: "05-Nov-2025", event: "State Science Fair Winner" },
      { date: "20-Mar-2026", event: "Fee Paid for Apr-Jun 2026" },
    ],
    strongSubject: "Science", weakSubject: "Sanskrit", riskScore: "Excellent",
  },
  {
    id: 2, name: "Ananya Das", class: "9", section: "A", parent: "Pramod Das", phone: "+91-9876543211", status: "Active",
    admissionNo: "SSM-BBS-2022-002", rollNo: "201", gender: "Female", dob: "22-Nov-2010", bloodGroup: "A+", admissionDate: "01-Apr-2022",
    motherName: "Smt. Purnima Das", guardianName: "Pramod Das", altPhone: "+91-9876543201",
    address: "Lane 5, Unit 4", city: "Bhubaneswar", district: "Khordha",
    currentPercentage: 91, currentRank: 3, attendancePercent: 94, presentDays: 169, absentDays: 8, leaveDays: 3, subjectsPassed: 6, subjectsWeak: 0,
    annualFee: 16500, paidAmount: 16500, nextDueDate: "NA",
    medhabruti: "Qualified", olympiad: "Qualified", ntse: "Qualified", otherScholarship: "Not Qualified",
    results: [
      { academicYear: "2024-25", percentage: 85, rank: 6, status: "Passed" },
      { academicYear: "2025-26", percentage: 91, rank: 3, status: "Passed" },
    ],
    subjects: [
      { subject: "Mathematics", marks: 95, grade: "A+" },
      { subject: "Science", marks: 90, grade: "A" },
      { subject: "English", marks: 88, grade: "A" },
      { subject: "Odia", marks: 85, grade: "A" },
      { subject: "Social Studies", marks: 89, grade: "A" },
      { subject: "Hindi", marks: 92, grade: "A+" },
    ],
    feeHistory: [
      { month: "April 2026", amount: 1375, status: "Paid" },
      { month: "May 2026", amount: 1375, status: "Paid" },
      { month: "June 2026", amount: 1375, status: "Paid" },
    ],
    achievements: [{ title: "NTSE Qualifier — State Rank 22" }, { title: "District Debate Winner" }],
    disciplineRecords: [],
    documents: [
      { name: "Aadhar Card", status: "Uploaded" },
      { name: "Transfer Certificate", status: "Uploaded" },
      { name: "Birth Certificate", status: "Uploaded" },
      { name: "Last Marksheet", status: "Uploaded" },
      { name: "Passport Photo", status: "Pending" },
    ],
    teacherRemarks: [
      { teacherName: "Sri. Pramod Das", remark: "Excellent in Social Studies. Class topper.", date: "12-May-2026" },
      { teacherName: "Sri. Manoj Sahoo", remark: "Good writing skills in English.", date: "08-May-2026" },
    ],
    timeline: [
      { date: "01-Apr-2022", event: "Admission Completed" },
      { date: "20-Aug-2024", event: "NTSE Scholarship Qualified" },
      { date: "15-Dec-2025", event: "District Debate Competition Winner" },
      { date: "10-May-2026", event: "Fee Paid Full Year" },
    ],
    strongSubject: "Mathematics", weakSubject: "Odia", riskScore: "Excellent",
  },
  {
    id: 3, name: "Bibhuti Panda", class: "8", section: "B", parent: "Laxmi Panda", phone: "+91-9876543212", status: "Active",
    admissionNo: "SSM-BBS-2023-003", rollNo: "301", gender: "Male", dob: "05-Mar-2011", bloodGroup: "B+", admissionDate: "01-Apr-2023",
    motherName: "Smt. Laxmi Panda", guardianName: "Laxmi Panda", altPhone: "+91-9876543202",
    address: "Sector 3, BDA Colony", city: "Bhubaneswar", district: "Khordha",
    currentPercentage: 72, currentRank: 18, attendancePercent: 82, presentDays: 148, absentDays: 22, leaveDays: 10, subjectsPassed: 4, subjectsWeak: 2,
    annualFee: 15000, paidAmount: 10000, nextDueDate: "10-Jul-2026",
    medhabruti: "Not Qualified", olympiad: "Not Qualified", ntse: "Not Applied", otherScholarship: "Not Qualified",
    results: [
      { academicYear: "2024-25", percentage: 68, rank: 22, status: "Passed" },
      { academicYear: "2025-26", percentage: 72, rank: 18, status: "Passed" },
    ],
    subjects: [
      { subject: "Mathematics", marks: 65, grade: "C+" },
      { subject: "Science", marks: 70, grade: "B" },
      { subject: "English", marks: 75, grade: "B+" },
      { subject: "Odia", marks: 78, grade: "B+" },
      { subject: "Social Studies", marks: 72, grade: "B" },
      { subject: "Sanskrit", marks: 60, grade: "C" },
    ],
    feeHistory: [
      { month: "April 2026", amount: 1250, status: "Paid" },
      { month: "May 2026", amount: 1250, status: "Paid" },
      { month: "June 2026", amount: 1250, status: "Pending" },
    ],
    achievements: [{ title: "Participation — Inter-School Sports Meet" }],
    disciplineRecords: [{ type: "Warning", date: "12-Jan-2026", remarks: "Irregular homework submission" }],
    documents: [
      { name: "Aadhar Card", status: "Uploaded" },
      { name: "Transfer Certificate", status: "Pending" },
      { name: "Birth Certificate", status: "Uploaded" },
      { name: "Last Marksheet", status: "Uploaded" },
      { name: "Passport Photo", status: "Pending" },
    ],
    teacherRemarks: [
      { teacherName: "Dr. Anil Behera", remark: "Needs to improve in Mathematics. Extra classes recommended.", date: "18-May-2026" },
    ],
    timeline: [
      { date: "01-Apr-2023", event: "Admission Completed" },
      { date: "12-Jan-2026", event: "Warning Issued — Irregular Homework" },
      { date: "15-Mar-2026", event: "Sports Meet Participation" },
    ],
    strongSubject: "Odia", weakSubject: "Sanskrit", riskScore: "Needs Attention",
  },
  {
    id: 4, name: "Chinmaya Sahoo", class: "10", section: "A", parent: "Manoj Sahoo", phone: "+91-9876543213", status: "Inactive",
    admissionNo: "SSM-BBS-2020-004", rollNo: "102", gender: "Male", dob: "18-Jul-2009", bloodGroup: "AB+", admissionDate: "01-Apr-2020",
    motherName: "Smt. Manjari Sahoo", guardianName: "Manoj Sahoo", altPhone: "+91-9876543203",
    address: "Plot 78, Rasulgarh", city: "Bhubaneswar", district: "Khordha",
    currentPercentage: 0, currentRank: 0, attendancePercent: 0, presentDays: 0, absentDays: 0, leaveDays: 0, subjectsPassed: 0, subjectsWeak: 0,
    annualFee: 18000, paidAmount: 18000, nextDueDate: "NA",
    medhabruti: "Not Applied", olympiad: "Not Applied", ntse: "Not Applied", otherScholarship: "Not Qualified",
    results: [
      { academicYear: "2023-24", percentage: 74, rank: 16, status: "Passed" },
      { academicYear: "2024-25", percentage: 76, rank: 14, status: "Passed" },
    ],
    subjects: [
      { subject: "Mathematics", marks: 76, grade: "B+" },
      { subject: "Science", marks: 74, grade: "B" },
      { subject: "English", marks: 78, grade: "B+" },
      { subject: "Odia", marks: 72, grade: "B" },
      { subject: "Social Studies", marks: 70, grade: "B" },
      { subject: "Sanskrit", marks: 68, grade: "C+" },
    ],
    feeHistory: [
      { month: "April 2025", amount: 1500, status: "Paid" },
      { month: "May 2025", amount: 1500, status: "Paid" },
    ],
    achievements: [],
    disciplineRecords: [],
    documents: [
      { name: "Aadhar Card", status: "Uploaded" },
      { name: "Transfer Certificate", status: "Uploaded" },
      { name: "Birth Certificate", status: "Uploaded" },
      { name: "Last Marksheet", status: "Uploaded" },
      { name: "Passport Photo", status: "Uploaded" },
    ],
    teacherRemarks: [],
    timeline: [
      { date: "01-Apr-2020", event: "Admission Completed" },
      { date: "15-Mar-2026", event: "TC Issued — Student Left" },
    ],
    strongSubject: "English", weakSubject: "Sanskrit", riskScore: "Needs Attention",
  },
];

export const teachersData: Teacher[] = [
  { id: 1, name: "Dr. Rajendra Mohapatra", subject: "Mathematics", qualification: "Ph.D. in Mathematics", salary: 85000, status: "Active" },
  { id: 2, name: "Smt. Laxmi Panda", subject: "Science", qualification: "M.Sc. Physics", salary: 72000, status: "Active" },
  { id: 3, name: "Sri. Pramod Kumar Das", subject: "Social Studies", qualification: "M.A. History", salary: 68000, status: "Active" },
  { id: 4, name: "Sri. Manoj Sahoo", subject: "English", qualification: "M.A. English", salary: 65000, status: "Active" },
  { id: 5, name: "Dr. Anil Kumar Behera", subject: "Chemistry", qualification: "Ph.D. Chemistry", salary: 88000, status: "Active" },
  { id: 6, name: "Sri. Basant Rout", subject: "Physics", qualification: "M.Sc. Physics", salary: 71000, status: "Inactive" },
  { id: 7, name: "Smt. Sukanti Nayak", subject: "Biology", qualification: "M.Sc. Biology", salary: 69000, status: "Active" },
  { id: 8, name: "Sri. Bhaskar Mohanty", subject: "Mathematics", qualification: "M.Sc. Mathematics", salary: 67000, status: "Active" },
  { id: 9, name: "Dr. Saroj Sahoo", subject: "Economics", qualification: "Ph.D. Economics", salary: 82000, status: "Active" },
  { id: 10, name: "Sri. Nihar Rout", subject: "Computer Science", qualification: "B.Tech CSE", salary: 75000, status: "Active" },
];

export const salariesData: Salary[] = [
  { id: 1, name: "Dr. Rajendra Mohapatra", salary: 85000, month: "May 2025", status: "Paid" },
  { id: 2, name: "Smt. Laxmi Panda", salary: 72000, month: "May 2025", status: "Paid" },
  { id: 3, name: "Sri. Pramod Kumar Das", salary: 68000, month: "May 2025", status: "Pending" },
  { id: 4, name: "Sri. Manoj Sahoo", salary: 65000, month: "May 2025", status: "Paid" },
  { id: 5, name: "Dr. Anil Kumar Behera", salary: 88000, month: "May 2025", status: "Paid" },
  { id: 6, name: "Sri. Basant Rout", salary: 71000, month: "May 2025", status: "Pending" },
  { id: 7, name: "Smt. Sukanti Nayak", salary: 69000, month: "May 2025", status: "Paid" },
  { id: 8, name: "Sri. Bhaskar Mohanty", salary: 67000, month: "May 2025", status: "Pending" },
  { id: 9, name: "Dr. Saroj Sahoo", salary: 82000, month: "May 2025", status: "Paid" },
  { id: 10, name: "Sri. Nihar Rout", salary: 75000, month: "May 2025", status: "Pending" },
];

export const admissionLeads: AdmissionLead[] = [
  { id: 1, name: "Rohan Patra", parent: "Srikant Patra", phone: "+91-9876543301", class: "1st" },
  { id: 2, name: "Sneha Mishra", parent: "Anil Mishra", phone: "+91-9876543302", class: "5th" },
  { id: 3, name: "Arpit Sahoo", parent: "Ramesh Sahoo", phone: "+91-9876543303", class: "6th" },
  { id: 4, name: "Priyanka Das", parent: "Saroj Das", phone: "+91-9876543304", class: "9th" },
  { id: 5, name: "Subham Rout", parent: "Nihar Rout", phone: "+91-9876543305", class: "10th" },
];

const baseDocs = (): AdmissionDocument[] => [
  { name: "Student Photo", uploaded: false },
  { name: "Birth Certificate", uploaded: false },
  { name: "Aadhaar Card", uploaded: false },
  { name: "Transfer Certificate", uploaded: false },
  { name: "Previous Marksheet", uploaded: false },
  { name: "Caste Certificate", uploaded: false },
  { name: "Income Certificate", uploaded: false },
];

export const admissionFormsData: AdmissionFormData[] = [
  {
    id: 1, schoolId: 1, studentName: "Rohan Patra", admissionNo: "SSM-BBS-2026-001", classApplyingFor: "1", section: "A",
    gender: "Male", dateOfBirth: "12-Aug-2018", bloodGroup: "B+", aadhaarNo: "9876-5432-1101", religion: "Hindu", category: "General", nationality: "Indian",
    fatherName: "Srikant Patra", fatherOccupation: "Teacher", fatherMobile: "+91-9876543301", fatherEmail: "srikant.patra@email.com",
    motherName: "Smt. Sunita Patra", motherOccupation: "Housewife", motherMobile: "+91-9876543401",
    guardianName: "", guardianMobile: "",
    village: "Nayapalli", postOffice: "Nayapalli PO", policeStation: "Khandagiri", district: "Khordha", state: "Odisha", pinCode: "751012", fullAddress: "Plot 42, Nayapalli, Bhubaneswar, Khordha",
    prevSchoolName: "", prevClass: "", prevBoard: "", prevSchoolAddress: "", tcNumber: "", reasonForTransfer: "",
    prevYearPercent: "", scholarshipQualified: "No", olympiadQualified: "No", specialAchievements: "", sportsAchievements: "", otherAchievements: "",
    admissionFee: 2000, monthlyFee: 1250, transportFee: 500, annualFee: 15000, discountPercent: 0, scholarshipAmount: 0, feeCategory: "Regular",
    medicalConditions: "None", allergies: "None", emergencyContact: "+91-9876543301",
    documents: baseDocs().map((d, i) => ({ ...d, uploaded: i < 4 })),
    status: "Pending Verification", submittedDate: "10-Jun-2026", rejectionReason: "",
  },
  {
    id: 2, schoolId: 1, studentName: "Sneha Mishra", admissionNo: "SSM-BBS-2026-002", classApplyingFor: "5", section: "B",
    gender: "Female", dateOfBirth: "05-Mar-2014", bloodGroup: "A+", aadhaarNo: "9876-5432-1102", religion: "Hindu", category: "OBC", nationality: "Indian",
    fatherName: "Anil Mishra", fatherOccupation: "Engineer", fatherMobile: "+91-9876543302", fatherEmail: "anil.mishra@email.com",
    motherName: "Smt. Purnima Mishra", motherOccupation: "Nurse", motherMobile: "+91-9876543402",
    guardianName: "", guardianMobile: "",
    village: "Unit 4", postOffice: "Unit 4 PO", policeStation: "Lingaraj", district: "Khordha", state: "Odisha", pinCode: "751002", fullAddress: "Lane 5, Unit 4, Bhubaneswar",
    prevSchoolName: "DAV Public School", prevClass: "4", prevBoard: "CBSE", prevSchoolAddress: "Unit 8, Bhubaneswar", tcNumber: "DAV/TC/2026/042", reasonForTransfer: "Family relocation",
    prevYearPercent: "85", scholarshipQualified: "No", olympiadQualified: "No", specialAchievements: "School topper in Class 4", sportsAchievements: "100m race winner", otherAchievements: "",
    admissionFee: 2000, monthlyFee: 1250, transportFee: 600, annualFee: 15000, discountPercent: 5, scholarshipAmount: 0, feeCategory: "Regular",
    medicalConditions: "None", allergies: "Dust", emergencyContact: "+91-9876543302",
    documents: baseDocs().map(d => ({ ...d, uploaded: true })),
    status: "Approved", submittedDate: "05-Jun-2026", rejectionReason: "",
  },
  {
    id: 3, schoolId: 1, studentName: "Arpit Sahoo", admissionNo: "SSM-BBS-2026-003", classApplyingFor: "6", section: "",
    gender: "Male", dateOfBirth: "18-Nov-2013", bloodGroup: "O+", aadhaarNo: "9876-5432-1103", religion: "Hindu", category: "SC", nationality: "Indian",
    fatherName: "Ramesh Sahoo", fatherOccupation: "Farmer", fatherMobile: "+91-9876543303", fatherEmail: "",
    motherName: "Smt. Basanti Sahoo", motherOccupation: "Housewife", motherMobile: "+91-9876543403",
    guardianName: "", guardianMobile: "",
    village: "Badagada", postOffice: "Badagada PO", policeStation: "Jatani", district: "Khordha", state: "Odisha", pinCode: "752012", fullAddress: "Village Badagada, Jatani, Khordha",
    prevSchoolName: "Govt. UPS Badagada", prevClass: "5", prevBoard: "State", prevSchoolAddress: "Badagada, Jatani", tcNumber: "", reasonForTransfer: "Better education",
    prevYearPercent: "72", scholarshipQualified: "No", olympiadQualified: "No", specialAchievements: "", sportsAchievements: "Football player", otherAchievements: "",
    admissionFee: 1000, monthlyFee: 1000, transportFee: 0, annualFee: 12000, discountPercent: 20, scholarshipAmount: 2000, feeCategory: "BPL",
    medicalConditions: "Asthma", allergies: "Pollen", emergencyContact: "+91-9876543303",
    documents: baseDocs().map(d => ({ ...d, uploaded: d.name === "Student Photo" || d.name === "Birth Certificate" })),
    status: "New", submittedDate: "15-Jun-2026", rejectionReason: "",
  },
  {
    id: 4, schoolId: 1, studentName: "Priyanka Das", admissionNo: "SSM-BBS-2026-004", classApplyingFor: "9", section: "",
    gender: "Female", dateOfBirth: "22-Jul-2010", bloodGroup: "AB+", aadhaarNo: "9876-5432-1104", religion: "Hindu", category: "General", nationality: "Indian",
    fatherName: "Saroj Das", fatherOccupation: "Business", fatherMobile: "+91-9876543304", fatherEmail: "saroj.das@email.com",
    motherName: "Smt. Laxmi Das", motherOccupation: "Teacher", motherMobile: "+91-9876543404",
    guardianName: "", guardianMobile: "",
    village: "Sahid Nagar", postOffice: "Sahid Nagar PO", policeStation: "Kharavela Nagar", district: "Khordha", state: "Odisha", pinCode: "751007", fullAddress: "Plot 88, Sahid Nagar, Bhubaneswar",
    prevSchoolName: "St. Xavier's School", prevClass: "8", prevBoard: "ICSE", prevSchoolAddress: "Kalinga Nagar, Bhubaneswar", tcNumber: "SX/TC/2026/128", reasonForTransfer: "Wants Odia medium education",
    prevYearPercent: "91", scholarshipQualified: "Yes", olympiadQualified: "Yes", specialAchievements: "State-level debate winner", sportsAchievements: "", otherAchievements: "NTSE Qualified",
    admissionFee: 2000, monthlyFee: 1500, transportFee: 800, annualFee: 18000, discountPercent: 10, scholarshipAmount: 3000, feeCategory: "Merit",
    medicalConditions: "None", allergies: "None", emergencyContact: "+91-9876543304",
    documents: baseDocs().map(d => ({ ...d, uploaded: true })),
    status: "Approved", submittedDate: "01-Jun-2026", rejectionReason: "",
  },
  {
    id: 5, schoolId: 1, studentName: "Subham Rout", admissionNo: "SSM-BBS-2026-005", classApplyingFor: "10", section: "",
    gender: "Male", dateOfBirth: "05-Jan-2009", bloodGroup: "B-", aadhaarNo: "9876-5432-1105", religion: "Hindu", category: "ST", nationality: "Indian",
    fatherName: "Nihar Rout", fatherOccupation: "Government Servant", fatherMobile: "+91-9876543305", fatherEmail: "nihar.rout@email.com",
    motherName: "Smt. Anjali Rout", motherOccupation: "Housewife", motherMobile: "+91-9876543405",
    guardianName: "", guardianMobile: "",
    village: "Khandagiri", postOffice: "Khandagiri PO", policeStation: "Khandagiri", district: "Khordha", state: "Odisha", pinCode: "751030", fullAddress: "Khandagiri, Bhubaneswar",
    prevSchoolName: "Kendriya Vidyalaya", prevClass: "9", prevBoard: "CBSE", prevSchoolAddress: "Khandagiri, Bhubaneswar", tcNumber: "KV/TC/2026/215", reasonForTransfer: "Parents' preference for SSM",
    prevYearPercent: "88", scholarshipQualified: "Yes", olympiadQualified: "No", specialAchievements: "", sportsAchievements: "Cricket team captain", otherAchievements: "",
    admissionFee: 2000, monthlyFee: 1500, transportFee: 500, annualFee: 18000, discountPercent: 15, scholarshipAmount: 4000, feeCategory: "Regular",
    medicalConditions: "None", allergies: "None", emergencyContact: "+91-9876543305",
    documents: baseDocs().map((d, i) => ({ ...d, uploaded: i < 3 })),
    status: "Pending Verification", submittedDate: "12-Jun-2026", rejectionReason: "",
  },
];

export const admissionAnalyticsData = {
  thisMonth: 38,
  thisYear: 412,
  lastYear: 320,
  classWise: [
    { class: "1st", boys: 18, girls: 14 },
    { class: "2nd", boys: 12, girls: 10 },
    { class: "3rd", boys: 15, girls: 11 },
    { class: "4th", boys: 10, girls: 9 },
    { class: "5th", boys: 16, girls: 13 },
    { class: "6th", boys: 20, girls: 15 },
    { class: "7th", boys: 14, girls: 12 },
    { class: "8th", boys: 9, girls: 8 },
    { class: "9th", boys: 22, girls: 18 },
    { class: "10th", boys: 25, girls: 20 },
  ],
};

export const stateWiseData: StateWiseItem[] = [
  { state: "Odisha", schools: 420, students: 168000, revenue: 6500000 },
  { state: "Madhya Pradesh", schools: 280, students: 112000, revenue: 4200000 },
  { state: "Uttar Pradesh", schools: 320, students: 128000, revenue: 4800000 },
  { state: "Rajasthan", schools: 195, students: 78000, revenue: 2900000 },
  { state: "Bihar", schools: 310, students: 124000, revenue: 4600000 },
  { state: "West Bengal", schools: 165, students: 66000, revenue: 2500000 },
  { state: "Assam", schools: 95, students: 38000, revenue: 1400000 },
  { state: "Chhattisgarh", schools: 140, students: 56000, revenue: 2100000 },
  { state: "Jharkhand", schools: 110, students: 44000, revenue: 1600000 },
  { state: "Gujarat", schools: 85, students: 34000, revenue: 1300000 },
];

export const noticesData: Notice[] = [
  { id: 1, title: "Summer Vacation Schedule", content: "Summer vacation will start from April 15th to June 15th. All schools must complete final exams by April 10th.", date: "2025-03-15", priority: "High" },
  { id: 2, title: "Teacher Workshop", content: "Compulsory teacher training workshop on modern teaching methodologies at Bhubaneswar HQ on March 25th.", date: "2025-03-10", priority: "Medium" },
  { id: 3, title: "Fee Structure Revision", content: "Revised fee structure for academic year 2025-26 has been approved. New structure effective from April 1st.", date: "2025-03-05", priority: "High" },
  { id: 4, title: "Sports Meet 2025", content: "Annual inter-school sports meet scheduled for February 2025. Registration deadline is January 15th.", date: "2025-01-20", priority: "Low" },
  { id: 5, title: "Board Exam Guidelines", content: "CBSE/ICSE/State board exam guidelines for 2025 have been issued. Ensure compliance by all schools.", date: "2025-02-01", priority: "High" },
];

export const circularsData: Circular[] = [
  { id: 1, title: "Academic Calendar 2025-26", date: "2025-03-20", status: "Published", file: "academic_calendar_2025_26.pdf" },
  { id: 2, title: "Staff Recruitment Guidelines", date: "2025-03-18", status: "Published", file: "staff_recruitment_2025.pdf" },
  { id: 3, title: "Uniform Policy Update", date: "2025-03-12", status: "Draft", file: "uniform_policy_update.pdf" },
  { id: 4, title: "Safety Guidelines for Schools", date: "2025-03-08", status: "Published", file: "safety_guidelines_2025.pdf" },
  { id: 5, title: "Digital Classroom Initiative", date: "2025-03-01", status: "Draft", file: "digital_classroom_initiative.pdf" },
];

export const recentActivities: Activity[] = [
  { id: 1, action: "New school registered: Saraswati Sishu Mandir", actor: "Bhubaneswar HQ", time: "2 hours ago" },
  { id: 2, action: "Circular published: Academic Calendar 2025-26", actor: "Sansthan Admin", time: "5 hours ago" },
  { id: 3, action: "Admission lead received from Rohan Patra", actor: "Class 1st", time: "1 day ago" },
  { id: 4, action: "Salary processed for May 2025", actor: "Finance Dept", time: "2 days ago" },
  { id: 5, action: "Notice broadcast: Summer Vacation Schedule", actor: "School Admin", time: "3 days ago" },
  { id: 6, action: "Teacher workshop scheduled at HQ", actor: "Training Dept", time: "4 days ago" },
  { id: 7, action: "Subscription renewed for 150 schools", actor: "System", time: "5 days ago" },
];

export const districtWiseData: DistrictWiseItem[] = [
  { district: "Khordha", schools: 85, students: 34000, teachers: 1580 },
  { district: "Cuttack", schools: 72, students: 28800, teachers: 1340 },
  { district: "Puri", schools: 45, students: 18000, teachers: 840 },
  { district: "Sundargarh", schools: 38, students: 15200, teachers: 710 },
  { district: "Sambalpur", schools: 42, students: 16800, teachers: 780 },
  { district: "Balasore", schools: 35, students: 14000, teachers: 650 },
  { district: "Ganjam", schools: 55, students: 22000, teachers: 1020 },
  { district: "Jajpur", schools: 28, students: 11200, teachers: 520 },
];

// ─── Audit & Governance ───
export interface AuditStats {
  totalReports: number;
  pendingReports: number;
  totalAdmissionsThisYear: number;
  scholarshipWinners: number;
  olympiadWinners: number;
  topSchools: number;
  lowestSchools: number;
}

export interface SchoolAuditReport {
  id: number;
  schoolName: string;
  district: string;
  students: number;
  admissions: number;
  passPercentage: number;
  scholarshipWinners: number;
  olympiadWinners: number;
  status: "Submitted" | "Under Review" | "Approved" | "Revision Required";
  growth: number;
}

export interface PerformanceRanking {
  rank: number;
  schoolName: string;
  academicScore: number;
  studentGrowth: number;
  scholarshipScore: number;
  olympiadScore: number;
  teacherActivity: number;
  infrastructure: number;
  totalScore: number;
}

export interface ComparisonData {
  year: string;
  admissions: number;
  studentStrength: number;
  passPercentage: number;
  scholarshipSelections: number;
  olympiadSelections: number;
  teacherCount: number;
  schoolGrowth: number;
}

export interface DistrictPerformance {
  district: string;
  schools: number;
  students: number;
  avgPassPercentage: number;
  scholarshipWinners: number;
  olympiadWinners: number;
  growth: number;
}

export interface SchoolReportSubmission {
  id: number;
  schoolName: string;
  month: string;
  year: string;
  totalStudents: number;
  newAdmissions: number;
  studentsLeft: number;
  tcIssued: number;
  studentGrowth: number;
  passPercentage: number;
  firstDivision: number;
  distinction: number;
  topPerformers: string;
  previousYearComparison: string;
  medhabruti: number;
  olympiadQualified: number;
  ntseQualified: number;
  stateRankHolders: number;
  nationalRankHolders: number;
  sportsAchievements: string;
  debateCompetitions: string;
  scienceExhibitions: string;
  culturalPrograms: string;
  specialEvents: string;
  newClassrooms: number;
  libraryDevelopment: string;
  computerLabUpdates: string;
  scienceLabUpdates: string;
  otherImprovements: string;
  challenges: string;
  teacherRequirements: string;
  infrastructureRequirements: string;
  additionalNotes: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Revision Required";
  submittedDate: string;
}

// ─── Teacher Productivity ───
export interface TeacherClass {
  id: number;
  className: string;
  section: string;
  subject: string;
  studentCount: number;
  classTeacher: boolean;
}

export interface Homework {
  id: number;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: "Active" | "Submitted" | "Overdue";
  submissions: number;
  totalStudents: number;
}

export interface TeacherMonthlyReport {
  id: number;
  month: string;
  year: string;
  classesConducted: number;
  specialActivities: string;
  studentAchievements: string;
  competitionsConducted: string;
  challengesFaced: string;
  suggestions: string;
  status: "Draft" | "Submitted" | "Approved";
}

export interface LeaveRequest {
  id: number;
  teacherName?: string;
  type: "Sick" | "Casual" | "Earned" | "Maternity" | "Other";
  fromDate: string;
  toDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

export interface TeacherProfileData {
  qualification: string;
  joiningDate: string;
  assignedClasses: string[];
  contact: string;
  email: string;
  experience: string;
  specialization: string;
}

export interface FutureModule {
  name: string;
  description: string;
  icon: string;
  eta: string;
}

// ─── Audit Stats ───
export const auditStats: AuditStats = {
  totalReports: 842,
  pendingReports: 358,
  totalAdmissionsThisYear: 84500,
  scholarshipWinners: 1420,
  olympiadWinners: 318,
  topSchools: 10,
  lowestSchools: 5,
};

export const schoolAuditReports: SchoolAuditReport[] = [
  { id: 1, schoolName: "Saraswati Sishu Mandir Bhubaneswar", district: "Khordha", students: 1248, admissions: 185, passPercentage: 94.5, scholarshipWinners: 24, olympiadWinners: 8, status: "Approved", growth: 12 },
  { id: 2, schoolName: "Saraswati Sishu Mandir Cuttack", district: "Cuttack", students: 980, admissions: 142, passPercentage: 91.2, scholarshipWinners: 18, olympiadWinners: 5, status: "Approved", growth: 8 },
  { id: 3, schoolName: "Saraswati Sishu Mandir Puri", district: "Puri", students: 720, admissions: 98, passPercentage: 88.6, scholarshipWinners: 12, olympiadWinners: 3, status: "Submitted", growth: 5 },
  { id: 4, schoolName: "Saraswati Sishu Mandir Rourkela", district: "Sundargarh", students: 850, admissions: 115, passPercentage: 86.3, scholarshipWinners: 9, olympiadWinners: 4, status: "Under Review", growth: 7 },
  { id: 5, schoolName: "Saraswati Sishu Mandir Sambalpur", district: "Sambalpur", students: 660, admissions: 82, passPercentage: 90.1, scholarshipWinners: 14, olympiadWinners: 6, status: "Approved", growth: 10 },
  { id: 6, schoolName: "Saraswati Sishu Mandir Balasore", district: "Balasore", students: 590, admissions: 71, passPercentage: 84.7, scholarshipWinners: 7, olympiadWinners: 2, status: "Submitted", growth: 3 },
  { id: 7, schoolName: "Saraswati Sishu Vidya Mandir Berhampur", district: "Ganjam", students: 780, admissions: 105, passPercentage: 92.8, scholarshipWinners: 16, olympiadWinners: 7, status: "Approved", growth: 9 },
  { id: 8, schoolName: "Saraswati Shishu Mandir Jajpur", district: "Jajpur", students: 430, admissions: 45, passPercentage: 79.4, scholarshipWinners: 4, olympiadWinners: 1, status: "Revision Required", growth: -2 },
  { id: 9, schoolName: "Saraswati Vidya Mandir Bhadrak", district: "Bhadrak", students: 510, admissions: 62, passPercentage: 87.2, scholarshipWinners: 8, olympiadWinners: 3, status: "Submitted", growth: 4 },
  { id: 10, schoolName: "Saraswati Sishu Mandir Kendujhar", district: "Kendujhar", students: 380, admissions: 48, passPercentage: 82.5, scholarshipWinners: 5, olympiadWinners: 2, status: "Under Review", growth: 1 },
];

export const performanceRankings: PerformanceRanking[] = [
  { rank: 1, schoolName: "Saraswati Sishu Mandir Bhubaneswar", academicScore: 95, studentGrowth: 88, scholarshipScore: 92, olympiadScore: 90, teacherActivity: 85, infrastructure: 90, totalScore: 540 },
  { rank: 2, schoolName: "Saraswati Sishu Vidya Mandir Berhampur", academicScore: 93, studentGrowth: 82, scholarshipScore: 88, olympiadScore: 85, teacherActivity: 80, infrastructure: 82, totalScore: 510 },
  { rank: 3, schoolName: "Saraswati Sishu Mandir Cuttack", academicScore: 91, studentGrowth: 78, scholarshipScore: 85, olympiadScore: 82, teacherActivity: 78, infrastructure: 85, totalScore: 499 },
  { rank: 4, schoolName: "Saraswati Sishu Mandir Sambalpur", academicScore: 90, studentGrowth: 75, scholarshipScore: 82, olympiadScore: 80, teacherActivity: 82, infrastructure: 75, totalScore: 484 },
  { rank: 5, schoolName: "Saraswati Sishu Mandir Rourkela", academicScore: 86, studentGrowth: 72, scholarshipScore: 78, olympiadScore: 76, teacherActivity: 75, infrastructure: 80, totalScore: 467 },
  { rank: 6, schoolName: "Saraswati Sishu Mandir Puri", academicScore: 88, studentGrowth: 70, scholarshipScore: 76, olympiadScore: 72, teacherActivity: 72, infrastructure: 78, totalScore: 456 },
  { rank: 7, schoolName: "Saraswati Vidya Mandir Bhadrak", academicScore: 87, studentGrowth: 65, scholarshipScore: 74, olympiadScore: 70, teacherActivity: 70, infrastructure: 72, totalScore: 438 },
  { rank: 8, schoolName: "Saraswati Sishu Mandir Balasore", academicScore: 84, studentGrowth: 62, scholarshipScore: 72, olympiadScore: 68, teacherActivity: 68, infrastructure: 70, totalScore: 424 },
  { rank: 9, schoolName: "Saraswati Sishu Mandir Kendujhar", academicScore: 82, studentGrowth: 58, scholarshipScore: 68, olympiadScore: 65, teacherActivity: 65, infrastructure: 65, totalScore: 403 },
  { rank: 10, schoolName: "Saraswati Shishu Mandir Jajpur", academicScore: 79, studentGrowth: 55, scholarshipScore: 65, olympiadScore: 60, teacherActivity: 62, infrastructure: 60, totalScore: 381 },
];

export const comparisonData: ComparisonData[] = [
  { year: "2025", admissions: 78200, studentStrength: 460000, passPercentage: 87.5, scholarshipSelections: 1240, olympiadSelections: 285, teacherCount: 21200, schoolGrowth: 1150 },
  { year: "2026", admissions: 84500, studentStrength: 482450, passPercentage: 89.2, scholarshipSelections: 1420, olympiadSelections: 318, teacherCount: 22380, schoolGrowth: 1200 },
];

export const districtPerformance: DistrictPerformance[] = [
  { district: "Khordha", schools: 85, students: 34000, avgPassPercentage: 94.5, scholarshipWinners: 120, olympiadWinners: 28, growth: 12 },
  { district: "Cuttack", schools: 72, students: 28800, avgPassPercentage: 91.2, scholarshipWinners: 95, olympiadWinners: 22, growth: 8 },
  { district: "Ganjam", schools: 55, students: 22000, avgPassPercentage: 92.8, scholarshipWinners: 88, olympiadWinners: 20, growth: 9 },
  { district: "Sambalpur", schools: 42, students: 16800, avgPassPercentage: 90.1, scholarshipWinners: 72, olympiadWinners: 16, growth: 10 },
  { district: "Sundargarh", schools: 38, students: 15200, avgPassPercentage: 86.3, scholarshipWinners: 58, olympiadWinners: 12, growth: 7 },
  { district: "Puri", schools: 45, students: 18000, avgPassPercentage: 88.6, scholarshipWinners: 65, olympiadWinners: 14, growth: 5 },
  { district: "Balasore", schools: 35, students: 14000, avgPassPercentage: 84.7, scholarshipWinners: 45, olympiadWinners: 10, growth: 3 },
  { district: "Bhadrak", schools: 28, students: 11200, avgPassPercentage: 87.2, scholarshipWinners: 42, olympiadWinners: 9, growth: 4 },
  { district: "Kendujhar", schools: 22, students: 8800, avgPassPercentage: 82.5, scholarshipWinners: 30, olympiadWinners: 6, growth: 1 },
  { district: "Jajpur", schools: 28, students: 11200, avgPassPercentage: 79.4, scholarshipWinners: 28, olympiadWinners: 5, growth: -2 },
];

// Governance dashboard stats
export const governanceStats = {
  totalSchools: 1200,
  totalStudents: 482450,
  totalTeachers: 22380,
  admissionsThisYear: 84500,
  scholarshipWinners: 1420,
  olympiadWinners: 318,
  reportsSubmitted: 842,
  reportsPending: 358,
};

export const governanceGrowthData = [
  { month: "Apr", admissions: 5200, students: 458000, teachers: 21400, schools: 1155 },
  { month: "May", admissions: 6800, students: 461000, teachers: 21550, schools: 1162 },
  { month: "Jun", admissions: 12400, students: 466000, teachers: 21700, schools: 1170 },
  { month: "Jul", admissions: 15800, students: 470000, teachers: 21850, schools: 1178 },
  { month: "Aug", admissions: 11200, students: 473000, teachers: 21980, schools: 1185 },
  { month: "Sep", admissions: 9800, students: 476000, teachers: 22050, schools: 1190 },
  { month: "Oct", admissions: 7600, students: 478500, teachers: 22150, schools: 1194 },
  { month: "Nov", admissions: 6200, students: 480000, teachers: 22250, schools: 1197 },
  { month: "Dec", admissions: 4800, students: 481500, teachers: 22300, schools: 1199 },
  { month: "Jan", admissions: 3700, students: 482000, teachers: 22350, schools: 1200 },
  { month: "Feb", admissions: 0, students: 482450, teachers: 22380, schools: 1200 },
];

export const scholarshipTrendData = [
  { year: "2020", medhabruti: 520, olympiad: 120, ntse: 45 },
  { year: "2021", medhabruti: 680, olympiad: 155, ntse: 52 },
  { year: "2022", medhabruti: 850, olympiad: 195, ntse: 68 },
  { year: "2023", medhabruti: 1050, olympiad: 240, ntse: 82 },
  { year: "2024", medhabruti: 1240, olympiad: 285, ntse: 95 },
  { year: "2025", medhabruti: 1420, olympiad: 318, ntse: 112 },
];

// Sample submitted report for school
export const sampleSubmittedReport: SchoolReportSubmission = {
  id: 1,
  schoolName: "Saraswati Sishu Mandir Bhubaneswar",
  month: "May",
  year: "2025",
  totalStudents: 1248,
  newAdmissions: 185,
  studentsLeft: 12,
  tcIssued: 8,
  studentGrowth: 14.8,
  passPercentage: 94.5,
  firstDivision: 312,
  distinction: 198,
  topPerformers: "Aarav Mohapatra (98.6%), Ananya Das (97.2%)",
  previousYearComparison: "↑ 2.3% improvement from 2024",
  medhabruti: 24,
  olympiadQualified: 8,
  ntseQualified: 5,
  stateRankHolders: 3,
  nationalRankHolders: 1,
  sportsAchievements: "Inter-school Athletics champions, District Kabaddi runners-up",
  debateCompetitions: "State-level debate winners (2nd place)",
  scienceExhibitions: "3 projects selected for district science fair",
  culturalPrograms: "Annual Day celebration, Republic Day parade",
  specialEvents: "Yoga Day, Teachers' Day, Children's Day",
  newClassrooms: 4,
  libraryDevelopment: "Added 500 new books, digital reading corner",
  computerLabUpdates: "20 new computers with internet connectivity",
  scienceLabUpdates: "New chemistry lab equipment purchased",
  otherImprovements: "Smart boards installed in 6 classrooms",
  challenges: "Shortage of mathematics teachers, need bus facility",
  teacherRequirements: "2 Mathematics teachers, 1 Science teacher",
  infrastructureRequirements: "New playground equipment, boundary wall repair",
  additionalNotes: "Requesting approval for new computer lab expansion",
  status: "Approved",
  submittedDate: "2025-05-28",
};

// Teacher data
export const teacherClasses: TeacherClass[] = [
  { id: 1, className: "10", section: "A", subject: "Mathematics", studentCount: 42, classTeacher: true },
  { id: 2, className: "10", section: "B", subject: "Mathematics", studentCount: 38, classTeacher: false },
  { id: 3, className: "9", section: "A", subject: "Mathematics", studentCount: 40, classTeacher: false },
  { id: 4, className: "9", section: "B", subject: "Mathematics", studentCount: 35, classTeacher: false },
];

export const homeworkData: Homework[] = [
  { id: 1, title: "Quadratic Equations Practice", subject: "Mathematics", className: "10A", dueDate: "2025-06-15", status: "Active", submissions: 28, totalStudents: 42 },
  { id: 2, title: "Trigonometry Assignment", subject: "Mathematics", className: "10B", dueDate: "2025-06-16", status: "Active", submissions: 20, totalStudents: 38 },
  { id: 3, title: "Linear Equations Worksheet", subject: "Mathematics", className: "9A", dueDate: "2025-06-14", status: "Submitted", submissions: 40, totalStudents: 40 },
  { id: 4, title: "Geometry Basics", subject: "Mathematics", className: "9B", dueDate: "2025-06-12", status: "Overdue", submissions: 25, totalStudents: 35 },
  { id: 5, title: "Statistics Project", subject: "Mathematics", className: "10A", dueDate: "2025-06-20", status: "Active", submissions: 10, totalStudents: 42 },
];

export const teacherMonthlyReports: TeacherMonthlyReport[] = [
  { id: 1, month: "April", year: "2025", classesConducted: 82, specialActivities: "Maths quiz competition", studentAchievements: "3 students selected for district olympiad", competitionsConducted: "Class-level mathematics quiz", challengesFaced: "Slow progress in trigonometry chapter", suggestions: "Extra practice sessions needed", status: "Approved" },
  { id: 2, month: "May", year: "2025", classesConducted: 78, specialActivities: "Science exhibition visit", studentAchievements: "5 students scored above 90%", competitionsConducted: "Inter-class mathematics competition", challengesFaced: "Some students struggling with algebra", suggestions: "Remedial classes for weak students", status: "Submitted" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 1, teacherName: "Dr. Rajendra Mohapatra", type: "Sick", fromDate: "2025-06-10", toDate: "2025-06-11", reason: "Fever and rest advised", status: "Approved", appliedOn: "2025-06-09" },
  { id: 2, teacherName: "Smt. Laxmi Panda", type: "Casual", fromDate: "2025-06-20", toDate: "2025-06-20", reason: "Personal work", status: "Pending", appliedOn: "2025-06-15" },
  { id: 3, teacherName: "Sri. Pramod Kumar Das", type: "Earned", fromDate: "2025-07-01", toDate: "2025-07-05", reason: "Family vacation", status: "Rejected", appliedOn: "2025-06-01" },
  { id: 4, teacherName: "Sri. Manoj Sahoo", type: "Sick", fromDate: "2025-05-15", toDate: "2025-05-16", reason: "Medical checkup", status: "Approved", appliedOn: "2025-05-14" },
];

export const teacherProfile: TeacherProfileData = {
  qualification: "M.Sc. Mathematics, B.Ed",
  joiningDate: "2018-06-15",
  assignedClasses: ["10A", "10B", "9A", "9B"],
  contact: "+91-9876543210",
  email: "rajendra.mohapatra@ssmbbsr.edu.in",
  experience: "12 years",
  specialization: "Mathematics, Statistics",
};

export const futureModules: FutureModule[] = [
  { name: "AI Attendance System", description: "Facial recognition based attendance tracking", icon: "ScanFace", eta: "Q3 2025" },
  { name: "Parent Portal", description: "Dedicated parent login for progress tracking", icon: "Users", eta: "Q4 2025" },
  { name: "Learning Management System", description: "Digital classroom with online assignments", icon: "BookOpen", eta: "Q1 2026" },
  { name: "Exam Management", description: "Online exams, auto-evaluation, and results", icon: "FileCheck", eta: "Q2 2026" },
  { name: "Mobile Application", description: "Native mobile app for all stakeholders", icon: "Smartphone", eta: "Q3 2026" },
  { name: "Advanced Student Analytics", description: "Predictive analytics for student performance", icon: "BarChart3", eta: "Q4 2026" },
  { name: "AI Governance Assistant", description: "AI-powered governance insights and alerts", icon: "Bot", eta: "Q1 2027" },
];

// Governance activity feed
export const governanceActivities = [
  { id: 1, action: "Saraswati Sishu Mandir Bhubaneswar submitted May report", actor: "School Admin", time: "2 hours ago", type: "report" },
  { id: 2, action: "24 students qualified for Medhabruti scholarship", actor: "Sansthan Admin", time: "1 day ago", type: "achievement" },
  { id: 3, action: "8 Olympiad winners from SSM Bhubaneswar", actor: "Teacher", time: "2 days ago", type: "achievement" },
  { id: 4, action: "Cuttack school reported 91.2% pass percentage", actor: "School Admin", time: "3 days ago", type: "report" },
  { id: 5, action: "New circular: Academic Calendar 2025-26 published", actor: "Sansthan Admin", time: "4 days ago", type: "circular" },
  { id: 6, action: "Sambalpur school achieved 90.1% in board exams", actor: "Principal", time: "5 days ago", type: "achievement" },
  { id: 7, action: "Infrastructure upgrade completed at SSM Puri", actor: "School Admin", time: "6 days ago", type: "update" },
  { id: 8, action: "Berhampur school submitted quarterly report", actor: "School Admin", time: "1 week ago", type: "report" },
];

// ─── Multiple Monthly Reports (for history) ───
export interface MonthlyReportEntry {
  id: number;
  schoolId: number;
  schoolName: string;
  month: string;
  year: string;
  totalStudents: number;
  newAdmissions: number;
  studentsLeft: number;
  tcIssued: number;
  studentGrowthPercent: number;
  passPercentage: number;
  firstDivision: number;
  distinction: number;
  topPerformers: string;
  prevYearComparison: string;
  medhabrutiQualified: number;
  olympiadQualified: number;
  ntseQualified: number;
  stateRankHolders: number;
  nationalRankHolders: number;
  sportsAchievements: string;
  debateCompetitions: string;
  scienceExhibitions: string;
  culturalPrograms: string;
  specialEvents: string;
  newClassrooms: number;
  libraryDevelopment: string;
  computerLabUpdates: string;
  scienceLabUpdates: string;
  otherImprovements: string;
  challenges: string;
  teacherRequirements: string;
  infrastructureRequirements: string;
  additionalNotes: string;
  status: "Submitted" | "Under Review" | "Approved" | "Revision Required";
  submittedDate: string;
}

export const allMonthlyReports: MonthlyReportEntry[] = [
  // ─── Bhubaneswar (schoolId: 1) ───
  { id: 1, schoolId: 1, schoolName: "Saraswati Sishu Mandir Bhubaneswar", month: "April", year: "2025", totalStudents: 1230, newAdmissions: 42, studentsLeft: 5, tcIssued: 3, studentGrowthPercent: 3.4, passPercentage: 93.2, firstDivision: 298, distinction: 185, topPerformers: "Aarav M (97%), Ananya D (96%)", prevYearComparison: "+1.8% vs Apr 2024", medhabrutiQualified: 18, olympiadQualified: 6, ntseQualified: 4, stateRankHolders: 2, nationalRankHolders: 1, sportsAchievements: "Athletics meet - 3 gold", debateCompetitions: "Inter-school debate - 2nd", scienceExhibitions: "5 projects submitted", culturalPrograms: "Annual Day prep started", specialEvents: "Yoga Day celebrated", newClassrooms: 1, libraryDevelopment: "200 new books", computerLabUpdates: "10 PCs upgraded", scienceLabUpdates: "Microscopes purchased", otherImprovements: "Smart board in 2 classes", challenges: "Regular power cuts", teacherRequirements: "1 Hindi teacher needed", infrastructureRequirements: "Solar backup needed", additionalNotes: "Requesting urgent approval", status: "Approved", submittedDate: "2025-04-28" },
  { id: 2, schoolId: 1, schoolName: "Saraswati Sishu Mandir Bhubaneswar", month: "May", year: "2025", totalStudents: 1248, newAdmissions: 185, studentsLeft: 12, tcIssued: 8, studentGrowthPercent: 14.8, passPercentage: 94.5, firstDivision: 312, distinction: 198, topPerformers: "Aarav M (98.6%), Ananya D (97.2%)", prevYearComparison: "+2.3% vs May 2024", medhabrutiQualified: 24, olympiadQualified: 8, ntseQualified: 5, stateRankHolders: 3, nationalRankHolders: 1, sportsAchievements: "Inter-school Athletics champions", debateCompetitions: "State-level debate winners", scienceExhibitions: "3 projects in district fair", culturalPrograms: "Annual Day, Republic Day", specialEvents: "Teachers' Day, Children's Day", newClassrooms: 4, libraryDevelopment: "500 new books, digital corner", computerLabUpdates: "20 new computers", scienceLabUpdates: "New chem lab equipment", otherImprovements: "Smart boards in 6 classes", challenges: "Math teacher shortage", teacherRequirements: "2 Math, 1 Science teacher", infrastructureRequirements: "Playground equipment", additionalNotes: "Need computer lab expansion", status: "Approved", submittedDate: "2025-05-28" },
  { id: 3, schoolId: 1, schoolName: "Saraswati Sishu Mandir Bhubaneswar", month: "June", year: "2025", totalStudents: 1260, newAdmissions: 32, studentsLeft: 8, tcIssued: 5, studentGrowthPercent: 1.0, passPercentage: 94.8, firstDivision: 318, distinction: 202, topPerformers: "Bibhuti P (96%), Chinmaya S (95%)", prevYearComparison: "+2.5% vs Jun 2024", medhabrutiQualified: 26, olympiadQualified: 9, ntseQualified: 6, stateRankHolders: 3, nationalRankHolders: 1, sportsAchievements: "District Kabaddi champions", debateCompetitions: "Quiz competition winners", scienceExhibitions: "Science fair 1st prize", culturalPrograms: "Summer camp conducted", specialEvents: "Environment Day", newClassrooms: 0, libraryDevelopment: "Reading corner upgraded", computerLabUpdates: "New software installed", scienceLabUpdates: "Lab maintenance done", otherImprovements: "Staff room renovated", challenges: "Bus route issues", teacherRequirements: "1 Computer teacher", infrastructureRequirements: "Bus maintenance", additionalNotes: "Summer camp successful", status: "Approved", submittedDate: "2025-06-27" },
  // ─── Cuttack (schoolId: 2) ───
  { id: 4, schoolId: 2, schoolName: "Saraswati Sishu Mandir Cuttack", month: "April", year: "2025", totalStudents: 960, newAdmissions: 35, studentsLeft: 4, tcIssued: 2, studentGrowthPercent: 3.6, passPercentage: 90.1, firstDivision: 240, distinction: 148, topPerformers: "Priya S (95%), Rohit K (94%)", prevYearComparison: "+1.5% vs Apr 2024", medhabrutiQualified: 14, olympiadQualified: 4, ntseQualified: 3, stateRankHolders: 1, nationalRankHolders: 0, sportsAchievements: "Football tournament winners", debateCompetitions: "District debate - 3rd", scienceExhibitions: "2 projects selected", culturalPrograms: "Foundation Day celebrated", specialEvents: "Parent-Teacher meet", newClassrooms: 2, libraryDevelopment: "100 new books", computerLabUpdates: "5 new computers", scienceLabUpdates: "Lab equipment repaired", otherImprovements: "Classroom furniture", challenges: "Lab space constraint", teacherRequirements: "1 Science teacher", infrastructureRequirements: "Lab expansion needed", additionalNotes: "PT meet was successful", status: "Submitted", submittedDate: "2025-04-25" },
  { id: 5, schoolId: 2, schoolName: "Saraswati Sishu Mandir Cuttack", month: "May", year: "2025", totalStudents: 980, newAdmissions: 142, studentsLeft: 6, tcIssued: 4, studentGrowthPercent: 2.1, passPercentage: 91.2, firstDivision: 255, distinction: 160, topPerformers: "Rohit K (95.5%), Priya S (94.8%)", prevYearComparison: "+2.0% vs May 2024", medhabrutiQualified: 18, olympiadQualified: 5, ntseQualified: 4, stateRankHolders: 2, nationalRankHolders: 0, sportsAchievements: "Athletics - 2 gold, 3 silver", debateCompetitions: "Quiz - inter-school 1st", scienceExhibitions: "3 projects", culturalPrograms: "Cultural fest conducted", specialEvents: "Science Day", newClassrooms: 0, libraryDevelopment: "Digital library setup", computerLabUpdates: "Internet upgraded", scienceLabUpdates: "New microscopes", otherImprovements: "Playground equipment", challenges: "Electricity fluctuation", teacherRequirements: "1 English teacher", infrastructureRequirements: "Stabilizer needed", additionalNotes: "Digital library inaugurated", status: "Under Review", submittedDate: "2025-05-26" },
  // ─── Puri (schoolId: 3) ───
  { id: 6, schoolId: 3, schoolName: "Saraswati Sishu Mandir Puri", month: "April", year: "2025", totalStudents: 710, newAdmissions: 28, studentsLeft: 3, tcIssued: 2, studentGrowthPercent: 3.9, passPercentage: 87.5, firstDivision: 178, distinction: 102, topPerformers: "Sushant P (92%), Laxmi R (91%)", prevYearComparison: "+1.2% vs Apr 2024", medhabrutiQualified: 10, olympiadQualified: 2, ntseQualified: 2, stateRankHolders: 1, nationalRankHolders: 0, sportsAchievements: "Swimming competition winners", debateCompetitions: "Elocution - district 2nd", scienceExhibitions: "1 project", culturalPrograms: "Temple visit educational trip", specialEvents: "Guru Purnima", newClassrooms: 1, libraryDevelopment: "50 new books", computerLabUpdates: "2 computers added", scienceLabUpdates: "Basic equipment", otherImprovements: "Drinking water facility", challenges: "Coastal weather issues", teacherRequirements: "1 Sanskrit teacher", infrastructureRequirements: "Building repair needed", additionalNotes: "Educational trip organized", status: "Submitted", submittedDate: "2025-04-27" },
  { id: 7, schoolId: 3, schoolName: "Saraswati Sishu Mandir Puri", month: "May", year: "2025", totalStudents: 720, newAdmissions: 98, studentsLeft: 5, tcIssued: 3, studentGrowthPercent: 1.4, passPercentage: 88.6, firstDivision: 185, distinction: 108, topPerformers: "Sushant P (93%), Laxmi R (92%)", prevYearComparison: "+1.8% vs May 2024", medhabrutiQualified: 12, olympiadQualified: 3, ntseQualified: 2, stateRankHolders: 1, nationalRankHolders: 0, sportsAchievements: "District swimming gold", debateCompetitions: "Debate - 2nd place", scienceExhibitions: "2 projects", culturalPrograms: "Ratha Yatra celebration", specialEvents: "Parent orientation", newClassrooms: 0, libraryDevelopment: "Books purchased", computerLabUpdates: "Software upgrade", scienceLabUpdates: "Lab consumables", otherImprovements: "Fan and light repair", challenges: "Student attendance dip", teacherRequirements: "1 Math teacher", infrastructureRequirements: "Classroom fans needed", additionalNotes: "Ratha Yatra celebrated", status: "Submitted", submittedDate: "2025-05-25" },
  // ─── Rourkela (schoolId: 4) ───
  { id: 8, schoolId: 4, schoolName: "Saraswati Sishu Mandir Rourkela", month: "April", year: "2025", totalStudents: 840, newAdmissions: 30, studentsLeft: 5, tcIssued: 3, studentGrowthPercent: 3.6, passPercentage: 85.2, firstDivision: 195, distinction: 110, topPerformers: "Manoj S (91%), Rina P (90%)", prevYearComparison: "+0.8% vs Apr 2024", medhabrutiQualified: 8, olympiadQualified: 3, ntseQualified: 2, stateRankHolders: 0, nationalRankHolders: 0, sportsAchievements: "Hockey tournament participation", debateCompetitions: "District debate participation", scienceExhibitions: "1 project", culturalPrograms: "Industrial visit", specialEvents: "Career counseling session", newClassrooms: 1, libraryDevelopment: "Library renovation", computerLabUpdates: "5 computers", scienceLabUpdates: "Basic lab setup", otherImprovements: "Parking area developed", challenges: "Industrial area noise", teacherRequirements: "1 Computer teacher", infrastructureRequirements: "Soundproofing needed", additionalNotes: "Career counseling done", status: "Under Review", submittedDate: "2025-04-26" },
  { id: 9, schoolId: 4, schoolName: "Saraswati Sishu Mandir Rourkela", month: "May", year: "2025", totalStudents: 850, newAdmissions: 115, studentsLeft: 8, tcIssued: 5, studentGrowthPercent: 1.2, passPercentage: 86.3, firstDivision: 202, distinction: 115, topPerformers: "Manoj S (92%), Rina P (91%)", prevYearComparison: "+1.5% vs May 2024", medhabrutiQualified: 9, olympiadQualified: 4, ntseQualified: 2, stateRankHolders: 1, nationalRankHolders: 0, sportsAchievements: "Inter-school hockey - 3rd", debateCompetitions: "Quiz - 3rd place", scienceExhibitions: "2 projects", culturalPrograms: "Annual sports day", specialEvents: "Parent-teacher meet", newClassrooms: 0, libraryDevelopment: "New books 150", computerLabUpdates: "Internet upgrade", scienceLabUpdates: "Lab maintenance", otherImprovements: "School painting", challenges: "Teacher attendance", teacherRequirements: "1 Science teacher", infrastructureRequirements: "Lab equipment needed", additionalNotes: "Sports day successful", status: "Under Review", submittedDate: "2025-05-27" },
  // ─── Sambalpur (schoolId: 5) ───
  { id: 10, schoolId: 5, schoolName: "Saraswati Sishu Mandir Sambalpur", month: "April", year: "2025", totalStudents: 650, newAdmissions: 22, studentsLeft: 3, tcIssued: 2, studentGrowthPercent: 3.3, passPercentage: 89.2, firstDivision: 165, distinction: 95, topPerformers: "Anil B (94%), Sunita K (93%)", prevYearComparison: "+2.0% vs Apr 2024", medhabrutiQualified: 12, olympiadQualified: 5, ntseQualified: 3, stateRankHolders: 2, nationalRankHolders: 0, sportsAchievements: "Kabaddi district champions", debateCompetitions: "Debate - 1st place", scienceExhibitions: "3 projects", culturalPrograms: "Nuakhai celebration", specialEvents: "Health checkup camp", newClassrooms: 1, libraryDevelopment: "100 new books", computerLabUpdates: "New software lab", scienceLabUpdates: "Equipment upgraded", otherImprovements: "Garden developed", challenges: "Bus facility needed", teacherRequirements: "1 English teacher", infrastructureRequirements: "School bus needed", additionalNotes: "Health camp successful", status: "Approved", submittedDate: "2025-04-28" },
  { id: 11, schoolId: 5, schoolName: "Saraswati Sishu Mandir Sambalpur", month: "May", year: "2025", totalStudents: 660, newAdmissions: 82, studentsLeft: 4, tcIssued: 3, studentGrowthPercent: 1.5, passPercentage: 90.1, firstDivision: 172, distinction: 100, topPerformers: "Anil B (95%), Sunita K (94%)", prevYearComparison: "+2.5% vs May 2024", medhabrutiQualified: 14, olympiadQualified: 6, ntseQualified: 4, stateRankHolders: 2, nationalRankHolders: 0, sportsAchievements: "Athletics - 4 gold", debateCompetitions: "Debate state-level - 2nd", scienceExhibitions: "3 projects selected", culturalPrograms: "Nuakhai celebration", specialEvents: "Science exhibition", newClassrooms: 0, libraryDevelopment: "Digital section", computerLabUpdates: "New computers 5", scienceLabUpdates: "Lab upgraded", otherImprovements: "Water purifier installed", challenges: "Playground space", teacherRequirements: "1 PE teacher", infrastructureRequirements: "Playground development", additionalNotes: "Exhibition was a success", status: "Approved", submittedDate: "2025-05-29" },
  // ─── Balasore (schoolId: 6) ───
  { id: 12, schoolId: 6, schoolName: "Saraswati Sishu Mandir Balasore", month: "April", year: "2025", totalStudents: 585, newAdmissions: 18, studentsLeft: 4, tcIssued: 2, studentGrowthPercent: 3.0, passPercentage: 83.5, firstDivision: 135, distinction: 72, topPerformers: "Basant R (90%), Sweta M (89%)", prevYearComparison: "+0.5% vs Apr 2024", medhabrutiQualified: 6, olympiadQualified: 2, ntseQualified: 1, stateRankHolders: 0, nationalRankHolders: 0, sportsAchievements: "Cricket tournament - semi", debateCompetitions: "Debate participation", scienceExhibitions: "1 project", culturalPrograms: "Annual picnic", specialEvents: "Award ceremony", newClassrooms: 1, libraryDevelopment: "Books added 80", computerLabUpdates: "2 computers", scienceLabUpdates: "Basic setup", otherImprovements: "Toilet renovation", challenges: "Flood risk area", teacherRequirements: "2 teachers needed", infrastructureRequirements: "Flood protection needed", additionalNotes: "Award ceremony held", status: "Submitted", submittedDate: "2025-04-24" },
  { id: 13, schoolId: 6, schoolName: "Saraswati Sishu Mandir Balasore", month: "May", year: "2025", totalStudents: 590, newAdmissions: 71, studentsLeft: 6, tcIssued: 4, studentGrowthPercent: 0.9, passPercentage: 84.7, firstDivision: 140, distinction: 78, topPerformers: "Basant R (90.5%), Sweta M (89.5%)", prevYearComparison: "+1.0% vs May 2024", medhabrutiQualified: 7, olympiadQualified: 2, ntseQualified: 2, stateRankHolders: 0, nationalRankHolders: 0, sportsAchievements: "Cricket - district semi", debateCompetitions: "Quiz competition", scienceExhibitions: "2 projects", culturalPrograms: "Summer camp", specialEvents: "PT meeting", newClassrooms: 0, libraryDevelopment: "Reading program", computerLabUpdates: "Software installed", scienceLabUpdates: "Lab supplies", otherImprovements: "Boundary wall repair", challenges: "Coastal erosion", teacherRequirements: "1 Math teacher", infrastructureRequirements: "Boundary wall needed", additionalNotes: "Summer camp conducted", status: "Submitted", submittedDate: "2025-05-24" },
];

// ─── Teacher Assignment ───
export interface TeacherAssignment {
  id: number;
  schoolId: number;
  teacherName: string;
  class: string;
  section: string;
  subject: string;
  isClassTeacher: boolean;
  academicYear: string;
}

export const teacherAssignments: TeacherAssignment[] = [
  { id: 1, schoolId: 1, teacherName: "Dr. Rajendra Mohapatra", class: "10", section: "A", subject: "Mathematics", isClassTeacher: true, academicYear: "2025-26" },
  { id: 2, schoolId: 1, teacherName: "Dr. Rajendra Mohapatra", class: "10", section: "B", subject: "Mathematics", isClassTeacher: false, academicYear: "2025-26" },
  { id: 3, schoolId: 1, teacherName: "Dr. Rajendra Mohapatra", class: "9", section: "A", subject: "Mathematics", isClassTeacher: false, academicYear: "2025-26" },
  { id: 4, schoolId: 1, teacherName: "Dr. Rajendra Mohapatra", class: "9", section: "B", subject: "Mathematics", isClassTeacher: false, academicYear: "2025-26" },
  { id: 5, schoolId: 1, teacherName: "Smt. Laxmi Panda", class: "10", section: "A", subject: "Science", isClassTeacher: false, academicYear: "2025-26" },
  { id: 6, schoolId: 1, teacherName: "Smt. Laxmi Panda", class: "10", section: "B", subject: "Science", isClassTeacher: true, academicYear: "2025-26" },
  { id: 7, schoolId: 1, teacherName: "Sri. Pramod Das", class: "9", section: "A", subject: "Social Studies", isClassTeacher: true, academicYear: "2025-26" },
  { id: 8, schoolId: 1, teacherName: "Sri. Manoj Sahoo", class: "9", section: "B", subject: "English", isClassTeacher: false, academicYear: "2025-26" },
  { id: 9, schoolId: 1, teacherName: "Sri. Manoj Sahoo", class: "10", section: "A", subject: "English", isClassTeacher: false, academicYear: "2025-26" },
  { id: 10, schoolId: 1, teacherName: "Dr. Anil Behera", class: "10", section: "B", subject: "Chemistry", isClassTeacher: false, academicYear: "2025-26" },
  { id: 11, schoolId: 2, teacherName: "Sri. Basant Rout", class: "10", section: "A", subject: "Physics", isClassTeacher: true, academicYear: "2025-26" },
  { id: 12, schoolId: 2, teacherName: "Smt. Sukanti Nayak", class: "9", section: "A", subject: "Biology", isClassTeacher: true, academicYear: "2025-26" },
];

export const academicYears = ["2024-25", "2025-26", "2026-27"];
export const classOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const sectionOptions = ["A", "B", "C"];
export const subjectOptions = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Sanskrit", "Computer Science", "Physics", "Chemistry", "Biology", "Economics", "History", "Geography", "Physical Education"];

export const schoolAnalyticsData = {
  monthlyAdmissions: [
    { month: "Apr", value: 42 }, { month: "May", value: 185 }, { month: "Jun", value: 32 },
    { month: "Jul", value: 28 }, { month: "Aug", value: 15 }, { month: "Sep", value: 0 },
  ],
  monthlyPassPercent: [
    { month: "Apr", value: 93.2 }, { month: "May", value: 94.5 }, { month: "Jun", value: 94.8 },
    { month: "Jul", value: 0 }, { month: "Aug", value: 0 }, { month: "Sep", value: 0 },
  ],
  scholarshipTrend: [
    { month: "Apr", medhabruti: 18, olympiad: 6 },
    { month: "May", medhabruti: 24, olympiad: 8 },
    { month: "Jun", medhabruti: 26, olympiad: 9 },
  ],
  studentStrength: [
    { month: "Apr", value: 1230 }, { month: "May", value: 1248 }, { month: "Jun", value: 1260 },
  ],
};

export interface Exam {
  id: string;
  schoolId: string;
  examName: string;
  academicSession: string;
  classes: {
    [className: string]: {
      subjects: string[];
      maxMarks: number;
      assignedTeacherId?: string;
    }
  };
  createdDate: string;
}

export interface StudentMarksRecord {
  id: string;
  schoolId: string;
  examId: string;
  studentId: string;
  studentName: string;
  className: string;
  subjectMarks: {
    [subjectName: string]: number;
  };
  totalObtained: number;
  percentage: number;
  remarks?: string;
  rank?: number;
  submittedBy: string;
  submittedDate: string;
}
