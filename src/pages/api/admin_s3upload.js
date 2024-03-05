import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
require('dotenv').config()

export const config = {
	api: {
		bodyParser: false
	}
}

const s3Client = new S3Client({
	region: 'ap-northeast-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
})

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' })
		return
	}

	try {
		const data = await new Promise((resolve, reject) => {
			const form = new IncomingForm()
			form.parse(req, (err, fields, files) => {
				if (err) {
					reject(err)
				} else {
					resolve(files)
				}
			})
		})

		// デバッグ情報に基づいて、アクセスキーを `files.files` に修正
		if (!data.files || data.files.length === 0) {
			res.status(400).json({ error: 'No files uploaded.' })
			return
		}

		const uploadedFiles = data.files
		const uploadPromises = uploadedFiles.map(async (file) => {
			const fileStream = await fs.readFile(file.filepath)
			const uploadParams = {
				Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
				Key: `uploads/${Date.now()}_${file.originalFilename}`,
				Body: fileStream
			}

			await s3Client.send(new PutObjectCommand(uploadParams))
			return `https://otokudealarticle.s3.ap-northeast-1.amazonaws.com/${uploadParams.Key}`
		})

		const urls = await Promise.all(uploadPromises)
		res.status(200).json({ urls })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ error: 'Server Error: Unable to process the request.' })
	}
}
