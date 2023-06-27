export const transformAttractionsData = (city, data) => ({
	city,
	result: data
		.filter(el => el.properties.name && el.properties.rate)
		.map(el => ({ name: el.properties.name, rating: el.properties.rate })),
});
