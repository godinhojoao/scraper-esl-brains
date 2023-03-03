import { PartialPost } from '../../contracts/PartialPost'
import { Post } from '../../contracts/Post'
import { PostDownloadLink } from '../../contracts/PostDownloadLinks'
import { isEmptyArray } from './isEmptyArray'

export function mergePostInfos (partialPostsInfos: PartialPost[], postsDownloadLinks: PostDownloadLink[]): Post[] {
  if (isEmptyArray(partialPostsInfos) || isEmptyArray(postsDownloadLinks)) { return [] }
  const allPostsInfos: Post[] = []
  partialPostsInfos.forEach(partialPost => {
    postsDownloadLinks.forEach(postDownloadLink => {
      if (partialPost.id === postDownloadLink.postId) {
        allPostsInfos.push({ ...partialPost, ...postDownloadLink })
      }
    })
  })
  return allPostsInfos
}
