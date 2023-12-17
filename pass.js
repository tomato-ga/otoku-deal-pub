const bcrypt = require('bcrypt')

async function generateHash() {
	const password = 'ratz' // 実際の管理者パスワード
	const saltRounds = 10 // ソルトの生成に使用するコスト係数

	const hash = await bcrypt.hash(password, saltRounds)
	console.log('Hashed password:', hash)
}

generateHash()
