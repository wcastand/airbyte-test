import qs from 'querystring'

export async function getAuthToken() {
	const code = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
	const token_url = 'https://accounts.spotify.com/api/token'
	const token_params = qs.stringify({ grant_type: 'client_credentials' })
	const token_headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': token_params.length.toString(),
		Authorization: `Basic ${code.toString('base64')}`,
	}
	return await fetch(token_url, {
		method: 'POST',
		headers: token_headers,
		body: token_params,
	}).then((res) => res.json())
}

export async function fetcher(url: string) {
	const res = await fetch(url)
	const data = await res.json()

	if (res.status !== 200) {
		throw new Error(data.message)
	}
	return data
}
