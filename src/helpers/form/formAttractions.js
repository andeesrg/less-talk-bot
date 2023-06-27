function genRandomId(n) {
	const randomNum = Math.round(Math.random() * n);
	if (randomNum - 5 < 0 && n - randomNum < 5) {
		genRandomId(n);
	}
	return randomNum;
}

export const formAttractions = data => {
	const random = genRandomId(data.result.length);

	console.log(random, data.result.length);
	return `
      🗿<i>Here're some popular places in</i> <b>${
			data.city
		}</b>\n\n${data.result
		.slice(random, Math.min(random + 5, data.result.length))
		.map(
			({ name, rating }) =>
				`🏙️<b>Name</b>: ${name}\n⭐️<b>Rating</b>: ${rating}/10`
		)
		.join("\n\n")}
   `;
};
