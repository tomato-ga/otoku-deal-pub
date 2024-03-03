import AWS from 'aws-sdk'
import { IncomingForm } from 'formidable' // 正しくインポートされています
import fs from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

export const config = {
	api: {
		bodyParser: false
	}
}

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: 'ap-northeast-1'
})

export default async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed')
	}

	const form = new IncomingForm()
	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error('Formidable parse error:', err)
			return res.status(500).send('Server Error: Formidable parsing failed.')
		}

		try {
			// `files.file`が配列かどうかをチェックし、配列でない場合は配列に変換
			const fileList = Array.isArray(files.file) ? files.file : [files.file]
			const uploadPromises = fileList.map(async (file) => {
				const data = await readFileAsync(file.filepath)
				const params = {
					Bucket: process.env.AWS_S3_BUCKET_NAME,
					Key: `uploads/${Date.now()}_${file.originalFilename}`,
					Body: data
				}
				return s3.upload(params).promise() // Promiseを返す
			})
			const results = await Promise.all(uploadPromises)
			const urls = results.map((result) => result.Location) // URLの配列を作成
			res.status(200).json({ urls }) // URLの配列をレスポンスとして返す
		} catch (error) {
			console.error('Upload or ReadFile error:', error)
			res.status(500).send('Server Error: Upload or ReadFile failed.')
		}
	})
}
