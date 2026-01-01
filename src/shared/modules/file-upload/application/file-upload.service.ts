import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  async saveFile(
    file: Express.Multer.File,
    appType: string,
    userCode?: string,
  ): Promise<string> {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const datePath = `${day}-${month}-${year}`;

    const fileType = file.mimetype.startsWith('image') ? 'images' : 'files';

    let basePath = path.join(appType, fileType);
    if (appType === 'investor' || appType === 'distributor') {
      basePath = path.join(appType, fileType, userCode || 'uncategorized');
    }
    
    const relativePath = path.join(basePath, datePath);

    const uploadPath = path.join(
      this.configService.get('storage.dest', './storage'),
      relativePath,
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    const filePath = path.join(uploadPath, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return path.join('/storage', relativePath, filename);
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) return;

    // Convert URL path (/storage/...) to absolute disk path
    const relativePath = filePath.replace(/^\/storage/, '');
    const absolutePath = path.join(
      this.configService.get('storage.dest', './storage'),
      relativePath,
    );

    try {
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${absolutePath}`, error);
    }
  }
}