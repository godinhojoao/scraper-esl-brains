import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'

import { Post } from '../contracts/Post'
import { PostFiles } from '../contracts/PostFiles'
import { loadUrlData } from './utils/loadUrlData'

export class FileHandler {
  static async downloadPostsContentsFiles (allPosts: Post[]): Promise<string> {
    try {
      const postsFolderPath = path.join(__dirname, '..', '..', 'POSTS')
      for (const post of allPosts) {
        const postFiles = this.createFolderStructureIfNotExists(post, postsFolderPath)
        const hasAllPostFiles = !(postFiles && postFiles.studentContentFile && postFiles.teacherContentFile)
        if (hasAllPostFiles) { continue }
        if (postFiles.studentContentFile) {
          const studentContentToDownloadResponse = await loadUrlData(post.studentDownloadContentLink, 'stream')
          studentContentToDownloadResponse.pipe(postFiles.studentContentFile)
        }
        if (postFiles.teacherContentFile) {
          const teacherContentToDownloadResponse = await loadUrlData(post.teacherDownloadContentLink, 'stream')
          teacherContentToDownloadResponse.pipe(postFiles.teacherContentFile)
        }
      }
      await this.zipPostsFolder(postsFolderPath)
      return 'Download finished'
    } catch (error) {
      console.log('error', error)
      throw Error('Error installing post files')
    }
  }

  static createFolderStructureIfNotExists (post: Post, intialFolderPath: string): PostFiles {
    if (!fs.existsSync(intialFolderPath)) { fs.mkdirSync(intialFolderPath) }
    const currentLevelFolder = path.join(intialFolderPath, post.level)
    if (!fs.existsSync(currentLevelFolder)) { fs.mkdirSync(currentLevelFolder) }
    const currentCategoryFolder = path.join(currentLevelFolder, post.category)
    if (!fs.existsSync(currentCategoryFolder)) { fs.mkdirSync(currentCategoryFolder) }
    const studentFilePath = path.join(currentCategoryFolder, `student-${post.name}.pdf`)
    const teacherFilePath = path.join(currentCategoryFolder, `teacher-${post.name}.pdf`)
    let studentContentFile
    let teacherContentFile
    if (!fs.existsSync(studentFilePath)) { studentContentFile = fs.createWriteStream(studentFilePath) }
    if (!fs.existsSync(teacherFilePath)) { teacherContentFile = fs.createWriteStream(teacherFilePath) }
    return { studentContentFile, teacherContentFile }
  }

  static async zipPostsFolder (postsFolderPath: string): Promise<void> {
    const zip = new AdmZip()
    zip.addLocalFolder(postsFolderPath)
    await zip.writeZipPromise(postsFolderPath + '.zip')
  }
}
