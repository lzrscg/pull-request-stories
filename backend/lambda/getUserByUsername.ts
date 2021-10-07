import * as AWS from "aws-sdk";
import { AttributeListType, AttributeMappingType } from "aws-sdk/clients/cognitoidentityserviceprovider";

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

function selectAttributes<T extends AttributeMappingType>(attributesToSelect: Array<keyof T>, listOfAttributes: AttributeListType): Partial<T> | null {
  // TODO: rewrite with a for loop to be more readable
  const attributes = listOfAttributes.reduce((prev, cur) => {
    if(attributesToSelect.indexOf(cur.Name) !== -1) {
      return {
        ...prev,
        [cur.Name]: cur.Value
      }
    } else {
      return prev;
    }
  }, {});
  return Object.keys(attributes).length ? attributes : null;
}

async function getUserByUsername(username: string) {
    if(!process.env.USER_POOL_ID) {
      console.log("No user pool id provided.");
      return;
    }
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    }
    try {
        const user = await cognitoISP.adminGetUser(params).promise();
        if(user && user.UserAttributes) {
          return selectAttributes(["preferred_username", "picture", "name"], user.UserAttributes)
        }
    } catch (err) {
        console.log('Cognito error: ', err)
    }
    return;
}

export default getUserByUsername