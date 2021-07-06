import useSWR from 'swr'
import { tw, apply } from 'twind'
import { useMemo, useState } from 'react'

import { fetcher } from '../src/lib'
import { Stat, Pie, Bar } from '../src/components'

const head = apply`font-bold text-uppercase p-4 text-white`
const cell = apply`font-normal px-4 py-2 whitespace-nowrap`
const headrow = apply`border-b border-gray-500`
const row = apply(headrow, `transition-colors text-gray-300 hover:(text-white)`)
const pill = apply`m-1 px-2 py-1 text-xs rounded-sm bg-gray-100 text-gray-900 cursor-pointer`
const input = apply`px-3 py-1 rounded-full text-base text-gray-900 border`
const select = apply`px-2 py-1 rounded-full text-sm text-gray-900 border`

export default function Home() {
	const [selected, setSelected] = useState<string>('')
	const [query, setQuery] = useState('')
	const [sortType, setSortType] = useState<'name' | 'popularity' | 'followers'>('name')
	const { data, error } = useSWR<TopArtistsResponse, Error>('/api/getTopArtists', fetcher)
	const artists = useMemo(() => {
		let artists =
			data?.artists.filter(
				(a) => a.name.toUpperCase().startsWith(query.toUpperCase()) && (selected === '' || a.genres.includes(selected))
			) ?? []
		switch (sortType) {
			case 'followers':
				artists.sort((a: Artist, b: Artist) => b.followers.total - a.followers.total)
				break
			case 'popularity':
				artists.sort((a: Artist, b: Artist) => b.popularity - a.popularity)
				break
			case 'name':
			default:
				artists.sort((a: Artist, b: Artist) => a.name.localeCompare(b.name))
				break
		}
		return artists
	}, [data, query, sortType, selected])
	const cumulatedFollowers = useMemo(() => data?.artists.reduce((acc, a) => acc + a.followers.total, 0) ?? 0, [data])
	const avgPopularity = useMemo(() => {
		if (!data) return 0
		const p = data.artists.reduce((acc, a) => acc + a.popularity, 0)
		return Math.floor(p / data.artists.length)
	}, [data])
	const [allGenres, allArtist] = useMemo(() => {
		const genres = new Set<string>()
		const artists = new Set<string>()
		data?.artists.map((artist) => {
			artist.genres.map((g) => genres.add(g))
			artists.add(artist.name)
		})
		return [[...genres], [...artists]]
	}, [data])

	const pieData = useMemo(() => {
		if (!data) return []
		return data.artists.map((a) => ({ id: a.name, value: a.followers.total }))
	}, [data])
	const barData = useMemo(() => {
		if (!data) return []
		let m = new Map<string, string[]>()
		data.artists.map((a) => a.genres.map((g) => m.set(g, m.has(g) ? [...(m.get(g) || []), a.name] : [a.name])))
		let arr = []
		for (let [genre, artists] of m.entries()) arr.push({ genre, ...artists.reduce((acc, artist) => ({ ...acc, [artist]: 1 }), {}) })
		return arr
	}, [data])

	return (
		<div className={tw`w-full min-h-screen p-12 bg-gray-900 text-white`}>
			<h1 className={tw`flex-1 headline mb-16`}>Top 10 artists from Spotify</h1>
			{!!error && (
				<div className={tw('mt-24 flex justify-center items-center')}>
					<h1 className={tw('text-red-500 p-24 border rounded text-base text-center font-bold')}>Error, please reload and contact me</h1>
				</div>
			)}
			{!data && <div>Loading...</div>}
			<div className={tw('flex-1 flex flex-col')}>
				<div className={tw('my-8 col-span-1 flex flex-row flex-wrap justify-start items-start')}>
					<Stat label="Cumulated followers" value={cumulatedFollowers?.toLocaleString('en-GB')} />
					<Stat label="Total genres" value={allGenres.length} />
					<Stat label="Average popularity" value={avgPopularity} />
				</div>
				<div className={tw('my-8 col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center')}>
					<Pie label="Followers repartition" data={pieData} />
					<Bar data={barData} keys={allArtist} indexBy="genre" label="Artists by genre" />
				</div>
				<div className={tw('my-8 flex-1 flex flex-col')}>
					<div className={tw('ml-0 lg:ml-auto grid grid-cols-2 gap-4')}>
						<input
							className={tw(input)}
							type="text"
							placeholder="Search by artist..."
							name="query"
							id="query"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							disabled={error && !data}
						/>
						<select className={tw(select)} onChange={(e) => setSelected(e.target.value)} value={selected}>
							<option value="">All genres</option>
							{allGenres.map((genre) => (
								<option key={`option_item_${genre}`} value={genre}>
									{genre}
								</option>
							))}
						</select>
					</div>
					{!error && !!data && (
						<table className={tw`table-auto border-collapse w-full text-left`}>
							<thead>
								<tr className={tw(headrow)}>
									<th className={tw(head, [sortType === 'name' && 'text-green-400'], 'cursor-pointer')} onClick={() => setSortType('name')}>
										Name
									</th>
									<th
										className={tw(head, [sortType === 'popularity' && 'text-green-400'], 'cursor-pointer')}
										onClick={() => setSortType('popularity')}
									>
										popularity
									</th>
									<th
										className={tw(head, [sortType === 'followers' && 'text-green-400'], 'cursor-pointer')}
										onClick={() => setSortType('followers')}
									>
										followers
									</th>
									<th className={tw(head, [selected !== '' && 'text-green-400'])}>genres</th>
								</tr>
							</thead>
							<tbody>
								{artists.map((artist) => (
									<tr key={`item_${artist.id}`} className={tw(row)}>
										<td className={tw(cell)}>{artist.name}</td>
										<td className={tw(cell)}>{artist.popularity}</td>
										<td className={tw(cell)}>{artist.followers.total.toLocaleString('en-GB')}</td>
										<td className={tw(cell, 'w-full flex flex-wrap')}>
											{artist.genres.map((genre) => (
												<span className={tw(pill)} key={`item-genre-${artist.id}-${genre}`} onClick={() => setSelected(genre)}>
													{genre}
												</span>
											))}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	)
}
