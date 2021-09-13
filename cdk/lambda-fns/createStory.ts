const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
import Story from './Story'

async function createStory(story: Story, username: string) {
  const storyData = { ...story, owner: username }
  const params = {
    TableName: process.env.TABLE,
    Item: storyData
  }
  try {
    await docClient.put(params).promise()
    return storyData
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default createStory