import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client } from '../../lib/aws-s3-client';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string> => {
  // const s3Client = new S3Client(
  //   process.env.NEXT_PUBLIC_AWS_API_KEY as string,
  //   process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string
  // );

  if (req.body && Object.keys(req.body).length > 0) {
    try {
      const currentTime = +new Date();
      // const s3PutRequest = S3Client.createPutPublicJsonRequest(
      //   'deca-slate-docs',
      //   `slate-doc-${currentTime}.json`,
      //   JSON.stringify(req.body)
      // );

      // const s3Response = await s3Client.put(s3PutRequest);

      res.status(200).json({ result: 'sucesss' });
    } catch (err) {
      res.status(500).json({ result: 'Docs cannot be stored in S3.' });
    }
  } else {
    res.status(400).json({ result: 'Docs must not be empty.' });
  }

  return 'response';
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
