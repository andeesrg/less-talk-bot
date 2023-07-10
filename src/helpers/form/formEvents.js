import { extractDate } from "@helpers/extract";
import { genRandomIdx } from "@helpers/simple";

export const formEvents = data => {
	const randomIdx = genRandomIdx(data.result.length);

	return `
      🗿Here're some events in <b>${data.city}</b>\n\n${data.result
		.slice(randomIdx, Math.min(randomIdx + 5, data.result.length))
		.map(
			({ name, date, day }) =>
				`🎃<b>Title</b>: <i>${name}</i>\n⏱️<b>When</b>: <i>${extractDate(date, day)}</i>`
		)
		.join("\n\n")}
   `;
};
