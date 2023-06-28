export const transformFoodData = (city, data) => {
	const filtered = data
		.filter(isMatched)
		.map(el => ({ name: el.properties.name, rating: el.properties.rate }))
		.reduce((acc, curr) => {
			const match = acc.find(accEl => accEl.name === curr.name);
			return !match ? [...acc, curr] : acc;
		}, []);

	return { city, result: filtered };
};

function isMatched(el) {
	return (
		el.properties.name &&
		!/[с|С]толовая|[Б|б]уфет/gm.test(el.properties.name) &&
		el.properties.name.length <= 20
	);
}
