import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'

import { Post } from '../contracts/Post'
import { PostFiles } from '../contracts/PostFiles'
import { logCurrentProgressPercentage } from './utils/logCurrentProgressPercentage'
import { loadUrlData } from './utils/loadUrlData'
import secrets from './../../secrets.json'

export class FileHandler {
  static async downloadPostsContentsFiles (allPosts: Post[]): Promise<string> {
    try {
      let downloadedPostsCount = 1
      const postsFolderPath = path.join(__dirname, '..', '..', 'POSTS')
      for (const post of allPosts) {
        const postFiles = this.createFolderStructureIfNotExists(post, postsFolderPath)
        const hasAllPostFiles = !(postFiles && postFiles.studentContentFile && postFiles.teacherContentFile)
        if (hasAllPostFiles) { continue }
        if (postFiles.studentContentFile) {
          const studentContentToDownloadResponse = await loadUrlData(post.studentDownloadContentLink, { responseType: 'stream' })
          studentContentToDownloadResponse.pipe(postFiles.studentContentFile)
        }
        if (postFiles.teacherContentFile) {
          const teacherContentToDownloadResponse = await loadUrlData(post.teacherDownloadContentLink, { responseType: 'stream' })
          teacherContentToDownloadResponse.pipe(postFiles.teacherContentFile)
        }
        if (postFiles.eLessonContentFile && post.eLessonDownloadContentLink) {
          postFiles.eLessonContentFile.write(post.eLessonDownloadContentLink)
        }
        downloadedPostsCount++
        logCurrentProgressPercentage('Downloaded posts progress', downloadedPostsCount, allPosts.length)
      }
      await this.zipPostsFolder(postsFolderPath)
      return 'Download finished'
    } catch (error) {
      console.log('error installing post files', error)
      throw Error('Error installing post files')
    }
  }

  static createFolderStructureIfNotExists (post: Post, intialFolderPath: string): PostFiles {
    if (!fs.existsSync(intialFolderPath)) { fs.mkdirSync(intialFolderPath) }
    const currentPlanFolder = path.join(intialFolderPath, secrets.currentPlan)
    if (!fs.existsSync(currentPlanFolder)) { fs.mkdirSync(currentPlanFolder) }
    const currentLevelFolder = path.join(currentPlanFolder, post.level)
    if (!fs.existsSync(currentLevelFolder)) { fs.mkdirSync(currentLevelFolder) }
    const currentCategoryFolder = path.join(currentLevelFolder, post.category)
    if (!fs.existsSync(currentCategoryFolder)) { fs.mkdirSync(currentCategoryFolder) }

    const studentFilePath = path.join(currentCategoryFolder, `${post.name}-student.pdf`)
    const teacherFilePath = path.join(currentCategoryFolder, `${post.name}-teacher.pdf`)
    let eLessonFilePath = null
    if (post.eLessonDownloadContentLink) { eLessonFilePath = path.join(currentCategoryFolder, `${post.name}-elesson.txt`) }

    let studentContentFile
    let teacherContentFile
    let eLessonContentFile
    if (!fs.existsSync(studentFilePath)) { studentContentFile = fs.createWriteStream(studentFilePath) }
    if (!fs.existsSync(teacherFilePath)) { teacherContentFile = fs.createWriteStream(teacherFilePath) }
    if (eLessonFilePath && !fs.existsSync(eLessonFilePath)) { eLessonContentFile = fs.createWriteStream(eLessonFilePath) }
    return { studentContentFile, teacherContentFile, eLessonContentFile }
  }

  static async zipPostsFolder (postsFolderPath: string): Promise<void> {
    const zip = new AdmZip()
    zip.addLocalFolder(postsFolderPath)
    await zip.writeZipPromise(postsFolderPath + '.zip')
  }
}
