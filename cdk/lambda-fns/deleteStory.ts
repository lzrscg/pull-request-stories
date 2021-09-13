const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteStory(storySlug: string, username: string) {
  const params = {
    TableName: process.env.TABLE,
    Key: {
      slug: storySlug
    },
    ConditionExpression: "#owner = :owner",
    ExpressionAttributeNames: {
      "#owner": "owner"
    },
    ExpressionAttributeValues: {
      ':owner' : username
    }
};
  try {
    await docClient.delete(params).promise()
    return storySlug
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default deleteStory;