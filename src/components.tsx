import { css } from 'twind/css'
import { apply, tw } from 'twind'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveBar } from '@nivo/bar'

export type StatProps = {
	label: string
	value: number | string
}

const container = apply`px-2 py-1 mx-4 flex flex-col rounded-md`
const title = apply`text-xl font-bold`
const counter = apply`text-7xl font-bold`

export function Stat({ label, value }: StatProps) {
	return (
		<div className={tw(container)}>
			<span className={tw(counter)}>{value}</span>
			<span className={tw(title)}>{label}</span>
		</div>
	)
}

export function Pie({ label, data }: any) {
	return (
		<div
			className={tw(
				'relative flex justify-center items-center mx-auto lg:mx-0',
				css`
					width: 450px;
					height: 250px;
					padding-right: 130px;
				`
			)}
		>
			<div
				className={tw(
					'absolute top-0 left-0 text-gray-900',
					css`
						width: 450px;
						height: 250px;
					`
				)}
			>
				<ResponsivePie
					data={data}
					animate={false}
					enableArcLinkLabels={false}
					enableArcLabels={false}
					innerRadius={0.7}
					padAngle={0.7}
					cornerRadius={3}
					borderWidth={1}
					borderColor={'#171718'}
					valueFormat={(v) => v.toLocaleString('en-GB')}
					margin={{ top: 10, right: 130, bottom: 10, left: 0 }}
					legends={[
						{
							anchor: 'top-right',
							direction: 'column',
							justify: false,
							translateX: 100,
							translateY: 0,
							itemsSpacing: 2,
							itemWidth: 100,
							itemHeight: 18,
							itemTextColor: '#999',
							itemDirection: 'left-to-right',
							itemOpacity: 1,
							symbolSize: 18,
							symbolShape: 'circle',
						},
					]}
				/>
			</div>
			<span className={tw('px-24 text-center text-lg font-bold')}>{label}</span>
		</div>
	)
}

export function Bar({ data, keys, indexBy, label }: any) {
	return (
		<div className={tw('mx-auto lg:mx-0')}>
			<span className={tw('px-8 text-center text-lg font-bold')}>{label}</span>
			<div
				className={tw(
					'text-white text-base',
					css`
						width: 450px;
						height: 250px;
					`
				)}
			>
				<ResponsiveBar
					padding={0.3}
					margin={{ top: 10, right: 130, bottom: 10, left: 130 }}
					layout="horizontal"
					data={data}
					indexBy={indexBy}
					keys={keys}
					enableLabel={false}
					isInteractive={false}
					animate={false}
					/* 
          // @ts-ignore */
					axisBottom={null}
					theme={{
						textColor: 'white',
					}}
					borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
					legends={[
						{
							dataFrom: 'keys',
							anchor: 'top-right',
							direction: 'column',
							justify: false,
							translateX: 110,
							translateY: 0,
							itemsSpacing: 2,
							itemWidth: 100,
							itemHeight: 20,
							itemDirection: 'left-to-right',
							itemOpacity: 1,
							symbolSize: 20,
						},
					]}
				/>
			</div>
		</div>
	)
}
