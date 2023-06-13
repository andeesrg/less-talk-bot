export const parseDateNow = () => {
	const date = new Date();
	return {
		hours: date.getHours(),
		mins: date.getMinutes(),
	};
};
