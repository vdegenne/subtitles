declare global {
	namespace sub {
		type Timecode = `${number}:${number}:${number}.${number}`
		type NumericTime = number
	}
}
export {}
