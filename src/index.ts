import request from 'request'
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio'
import { promisify } from 'util'
import { Post } from './contracts/Post'
import { PartialPost } from './contracts/PartialPost'

const CURRENT_PLAN = 'free-english-lesson-plans'
const CURRENT_PAGE = 1
const URL = `https://eslbrains.com/lesson/page/${CURRENT_PAGE}?ep_filter_lesson_plan=${CURRENT_PLAN}`

async function loadPageByUrl (url: any): Promise<any> {
  try {
    const requestPromise = promisify(request)
    const response = await requestPromise(url)
    return response.body
  } catch (error: any) {
    console.log('error', error)
    throw Error('Error loading page')
  }
}

(async function () {
  const body = await loadPageByUrl(URL)
  const $ = cheerio.load(body) // configs: { ignoreWhitespace: true }
  const postsElements = $('.latest_post_bottom')
  const lastPageNumber = $('.lesson-pages :nth-last-child(2)').text()

  if (!lastPageNumber) { return }
  const allPosts: Post[] = []

  for (let currentPage = 0; currentPage < parseInt(lastPageNumber); currentPage++) {
    const partialPostsInfos: PartialPost[] = getPartialPostsInfos($, postsElements)
    console.log('partialPostsInfos', partialPostsInfos)
    // const currentPostsInfos = getAllCurrentPostsDownloadLinks($, partialPostsInfos)
    // allPosts.push(...currentPostsInfos)
    if (currentPage < parseInt(lastPageNumber) - 1) {
      console.log('clicar no botao de next page')
    } else {
      console.log('parar')
    }
  }
})()

function getPartialPostsInfos ($: CheerioAPI, postsElements: Cheerio<Element>): PartialPost[] {
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
      partialPostsInfos.push({
        level: postLevel,
        category: postCategory,
        contentLink: postContentLink
      })
    }
  })
  return partialPostsInfos
}

function getAllCurrentPostsDownloadLinks ($: CheerioAPI, partialPostsInfos: PartialPost[]): any[] {
  // arrumar esse foreach pra ser assincrono, com foreach normal nao vai funcionar
  partialPostsInfos.forEach(value => {
    // 1. entrar nesse link: value.contentLink
    // 2. pegar os links daqui:
    // student: .btn--elesson.btn--student
    // teacher: .btn--elesson.btn--teacher
    // elesson: .btn.btn--darkbg.btn--elesson
    // 3. salvar isso no array e retornar
  })

  return []
}
