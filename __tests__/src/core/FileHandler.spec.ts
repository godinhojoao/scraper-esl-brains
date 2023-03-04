import mergedPosts from '../../mocks/mergedPosts.json'
import { FileHandler } from './../../../src/core/FileHandler'
import path from 'path'

describe('FileHandler', () => {

  // this is not working, i'm having an problem with axios and jest:
  /*
    Error:
    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation
  */
  describe('downloadPostsContentsFiles', () => {
    test('Given post should create and return teacher and students files', () => {
      const postsFolderPath = path.join(__dirname, '..', '..', 'POSTS')
      // const { studentContentFile, teacherContentFile } = FileHandler.createFolderStructureIfNotExists(mergedPosts[0], postsFolderPath)
      // expect(studentContentFile).toBe(null);
      // expect(teacherContentFile).toBe(null);
    });
  })
})
