import { Post } from './Post'

export type PartialPost = Omit<Post, 'studentDownloadContentLink' | 'teacherDownloadContentLink' | 'eLessonDownloadContentLink'>
