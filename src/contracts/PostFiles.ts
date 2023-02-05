import fs from 'fs'

export interface PostFiles {
  studentContentFile?: fs.WriteStream;
  teacherContentFile?: fs.WriteStream;
}
