import fs from 'fs';
import path from 'path';

import { S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { Credentials } from '@aws-sdk/types';
import { PublisherBase, PublisherOptions } from '@electronite-forge/publisher-base';
import debug from 'debug';

import { PublisherS3Config } from './Config';

const d = debug('electronite-forge:publish:s3');

type S3Artifact = {
  path: string;
  keyPrefix: string;
  platform: string;
  arch: string;
};

export default class PublisherS3 extends PublisherBase<PublisherS3Config> {
  name = 's3';

  async publish({ makeResults, setStatusLine }: PublisherOptions): Promise<void> {
    const artifacts: S3Artifact[] = [];

    if (!this.config.bucket) {
      throw new Error('In order to publish to S3, you must set the "bucket" property in your Forge publisher config. See the docs for more info');
    }

    for (const makeResult of makeResults) {
      artifacts.push(
        ...makeResult.artifacts.map((artifact) => ({
          path: artifact,
          keyPrefix: this.config.folder || makeResult.packageJSON.version,
          platform: makeResult.platform,
          arch: makeResult.arch,
        }))
      );
    }

    const s3Client = new S3Client({
      credentials: this.generateCredentials(),
      region: this.config.region,
      endpoint: this.config.endpoint,
      forcePathStyle: !!this.config.s3ForcePathStyle,
    });

    d('creating s3 client with options:', this.config);

    let uploaded = 0;
    const updateStatusLine = () => setStatusLine(`Uploading distributable (${uploaded}/${artifacts.length})`);

    updateStatusLine();
    await Promise.all(
      artifacts.map(async (artifact) => {
        d('uploading:', artifact.path);
        const uploader = new Upload({
          client: s3Client,
          params: {
            Body: fs.createReadStream(artifact.path),
            Bucket: this.config.bucket,
            Key: this.keyForArtifact(artifact),
            ACL: this.config.public ? 'public-read' : 'private',
          },
        });

        uploader.on('httpUploadProgress', (progress: Progress) => {
          if (progress.total) {
            const percentage = `${Math.round(((progress.loaded || 0) / progress.total) * 100)}%`;
            d(`Upload Progress (${path.basename(artifact.path)}) ${percentage}`);
          }
        });

        await uploader.done();
        uploaded += 1;
        updateStatusLine();
      })
    );
  }

  keyForArtifact(artifact: S3Artifact): string {
    if (this.config.keyResolver) {
      return this.config.keyResolver(path.basename(artifact.path), artifact.platform, artifact.arch);
    }

    return `${artifact.keyPrefix}/${path.basename(artifact.path)}`;
  }

  generateCredentials(): Credentials | undefined {
    const accessKeyId = this.config.accessKeyId;
    const secretAccessKey = this.config.secretAccessKey;
    const sessionToken = this.config.sessionToken;

    if (accessKeyId && secretAccessKey) {
      return { accessKeyId, secretAccessKey, sessionToken };
    }

    return undefined;
  }
}

export { PublisherS3, PublisherS3Config };
