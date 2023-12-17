import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
	try {
		const { username, password } = req.body

		const envUser = process.env.AD_USERNAME
		const envPassword = process.env.AD_PW // 平文のパスワード

		// ユーザー名とパスワードのチェック
		if (username === envUser && password === envPassword) {
			const token = jwt.sign(
				{ username: envUser },
				process.env.JWT_SECRET, // JWTのシークレットキー
				{ expiresIn: '30d' } // トークンの有効期限を30日間に設定
			)

			res.status(200).json({ token: token, message: 'Authentication successful' })
		} else {
			res.status(401).json({ message: 'Authentication failed' })
		}
	} catch (error) {
		console.error('Authentication error:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}
