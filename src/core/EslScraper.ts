import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio'
import { v4 as uuidv4 } from 'uuid'
import { ExistentPlans } from '../contracts/ExistentPlans'

import { PartialPost } from '../contracts/PartialPost'
import { Post } from '../contracts/Post'
import { PostDownloadLink } from '../contracts/PostDownloadLinks'
import { isEmptyArray } from './utils/isEmptyArray'
import { loadUrlData } from './utils/loadUrlData'
import { mergePostInfos } from './utils/mergePostInfos'

export class EslScraper {
  currentCheerioDOM?: CheerioAPI;
  headers?: any;

  constructor (
    private readonly currentPlan?: ExistentPlans,
    private readonly token?: string
  ) {
    this.currentPlan = currentPlan || 'free-english-lesson-plans'
    if (this.token && currentPlan !== 'free-english-lesson-plans') {
      this.headers = {
        authority: 'eslbrains.com',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        cookie: token,
        pragma: 'no-cache',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin'
      }
    }
  }

  public async loadAndSetPage (currentPageNumber: number): Promise<CheerioAPI> {
    const URL = `https://eslbrains.com/lesson/page/${currentPageNumber}?ep_filter_lesson_plan=${this.currentPlan}`
    const body = await loadUrlData(URL, { headers: this.headers || {} })
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
    const loadAllPostsPagesPromises = partialPostsInfos.map(post => loadUrlData(post.contentLink, { headers: this.headers || {} }))
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
