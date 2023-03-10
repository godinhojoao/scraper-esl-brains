export interface Post {
  id: string;
  level: string;
  category: string;
  contentLink: string;
  name: string;
  teacherDownloadContentLink: string;
  studentDownloadContentLink: string;
  eLessonDownloadContentLink?: string;
}
