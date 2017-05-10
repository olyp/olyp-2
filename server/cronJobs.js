import cron from 'cron';

Meteor.startup(() => {

	// Garbage collection

	var emptyTrash = new cron.CronJob({
		cronTime: '0 * * * *',
		onTick: Meteor.bindEnvironment(function() {

			Meteor.call('files.emptyTrash');
			Meteor.call('files.compareAndDelete');

		}),
		start: false,
		timeZone: "Europe/Oslo"
	});

	emptyTrash.start();

});