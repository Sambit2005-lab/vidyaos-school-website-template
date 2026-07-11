import { SchoolWebsiteView } from "@/components/school-admin/SchoolWebsiteView";
import { fetchSchoolConfig } from "@/lib/firestoreService";

// Server-side dynamic metadata rendering for search engine crawlers
export async function generateMetadata() {
  const schoolId = process.env.VITE_SCHOOL_ID || "school-1";
  const tenantId = process.env.VITE_TENANT_ID || "demo-tenant";
  
  try {
    const schoolConfig = await fetchSchoolConfig(tenantId, schoolId);
    if (schoolConfig) {
      return {
        title: `${schoolConfig.nameEn || "Saraswati Shishu Mandir"} - Admissions & Portal`,
        description: `Official website of ${schoolConfig.nameEn || "Saraswati Shishu Mandir"}. View exam results, submit admissions, and check notices.`,
      };
    }
  } catch (e) {
    console.error("Metadata resolution error:", e);
  }
  
  return {
    title: "Saraswati Shishu Mandir - Admissions & Portal",
    description: "Welcome to the Bilingual School ERP & Admission Portal.",
  };
}

export default async function Page() {
  const schoolId = process.env.VITE_SCHOOL_ID || "school-1";
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <SchoolWebsiteView schoolId={schoolId} />
    </div>
  );
}
