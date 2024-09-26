const AWS = require("@aws-sdk/client-s3");
const { Buffer } = require("buffer");
// const sharp = require("jimp");
const sharp = require('sharp');
const fs = require("fs-extra");




const s3Client = new AWS.S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
async function PutObjectCommand(params) {
  try {
    const command = new AWS.PutObjectCommand(params);
    await s3Client.send(command);
    // Return the URL of the uploaded image
    const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return imageUrl;
  } catch (error) {
    console.log(error.message);
    return "";
  }
}

module.exports.uploadFile = async (path, data) => {
  return new Promise(async (resolve) => {
    if (data) {
      var new_path = user().upload_folder + "/" + path;
      var buffer = new Buffer.from(
        data.toString().replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: buffer,
        Key: new_path,
        ContentEncoding: "base64",
      };
      resolve(await PutObjectCommand(params));
    } else {
      resolve('');

    }
  });
};

module.exports.uploadImage = async (path, data) => {
  return new Promise(async (resolve) => {
    var new_path = user().upload_folder + "/" + path;
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: data.data,
      Key: new_path,
      ContentEncoding: "base64",
      mimetype: data.mimetype,
      ContentDisposition: "inline",
      ContentType: "image/jpeg",
    };
    resolve(await PutObjectCommand(params));
  });
};

module.exports.uploadThumbImage = async (path, data) => {
  return new Promise(async (resolve) => {
    var new_path = user().upload_folder + "/" + path;
    // var buffer = new Buffer.from(sharp(data).resize(100, 100).toString().replace(/^data:image\/\w+;base64,/, ""), 'base64');
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: sharp(data.data).resize(100, 100),
      Key: new_path,
      ContentEncoding: "base64",
      mimetype: data.mimetype,
      ContentDisposition: "inline",
      ContentType: "image/jpeg",
    };
    resolve(await PutObjectCommand(params));
  });
};

module.exports.uploadFileOne = async (path, data) => {
  return new Promise(async (resolve) => {
    var new_path = user().upload_folder + "/" + path;
    var buffer = new Buffer.from(
      sharp(data)
        .resize(100, 100)
        .toString()
        .replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: buffer,
      Key: new_path,
      ContentEncoding: "base64",
    };
    resolve(await PutObjectCommand(params));
  });
};

module.exports.uploadXLSXFile = async (path, dataOne) => {
  return new Promise((resolve) => {
    var new_path = user()?.upload_folder + "/" + path;
    fs.readFile(dataOne, async (err, data) => {
      if (err) throw err;
      if (data) {
        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: data,
          Key: new_path,
          ContentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
        resolve(await PutObjectCommand(params));
      }
    });
  });
};

module.exports.createFolderWithPermissions = async (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(folderPath, { recursive: true, mode: 0o777 }, () => { });
  }
};

module.exports.uploadPDFFile = async (path, dataOne) => {
  return new Promise((resolve) => {
    var new_path = user().upload_folder + "/" + path;
    fs.readFile(dataOne, async (err, data) => {
      if (err) throw err;
      if (data) {
        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: data,
          Key: new_path,
          ContentType: "application/pdf",
        };
        resolve(await PutObjectCommand(params));
      }
    });
  });
};

module.exports.uploadZipFile = async (path, dataOne) => {
  return new Promise((resolve) => {
    var new_path = user().upload_folder + "/" + path;
    fs.readFile(dataOne, async (err, data) => {
      if (err) throw err;
      if (data) {
        var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: data,
          Key: new_path,
          ContentType: "application/zip",
        };
        resolve(await PutObjectCommand(params));
      }
    });
  });
};

module.exports.listObjectsInFolder = async () => {
  return new Promise(async (resolve) => {
    var new_path = user().upload_folder;
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: new_path
      };
      const response = await s3Client.send(new AWS.ListObjectsV2Command(params));
      resolve(response.Contents.map(object => object.Key));
    } catch (error) {
      console.error("Error listing objects in folder:", error);
      throw error;
    }
  });
};

module.exports.getObjectFromS3 = async (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePath
      };
      const command = new AWS.GetObjectCommand(params);
      const response = await s3Client.send(command);
      resolve(response.Body);
    } catch (error) {
      console.error("Error getting object from S3:", error);
      reject(error);
    }
  });
};

module.exports.deleteFileFromS3 = async (filePath) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
    };
    const command = new AWS.DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`File ${filePath} deleted from S3 successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filePath} from S3:`, error);
    return false;
  }
};

// module.exports.extractZipFileOnS3 = async (zipFilePath, folderName) => {
//     try {
//         const zipFileData = await module.exports.getObjectFromS3(zipFilePath);
//         //const zipBuffer = Buffer.from(zipFileData);
//         const extractedFolderPath = `path/to/${folderName}/extracted`;
//         return extractedFolderPath;
//     } catch (error) {
//         console.error("Error extracting zip file on S3:", error);
//         throw error;
//     }
// };

// module.exports.convertImageUrlToBase64 = async (imageUrl) => {
//   try {
//     const response = await fetch(imageUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Image = buffer.toString('base64');
//     return `data:${response.headers.get('content-type')};base64,${base64Image}`;
//   } catch (error) {
//     console.error('Error converting image URL to base64:', error);
//     throw error;
//   }
// }



// end Helpher 



