import * as uuid from 'uuid';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    sessionToken: process.env.SESSION_TOKEN
  },
  region: process.env.REGION
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { Item } = await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: { S: uuid.v4() },
          content: { S: req.body.content }
        }
      })
    );

    return res.status(201).json(Item);
  }

  if (req.method === 'GET') {
    //console.log(client.config.credentials())
    // const { Item } = await client.send(
    //   new GetItemCommand({
    //     TableName: process.env.TABLE_NAME,
    //     Key: {
    //       Hid: { S: req.query.id }
    //     }
    //   })
    // );
    // console.log(Item);

    return res.status(200).json({});
  }

  if (req.method === 'POST') {
    const { Attributes } = await client.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.body.id }
        },
        UpdateExpression: 'set content = :c',
        ExpressionAttributeValues: {
          ':c': { S: req.body.content }
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    return res.status(200).json(Attributes);
  }

  if (req.method === 'DELETE') {
    await client.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.body.id }
        }
      })
    );

    return res.status(204).json({});
  }
}
