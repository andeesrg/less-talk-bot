import { genRandomIdx, genRandomRate } from "@helpers/simple";

export const formAttractions = data => {
	const random = genRandomIdx(data.result.length);

	return `
      🗿Here're some popular places in <b>${data.city}</b>\n\n${data.result
		.slice(random, Math.min(random + 5, data.result.length))
		.map(
			({ name, rating }) =>
				`🌆<b>Name</b>: <i>${name}</i>\n⭐️<b>Rate</b>: <i>${genRandomRate(
					3,
					8
				)}/10</i>`
		)
		.join("\n\n")}
   `;
};
