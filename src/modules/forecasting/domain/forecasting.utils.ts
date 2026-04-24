function nextMonthPeriod(period: string): string {
	const parts = period.split('-');
	const yearStr = parts[0] ?? '';
	const monthStr = parts[1] ?? '';
	const year = parseInt(yearStr, 10);
	const month = parseInt(monthStr, 10);
	const nextMonth = month === 12 ? 1 : month + 1;
	const nextYear = month === 12 ? year + 1 : year;

	return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

export function buildFuturePeriods(lastPeriod: string, forecastPeriods: number): string[] {
	const periods: string[] = [];
	let current = lastPeriod;

	for (let i = 0; i < forecastPeriods; i++) {
		current = nextMonthPeriod(current);
		periods.push(current);
	}

	return periods;
}
