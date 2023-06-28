import { genRandomIdx, genRandomRate } from "@helpers/simple";

export const formFoodPlaces = data => {
	const randomIdx = genRandomIdx(data.result.length);

	return `
      🗿Here're some popular food places in <b>${data.city}</b>\n\n${data.result
		.slice(randomIdx, Math.min(randomIdx + 5, data.result.length))
		.map(
			({ name, rating }) =>
				`🍿<b>Name</b>: <i>${name}</i>\n⭐️<b>Rate</b>: <i>${genRandomRate(
					3,
					8
				)}/10</i>`
		)
		.join("\n\n")}
   `;
};
