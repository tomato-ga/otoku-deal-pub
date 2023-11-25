async function postClickCount(asin, clickType) {
	if (clickType === 'impClick') {
		const body = {
			asin: asin,
			type: clickType
		}
		try {
			const response = await fetch('https://h8ea9ztok7.execute-api.ap-northeast-1.amazonaws.com/click/click', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})

			console.log('imp', body)

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Error posting click count:', error)
		}
	} else if (clickType === 'amazonUrlClick') {
		const body = {
			asin: 'ASIN#' + asin,
			type: clickType
		}
		try {
			const response = await fetch('https://h8ea9ztok7.execute-api.ap-northeast-1.amazonaws.com/click/click', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})

			console.log('aff', body)

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}

			const data = await response.json()
			return data
		} catch (error) {
			console.error('Error posting click count:', error)
		}
	}
}

export default postClickCount
