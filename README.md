### Scheduler Service

#### The primary purpose for this service is to introduce scheduled jobs into the platform which are solely based on a repeating interval with a query

The service is governed by an array of schedules, which each define a set of values to create a scheduled job. For each `schedule`, it's possible to create a job for N documents in a collection; based on the `query` and `options` provided.

For each `schedule`, define an object like:
```
{
	name: 'ScheduleName',
	queue: 'QueueNameToPushTo',
	model: models.Model,
	query: {
		<!-- Query to run against the Model selected above -->
	},
	options: {
		<!-- Repeat options to pass to the underlying Bull:Queue -->
		repeat: {
			every: hour,
			limit: 1
		}
	}
}
```