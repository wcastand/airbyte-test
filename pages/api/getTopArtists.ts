import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'querystring'

import { getAuthToken } from '../../src/lib'

const top_50_playlist_id = '37i9dQZEVXbMDoHDwVN2tF'
const get_playlist_url = `https://api.spotify.com/v1/playlists/${top_50_playlist_id}`

export default async function handler(req: NextApiRequest, res: NextApiResponse<TopArtistsResponse>) {
	try {
		// get auth token
		const token = await getAuthToken()

		// get top 50 playist
		const playlist = await fetch(get_playlist_url, { headers: { Authorization: `Bearer ${token.access_token}` } }).then((r) => r.json())

		// get artists from the top 50 playlist and add to Set to avoid duplicates
		const artistsIDs = new Set<string>([])
		playlist.tracks.items.forEach((i: any) => artistsIDs.add(i.track.artists[0].id))

		// make then into comma separated params
		const data = qs.stringify({ ids: [...artistsIDs].slice(0, 10).join(',') })

		// get artists infos
		const artists: { artists: Artist[] } = await fetch(`https://api.spotify.com/v1/artists?${data}`, {
			headers: { Authorization: `Bearer ${token.access_token}` },
		}).then((r) => r.json())

		res.status(200).json(artists)
	} catch (error) {
		console.error(error)
		res.status(error.status || 500).end(error.message)
	}
}
