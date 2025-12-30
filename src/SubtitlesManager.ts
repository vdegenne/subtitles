interface Subtitle extends Omit<sub.Subtitle, 'text'> {
	text: string[]
}

interface SetTextOptions {
	/**
	 * Id of the subtitle
	 */
	id: number

	/**
	 * Text index of the subtitle
	 * (BEWARE) If `undefined` the text will be written to index 0
	 *		and all other indexes will get deleted.
	 *
	 * @default undefined
	 */
	index: number | undefined

	/**
	 * Text to change with
	 */
	text: string
}

export class SubtitleManager {
	#subtitles: Subtitle[] = []

	constructor(
		subtitles: sub.Subtitle[] = [],
		protected cutIndexWith = '\n\n',
	) {
		this.#subtitles = subtitles.map((s) => {
			return {
				...s,
				text: s.text.split(this.cutIndexWith),
			}
		})
	}

	getSubtitleFromId(id: number) {
		return this.#subtitles.find((s) => s.id === id)
	}

	setText(options: SetTextOptions) {
		// if (options.id === undefined) return
		const subtitle = this.getSubtitleFromId(options.id)
		if (subtitle) {
			if (options.index === undefined) {
				subtitle.text = [options.text]
			} else {
				subtitle.text[options.index] = options.text
			}
			return true
		}
		return false
	}

	getScript(index?: number, clearEmptyLines = true, joinIndexWith = '\n') {
		const joined = this.#subtitles
			.map((sub) =>
				index === undefined ? sub.text.join(joinIndexWith) : sub.text[index],
			)
			.filter((text) => {
				return !(!text && clearEmptyLines)
			})
			.join(joinIndexWith)
		return joined
	}

	rebuild(): sub.Subtitle[] {
		return this.#subtitles.map((s) => {
			return {
				...s,
				text: s.text.join(this.cutIndexWith),
			}
		})
	}

	*iterate() {
		for (const item of this.#subtitles) {
			yield item
		}
	}
}
