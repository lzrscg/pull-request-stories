const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getStoryBySlug(storySlug: string) {
    const params = {
        TableName: process.env.TABLE,
        Key: { slug: storySlug }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getStoryBySlug