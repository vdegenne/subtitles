export function numericTimeToTimecode(seconds: sub.NumericTime): sub.Timecode {
	return (String((seconds / 3600) | 0).padStart(2, '0') +
		':' +
		String(((seconds / 60) | 0) % 60).padStart(2, '0') +
		':' +
		String((seconds | 0) % 60).padStart(2, '0') +
		'.' +
		String(((seconds * 1000) | 0) % 1000).padStart(3, '0')) as sub.Timecode
}

export function subtitlesToVTT(subtitles: sub.Subtitles): string {
	let vtt = 'WEBVTT\n\n'

	for (const s of subtitles) {
		if (s.id != null) vtt += `${s.id}\n`
		vtt += `${numericTimeToTimecode(s.start)} --> ${numericTimeToTimecode(s.end)}\n`
		vtt += `${s.text}\n\n`
	}

	return vtt
}

export function numericTimeToSRTTimecode(seconds: sub.NumericTime): string {
	const hours = String((seconds / 3600) | 0).padStart(2, '0')
	const minutes = String(((seconds / 60) | 0) % 60).padStart(2, '0')
	const secs = String((seconds | 0) % 60).padStart(2, '0')
	const millis = String(((seconds * 1000) | 0) % 1000).padStart(3, '0')
	return `${hours}:${minutes}:${secs},${millis}`
}

export function subtitlesToSRT(subtitles: sub.Subtitles): string {
	let srt = ''
	for (let i = 0; i < subtitles.length; i++) {
		const s = subtitles[i]!
		srt += `${i + 1}\n`
		srt += `${numericTimeToSRTTimecode(s.start)} --> ${numericTimeToSRTTimecode(s.end)}\n`
		srt += `${s.text}\n\n`
	}
	return srt
}

export function VTTtoSRT(vtt: string): string {
	const lines = vtt.split(/\r?\n/)
	const srtLines: string[] = []
	let index = 1

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!.trim()
		if (!line || line === 'WEBVTT') continue

		// Timecode line
		if (line.includes('-->')) {
			srtLines.push(String(index++))
			srtLines.push(line.replace('.', ',')) // convert milliseconds
			continue
		}

		// Subtitle text
		srtLines.push(line)
		// Add empty line after text if next line is empty or timecode
		if (!lines[i + 1] || lines[i + 1]!.includes('-->')) {
			srtLines.push('')
		}
	}

	return srtLines.join('\n')
}

export function SRTtoVTT(srt: string): string {
	const lines = srt.split(/\r?\n/)
	const vttLines: string[] = ['WEBVTT', ''] // header + empty line

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!.trim()

		// Skip numeric indices
		if (/^\d+$/.test(line)) continue

		// Convert timecodes: comma → dot for milliseconds
		if (line.includes('-->')) {
			vttLines.push(line.replace(/,/g, '.'))
			continue
		}

		// Subtitle text or empty line
		vttLines.push(line)
	}

	return vttLines.join('\n')
}
