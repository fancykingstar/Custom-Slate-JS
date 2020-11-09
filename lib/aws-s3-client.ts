import AWS from 'aws-sdk';

export class S3Client {
  protected client: AWS.S3;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.client = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });
  }

  public async put(
    request: AWS.S3.Types.PutObjectRequest
  ): Promise<AWS.S3.Types.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.client.putObject(request, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }

  static createPutPublicJsonRequest(
    location: string,
    filename: string,
    contents: string
  ): AWS.S3.Types.PutObjectRequest {
    return {
      Bucket: location,
      Key: filename,
      Body: contents,
      ContentType: 'application/json; charset=utf-8',
      ACL: 'public-read',
      CacheControl: 'max-age=60',
    };
  }
}
