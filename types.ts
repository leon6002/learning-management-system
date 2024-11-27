import {
  Address,
  Course,
  GeoDict,
  Job,
  JobCategory,
  JobCourseRelation,
  SimpleCourse,
} from '@prisma/client';

interface RecommendCourse {
  id: string;
  courseId: string;
  categoryId: string;
  views: number;
  purchases: number;
  createdAt: Date;
  updatedAt: Date;
  course: Course;
}

export { type RecommendCourse };

export type JobDetail = Job & {
  jobCourseRelation: (JobCourseRelation & {
    simpleCourse: { id: string; title: string };
  })[];
  jobCategory: JobCategory | null;
  address:
    | (Address & {
        geoDictCity: { name: string };
        geoDictProvince: { name: string };
        geoDictDistrict: { name: string } | null;
      })
    | null;
};
