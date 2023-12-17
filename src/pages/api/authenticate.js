// pages/api/authenticate.js

import bcrypt from 'bcrypt'

export default async function handler(req, res) {
	const { username, password } = req.body

	const envUser = process.env.AD_USERNAME
	const envPassword = process.env.AD_PW // 平文のパスワード

	// ユーザー名とパスワードのチェック
	if (username === envUser && password === envPassword) {
		res.status(200).json({ message: 'Authentication successful' })
	} else {
		res.status(401).json({ message: 'Authentication failed' })
	}
}
