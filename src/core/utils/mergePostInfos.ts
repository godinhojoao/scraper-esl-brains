import { PartialPost } from '../../contracts/PartialPost'
import { Post } from '../../contracts/Post'
import { PostDownloadLink } from '../../contracts/PostDownloadLinks'

export function mergePostInfos (partialPostsInfos: PartialPost[], postsDownloadLinks: PostDownloadLink[]): Post[] {
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
