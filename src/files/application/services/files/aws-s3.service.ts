import { Injectable } from "@nestjs/common";
import { s3 } from "@/contexts/shared/aws/aws.config";
import { S3 } from "aws-sdk";

@Injectable()
export class AwsS3Service {
  constructor() {}

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
    key: string,
  ): Promise<S3.ManagedUpload.SendData> {
    if (!file) {
      throw new Error("No valid file provided");
    }

    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      return await s3.upload(params).promise();
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Error uploading file to S3");
    }
  }

  async getFile(key: string, bucketName: string): Promise<S3.GetObjectOutput> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      return await s3.getObject(params).promise();
    } catch (error) {
      console.error("Error getting file from S3:", error);
      throw new Error("Error getting file from S3");
    }
  }

  async getSignedUrl(key: string, bucketName: string): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 3600,
    };
    return await s3.getSignedUrlPromise("getObject", params);
  }

  async deleteFile(key: string, bucketName: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      await s3.deleteObject(params).promise();
      console.log(`File deleted successfully: ${key}`);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Error deleting file from S3");
    }
  }
}
