const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

import Story from './Story'
import { dateToExtendedISODate } from 'aws-date-utils'


async function createStory(story: Story, username: string) {
  const storyData = { ...story, owner: username, publishedAt: dateToExtendedISODate(new Date())  }
  const params = {
    TableName: process.env.TABLE,
    Item: storyData,
    ConditionExpression: 'attribute_not_exists(slug)'
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