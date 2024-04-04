import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  NoFilesInterceptor,
} from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
  @Post('upload-arr')
  @UseInterceptors(FilesInterceptor('files[]', 10))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  //To accept multipart/form-data but not allow any files to be uploaded, use the NoFilesInterceptor.
  //This sets multipart data as attributes on the request body. Any files sent with the request will throw a BadRequestException.
  @Post('no-upload-allowed')
  @UseInterceptors(NoFilesInterceptor())
  handleMultiPartData(@Body() body) {
    console.log(body);
  }

  @Post('upload-multi')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  uploadFileM(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }

  @Post('remove-file')
  async removingFile(@Body() body: { filePath: string }) {
    const { filePath } = body;
    try {
      await fs.promises.unlink(filePath);
      return { message: 'File deleted successfully' };
    } catch (error) {
      return { error: 'Error deleting file', message: error.message };
    }
  }
}
