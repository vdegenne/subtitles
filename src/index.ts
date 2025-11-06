export function numericTimeToTimecode(seconds: number): sub.Timecode {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60
	const ms = Math.floor((s % 1) * 1000)
	const sec = Math.floor(s)

	return `${h}:${m}:${sec}.${ms}`
}
