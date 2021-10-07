const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

type Params = {
  TableName: string | undefined,
  Key: string | {},
  ExpressionAttributeValues: any,
  ExpressionAttributeNames: any,
  ConditionExpression: string,
  UpdateExpression: string,
  ReturnValues: string,
}

async function updateStory(story: any, username: string) {
  let params : Params = {
    TableName: process.env.TABLE,
    Key: {
      slug: story.slug
    },
    UpdateExpression: "",
    ConditionExpression: "#owner = :owner",
    ExpressionAttributeNames: {
      "#owner": "owner"
    },
    ExpressionAttributeValues: {
      ':owner' : username
    },
    ReturnValues: "UPDATED_NEW"
  }
  let prefix = "set ";
  let attributes = Object.keys(story);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "slug") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = story[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }
  try {
    await docClient.update(params).promise()
    return story
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updateStory