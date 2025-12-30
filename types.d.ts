declare global {
	namespace sub {
		type Timecode = `${number}:${number}:${number}.${number}`
		/**  in seconds */
		type NumericTime = number

		interface Subtitle {
			id: number
			/** numeric time in seconds */
			start: sub.NumericTime
			/** numeric time in seconds */
			end: sub.NumericTime
			text: string
		}

		type Subtitles = Subtitle[]
	}
}
export {}
