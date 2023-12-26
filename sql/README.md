# queries

SELECT uid, DATE_TRUNC('week', date) as week, SUM(step_count_day) as step_count_week
FROM steps
GROUP BY uid, week;
