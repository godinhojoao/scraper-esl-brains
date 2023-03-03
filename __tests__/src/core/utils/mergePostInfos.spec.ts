import { mergePostInfos } from './../../../../src/core/utils/mergePostInfos'
import partialPosts from '../../../mocks/partialPosts.json'
import postDownloadLinks from './../../../mocks/postDownloadLinks.json'

describe('mergePostInfos', () => {
  test('Given post array should return merged posts', () => {
    const mergedPosts = mergePostInfos(partialPosts, postDownloadLinks)
    expect(mergedPosts).toEqual([
      {
        category: "Business",
        contentLink: "https://eslbrains.com/career-choice/",
        eLessonDownloadContentLink: "https://docs.google.com/presentation/d/1io31eX1gsV1LSGOB6Q5_6ds-wBiuki8zNxXZ3DB4U1E/edit?usp=drivesdk",
        id: "9d038f70-6d0d-4468-810f-034112df108d",
        level: "B2",
        name: "career-choice",
        postId: "9d038f70-6d0d-4468-810f-034112df108d",
        studentDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Career-choice-SV-9957.pdf",
        teacherDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Career-choice-TV-9957.pdf",
      },
      {
        category: "Business",
        contentLink: "https://eslbrains.com/talking-about-professions/",
        eLessonDownloadContentLink: "https://docs.google.com/presentation/d/10A8kY31gl3HaaM2-HFXvyvbp6y6TEDIdYD57H2tPsLI/edit?usp=drivesdk",
        id: "8ba178d6-d711-4fdb-8796-6e16d5cc743e",
        level: "A2",
        name: "talking-about-professions",
        postId: "8ba178d6-d711-4fdb-8796-6e16d5cc743e",
        studentDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Talking-about-professions-SV-8033-1.pdf",
        teacherDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Talking-about-professions-TV-8033-1.pdf",
      }
    ]);
  });

  test('Given empty arrays should return empty array', () => {
    const mergedPosts = mergePostInfos([], [])
    expect(mergedPosts).toEqual([]);
  });

  test('Given null values should return empty array', () => {
    // @ts-ignore
    const mergedPosts = mergePostInfos(null, null)
    expect(mergedPosts).toEqual([]);
  });

  test('Given partial posts values and not same length of download links should return only merged post', () => {
    delete postDownloadLinks[1]
    const mergedPosts = mergePostInfos(partialPosts, postDownloadLinks)
    expect(mergedPosts).toEqual([
      {
        category: "Business",
        contentLink: "https://eslbrains.com/career-choice/",
        eLessonDownloadContentLink: "https://docs.google.com/presentation/d/1io31eX1gsV1LSGOB6Q5_6ds-wBiuki8zNxXZ3DB4U1E/edit?usp=drivesdk",
        id: "9d038f70-6d0d-4468-810f-034112df108d",
        level: "B2",
        name: "career-choice",
        postId: "9d038f70-6d0d-4468-810f-034112df108d",
        studentDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Career-choice-SV-9957.pdf",
        teacherDownloadContentLink: "https://eslbrains.com/wp-content/uploads/2022/10/ESL-Brains-Career-choice-TV-9957.pdf",
      }
    ]);
  });
})
