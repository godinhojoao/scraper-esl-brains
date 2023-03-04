import { Post } from './contracts/Post'
import { ExistentPlans } from './contracts/ExistentPlans'
import { EslScraper } from './core/EslScraper'
import { FileHandler } from './core/FileHandler'
import { isEmptyArray } from './core/utils/isEmptyArray'
import { logCurrentProgressPercentage } from './core/utils/logCurrentProgressPercentage'
import secrets from './../secrets.json'

(async function () {
  const eslScraper = new EslScraper(secrets.currentPlan as ExistentPlans, secrets.token)
  let lastPageNumber = 999
  const allPosts: Post[] = []

  for (let currentPageNumber = 1; currentPageNumber <= lastPageNumber; currentPageNumber++) {
    await eslScraper.loadAndSetPage(currentPageNumber)
    if (lastPageNumber === 999) {
      const pageNumber = eslScraper.currentCheerioDOM?.('.lesson-pages :nth-last-child(2)')?.text() || '1'
      lastPageNumber = parseInt(pageNumber)
    }
    logCurrentProgressPercentage('Loaded pages progress', currentPageNumber, lastPageNumber)

    const postsElements = eslScraper.currentCheerioDOM?.('.latest_post_bottom')
    if (!postsElements) { continue }
    const postsInfos = await eslScraper.getPostsInfos(postsElements)
    if (isEmptyArray(postsInfos)) { continue }
    allPosts.push(...postsInfos)
  }
  console.log(`Starting to download files from ${allPosts.length} posts!`)
  const responseMessage = await FileHandler.downloadPostsContentsFiles(allPosts)
  console.log(responseMessage)
})()
