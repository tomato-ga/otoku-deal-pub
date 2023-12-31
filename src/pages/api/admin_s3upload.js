import AWS from 'aws-sdk'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
	api: {
		bodyParser: false
	}
}

const s3 = new AWS.S3({
	accessKeyId: proccess.env.AWS_ACCESS_KEY,
	secretAccessKey: proccess.env.AWS_SECRET_ACCESS_KEY,
	region: 'ap-northeast-1'
})

export default async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed')
	}

	const form = new formidable.IncomingForm()
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(500).send('Server Error')
		}

		const file = files.file
		fs.readFile(file.filepath, (err, data) => {
			if (err) return res.status(500).send('Server Error')

			const params = {
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: `uploads/${Date.now()}_${file.originalFilename}`, // ファイル名
				Body: data,
				ACL: 'public-read' // ファイルを公開状態でアップロード
			}

			s3.upload(params, (err, data) => {
				if (err) {
					return res.status(500).send('Server Error')
				}
				res.status(200).json({ url: data.Location })
			})
		})
	})
}
