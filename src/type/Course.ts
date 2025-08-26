type Course = {
  id: number;
  title: string;
  description: string;  
  instructor: string;
  duration: number;
  level: string;
  category: string;
  thumbnail: string;
  students: number;
  lessons: Lesson[];
};

export type Lesson = {
  id: number;
  title: string;
  duration: number;
  videoUrl: string;
  isCompleted: boolean;
  index: number;
};

export default Course;
