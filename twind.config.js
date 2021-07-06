import { apply } from 'twind'
import { css } from 'twind/css'

export default {
	theme: {
		extend: {
			fontFamily: {
				sans: "'Source Sans Pro', sans-serif",
				serif: "'Playfair Display', serif;",
			},
		},
	},
	preflight: {
		'@import': "url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Source+Sans+Pro&display=swap')",
		body: css`
			font-family: 16px;
		`,
		a: apply`normal-case`,
	},
	plugins: {
		body: apply`font-sans text-base font-normal`,
		headline: apply`font-serif text-7xl font-bold`,
	},
}
