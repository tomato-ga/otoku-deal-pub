import { useState } from 'react'
import { useRouter } from 'next/router'
import useAuthStore from '@/jotai/authStore'

const LoginPage = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()
	const login = useAuthStore((state) => state.login) // ログインアクションの取得

	const handleSubmit = async (e) => {
		e.preventDefault()

		// 認証APIの呼び出し
		const response = await fetch('/api/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		})

		if (response.ok) {
			const data = await response.json()
			const token = data.token

			console.log(token)

			localStorage.setItem('logintoken', token)
			console.log('localstorageセットしました')

			login() // 認証成功時にログイン状態を更新
			router.push('/adminu/edit') // 管理者ページにリダイレクト
		} else {
			alert('Authentication failed.') // 認証失敗時の処理
		}
	}

	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="border-4 m-3"
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border-4 m-3"
					/>
				</div>
				<button type="submit" className="border-4 m-3">
					Login
				</button>
			</form>
		</div>
	)
}

export default LoginPage
