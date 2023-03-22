import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio'
import { randomUUID } from 'crypto'
import { PartialPost } from '../contracts/PartialPost'
import { Post } from '../contracts/Post'
import { PostDownloadLink } from '../contracts/PostDownloadLinks'
import { isEmptyArray } from './utils/isEmptyArray'
import { loadUrlData } from './utils/loadUrlData'
import { mergePostInfos } from './utils/mergePostInfos'
import secrets from './../../secrets.json'

export class EslScraper {
  public currentCheerioDOM?: CheerioAPI;
  public async loadAndSetPage (currentPageNumber: number): Promise<CheerioAPI> {
    const URL = `https://eslbrains.com/lesson/page/${currentPageNumber}?ep_filter_lesson_plan=${secrets.currentPlan}`
    const body = await loadUrlData(URL)
    const $ = cheerio.load(body)
    this.currentCheerioDOM = $
    return $
  }

  public async getPostsInfos (postsElements: Cheerio<Element>): Promise<Post[]> {
    const partialInfos: PartialPost[] = this.getPartialPostsInfos(postsElements) || []
    if (isEmptyArray((partialInfos))) { return [] }
    const downloadLinks = await this.getAllCurrentPostsDownloadLinks(partialInfos)
    if (isEmptyArray(downloadLinks)) { return [] }
    const postsInfos = mergePostInfos(partialInfos, downloadLinks)
    return postsInfos
  }

  private async getAllCurrentPostsDownloadLinks (partialPostsInfos: PartialPost[]): Promise<PostDownloadLink[]> {
    const loadAllPostsPagesPromises = partialPostsInfos.map(post => loadUrlData(post.contentLink))
    const allPostsPages = await Promise.all(loadAllPostsPagesPromises)
    const allPostsDownloadLinks: PostDownloadLink[] = []
    allPostsPages
      .forEach((postPage, currentPost) => {
        const $ = cheerio.load(postPage)
        const studentDownloadContentLink = $(".btn--elesson.btn--student:contains('student')").first().attr('href')
        const teacherDownloadContentLink = $(".btn--elesson.btn--teacher:contains('teacher')").first().attr('href')
        const eLessonDownloadContentLink = $(".btn.btn--darkbg.btn--elesson:contains('e-lesson plan')").first().attr('href')
        if (studentDownloadContentLink && teacherDownloadContentLink) {
          allPostsDownloadLinks.push({
            postId: partialPostsInfos[currentPost].id,
            studentDownloadContentLink,
            teacherDownloadContentLink,
            eLessonDownloadContentLink
          })
        }
      })
    return allPostsDownloadLinks
  }

  private getPartialPostsInfos (postsElements: Cheerio<Element>): PartialPost[] | void {
    if (!this.currentCheerioDOM) { return }
    const partialPostsInfos: PartialPost[] = []
    postsElements.each((index, postElement) => {
      const postLevel = this.currentCheerioDOM?.(postElement)
        .find('.lesson-info-level')
        .first()
        .text()
        .trim()
        .substring(0, 2)
      const postCategory = this.currentCheerioDOM?.(postElement)
        .find('.btn.btn--orangenobg')
        .first()
        .text()
        .trim()
      const postContentLink = this.currentCheerioDOM?.(postElement)
        .find('.bottom_lesson_links .btn.btn--yellowbg')
        .attr('href')

      if (postLevel && postCategory && postContentLink) {
        const regexpToGetNameInsideURL = /https:\/\/eslbrains.com\/*/
        partialPostsInfos.push({
          id: randomUUID(),
          name: postContentLink.replace(regexpToGetNameInsideURL, '').replace('/', ''),
          level: postLevel,
          category: postCategory,
          contentLink: postContentLink
        })
      }
    })
    return partialPostsInfos
  }
}
