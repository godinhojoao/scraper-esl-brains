import { Post } from './contracts/Post'
import { PartialPost } from './contracts/PartialPost'
import { EslScraper } from './core/EslScraper'
import { FileHandler } from './core/FileHandler'
import { mergePostInfos } from './core/utils/mergePostInfos'

(async function () {
  const eslScraper = new EslScraper(1)
  let lastPageNumber = 999
  const allPosts: Post[] = []

  for (let currentPage = 1; currentPage <= lastPageNumber; currentPage++) {
    const $ = await eslScraper.loadPage()
    if (lastPageNumber === 999) { lastPageNumber = parseInt($('.lesson-pages :nth-last-child(2)').text() || '1') }
    const pageProgressString = `${currentPage}/${lastPageNumber}`
    console.log(`Page ${pageProgressString} loaded!`)
    const postsElements = $('.latest_post_bottom')

    const partialPostsInfos: PartialPost[] = eslScraper.getPartialPostsInfos($, postsElements)
    if (!(partialPostsInfos && partialPostsInfos.length)) { continue }

    const currentPostsDownloadLinks = await eslScraper.getAllCurrentPostsDownloadLinks(partialPostsInfos)
    if (!(currentPostsDownloadLinks && currentPostsDownloadLinks.length)) { continue }

    allPosts.push(...mergePostInfos(partialPostsInfos, currentPostsDownloadLinks))
  }
  console.log(`Starting to download files from ${allPosts.length} posts!`)
  const responseMessage = await FileHandler.downloadPostsContentsFiles(allPosts)
  console.log(responseMessage)
})()

async function makePost (): Promise<any> {
  const partialPostsInfos: PartialPost[] = eslScraper.getPartialPostsInfos($, postsElements)
  if (!(partialPostsInfos && partialPostsInfos.length)) { continue }

  const currentPostsDownloadLinks = await eslScraper.getAllCurrentPostsDownloadLinks(partialPostsInfos)
  if (!(currentPostsDownloadLinks && currentPostsDownloadLinks.length)) { continue }
}
