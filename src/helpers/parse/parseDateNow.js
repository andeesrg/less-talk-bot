export const parseDateNow = () => {
	const date = new Date();
	return {
		hours: String(date.getHours()),
		mins: String(date.getMinutes()),
	};
};
