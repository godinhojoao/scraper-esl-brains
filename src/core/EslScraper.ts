import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio'
import { v4 as uuidv4 } from 'uuid'

import { PartialPost } from '../contracts/PartialPost'
import { PostDownloadLink } from '../contracts/PostDownloadLinks'
import { loadUrlData } from './utils/loadUrlData'

export class EslScraper {
  URL: string

  constructor (
    private currentPage: number,
    private readonly currentPlan?: string
  ) {
    this.currentPlan = currentPlan || 'free-english-lesson-plans'
    this.URL = `https://eslbrains.com/lesson/page/${this.currentPage}?ep_filter_lesson_plan=${this.currentPlan}`
  }

  public async loadPage (): Promise<CheerioAPI> {
    const body = await loadUrlData(this.URL)
    const $ = cheerio.load(body)
    return $
  }

  public async loadNextPage (): Promise<CheerioAPI> {
    this.currentPage += 1
    return await this.loadPage()
  }

  public async getAllCurrentPostsDownloadLinks (partialPostsInfos: PartialPost[]): Promise<PostDownloadLink[]> {
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

  public getPartialPostsInfos ($: CheerioAPI, postsElements: Cheerio<Element>): PartialPost[] {
    const partialPostsInfos: PartialPost[] = []
    postsElements.each((index, postElement) => {
      const postLevel = $(postElement)
        .find('.lesson-info-level')
        .first()
        .text()
        .trim()
        .substring(0, 2)
      const postCategory = $(postElement)
        .find('.btn.btn--orangenobg')
        .first()
        .text()
        .trim()
      const postContentLink = $(postElement)
        .find('.bottom_lesson_links .btn.btn--yellowbg')
        .attr('href')

      if (postLevel && postCategory && postContentLink) {
        const regexpToGetNameInsideURL = /https:\/\/eslbrains.com\/*/
        partialPostsInfos.push({
          id: uuidv4(),
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
