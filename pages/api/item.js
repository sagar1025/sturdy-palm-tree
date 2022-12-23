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
    const Item = await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          Hid: { S: req.body.Hid + '' },
          lat: { S: req.body.lat + ''},
          lang: {S: req.body.lng + ''},
          votes: {S: req.body.votes + '' }
        }
      })
    );

    if(Item.$metadata.httpStatusCode === 200 || Item.$metadata.httpStatusCode === 201) {
      return res.status(201).json({"success": true});
    }
    return res.status(Item.$metadata.httpStatusCode).json({"success": false});
  }

  if (req.method === 'GET') {
    const Item = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          Hid: { S: req.query.id }
        }
      })
    );
    return res.status(200).json(Item);
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

  // if (req.method === 'DELETE') {
  //   await client.send(
  //     new DeleteItemCommand({
  //       TableName: process.env.TABLE_NAME,
  //       Key: {
  //         id: { S: req.body.id }
  //       }
  //     })
  //   );

  //   return res.status(204).json({});
  // }
}
