import { getCourseByIdService } from "@/src/service/course.service";
import DashboardCourseStudentPageComponent from "./components/DashboardCourseStudentPageComponent";

const DashboardCoursePage = async ({params}: {
  params : Promise<{ courseId : string }>
}) => {
  const {courseId} = await params;

  const selectedCourse = await getCourseByIdService(parseInt(courseId));
  return <DashboardCourseStudentPageComponent courseData={selectedCourse!} />;
};

export default DashboardCoursePage;
