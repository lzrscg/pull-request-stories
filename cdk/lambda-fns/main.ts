import createStory from './createStory'
import deleteStory from './deleteStory'
import getStoryBySlug from './getStoryBySlug'
import listStories from './listStories'
import updateStory from './updateStory'
import storiesByUsername from './storiesByUsername'
import Story from './Story'

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     storySlug: string,
     story: Story
  },
  identity: {
    username: string
  }
}

exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getStoryById":
          return await getStoryBySlug(event.arguments.storySlug)
        case "createStory": {
          const { username } = event.identity
          return await createStory(event.arguments.story, username)
        }
        case "listStories":
          return await listStories();
        case "deleteStory": {
          const { username } = event.identity
          return await deleteStory(event.arguments.storySlug, username)
        }
        case "updateStory": {
          const { username } = event.identity
          return await updateStory(event.arguments.story, username)
        }
        case "storiesByUsername": {
          const { username } = event.identity
          return await storiesByUsername(username)
        }
        default:
          return null
    }
}