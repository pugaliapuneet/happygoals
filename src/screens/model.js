const Datastore = require('react-native-local-mongodb');
var moment = require('moment');

class model {
	dbgoals = new Datastore({ filename: 'goals1', autoload: true });
	dblogs = new Datastore({ filename: 'logs2', autoload: true });


	constructor() {
		// console.log("Applying index");
		// this.dbgoals.ensureIndex({ fieldName: 'name' }, function (err) {
		// 	console.log(err);
		// });
		//
		// this.dblogs.ensureIndex({ fieldName: 'goalName' }, function (err) {
		// 	console.log(err);
		// });
		// this.dblogs.ensureIndex({ fieldName: 'itemName' }, function (err) {
		// 	console.log(err);
		// });

		// this.testingDb();
	}

	dumpDocument(goalName) {
		this.dbgoals.find(
			{name: goalName},
			function(err, docs){
				console.log("DOCDUMP", docs);
			}
		);
	}

	dumpCollection(name) {
		this[name].find(
			{},
			function(err, docs){
				console.log("COLLECTION DUMP", docs);
			}
		);
	}

	getGoalItems(goalName) {
		let dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		return dbgoals.findAsync(
			{name: goalName},
		).then(function(docs) {
			// console.log(goalName, "items = ", docs[0].items);
			return docs[0].items;
		})
	}

	getActiveGoals(goalName = null, forDate = null) {
		let dbgoals = new Datastore({ filename: 'goals1', autoload: true });
		let that = this;

		try {

			let searchCriteria = {}
			if(goalName)
				searchCriteria = {name: goalName};
			else
				searchCriteria = {status: 1, $and: [{$not: {deleted: 1}}, {$not: {closed: 1}}]};

			// console.log("SEARCH CRITERIA: ", searchCriteria);

			//fetch active goals
			return dbgoals.findAsync(searchCriteria).then(function(goals) { // console.log("Active goals =", goals);

				let pp = [];
				let goalsWithPromises = [];

				//
				//PRIMARY LOOP
				//
				//loop over all the goals
				goals.forEach((g, index) => {
					//calculate completion data
					goals[index].completed = that.calculateCompletion(g.startDate);

					goals[index].daysSpent = goals[index].completed.totalDays;
					if(goals[index].completed.weeks > goals[index].duration)
						goals[index].daysSpent = goals[index].duration*7;

					let p = [];
					let dailyRepetitionTarget = 0;

					//loop over all the items of the goals
					if(typeof g.items != "undefined") {
						g.items.forEach((i, index2) => {
							// console.log(i, index2, "ASDASDASD")
							//accumulating required reps for the item
							dailyRepetitionTarget += i.repetition/7;

							//promise array - to get log data
							// console.log("Getting logs for ", g.name, i.name, g.startDate);
							p.push(that.getLogData(g.name, i.name, g.startDate, forDate));
						})
						//reps required in total for the goal
						goals[index].totalDailyRepetitionTarget = dailyRepetitionTarget;

						//array of promises - each item for the goal
						pp.push(Promise.all(p))

						goalsWithPromises.push(g);
					}
				})

				// console.log("PPPPP", pp);

				// this.fiveStarGoal = [{
				// 	name: 'Service Business',
				// 	status: 1,
				// 	startDate: 1561016849,
				// 	mode: 'tasks',
				// 	_id: '4oy1e5SxQWm0UDX3',
				// 	completed: { weeks: 5, days: 6, totalDays: 34 },
				// 	daysSpent: 34,
				// 	totalDailyRepetitionTarget: 2.714285714285714,
				// 	labels: [],
				// 	backlogs: [ '27x testing two' ],
				// 	totalCountToday: 0,
				// 	totalPointsToday: 6,
				// 	totalCount: 1,
				// 	totalPoints: NaN,
				// 	chartData: { '2019-06-26': NaN },
				// 	topDay: '2019-06-26',
				// 	topScore: 23,
				// 	topDaySince: 27,
				// 	dayScore: { '2019-06-26': NaN },
				// 	bigScore: 7.2,
				// 	isCompleted: 0,
				// 	items: [
				// 		{name: 'Pitch', countToday: 2,},
				// 		{name: 'Client servicing', countToday: 0,},
				// 		{name: 'Training', countToday: 1,},
				// 		{name: 'Quality check', countToday: 0,},
				// 		{name: 'Backoffice', countToday: 0,},
				// 		{name: 'Huddle', countToday: 0,},
				// 		{name: 'Team meeting', countToday: 1,},
				// 		{name: 'Special client 1', countToday: 1,},
				// 	]
				// }];

				//
				//SECONDARY LOOP
				//
				//value fetching for all promises
				return Promise.all(pp).then(function(goalPromises){ // console.log("GLD VALUES", goalPromises);
					// console.log("444");
					goalPromises.forEach(function(goalPromise, i2) { // console.log("MMMM", m)
						// console.log("555");

						let totalCountToday = 0;
						let totalPointsToday = 0;
						let totalCount = 0;
						let totalPoints = 0;
						goalsWithPromises[i2].labels = [];
						goalsWithPromises[i2].backlogs = [];
						let dayScore = {};
						// let score;

						// console.log("PO1.1", goalsWithPromises[i2].name);

						goalPromise.forEach(function(itemPromise, i3) { //console.log("MMMM", itemPromise)

							//Add to 5star GOAL
							// if(!this.fiveStarGoal.items)
							// 	this.fiveStarGoal.items = [];

							//&& (goalsWithPromises[i2].duration && goalsWithPromises[i2].duration < g.completed.weeks)
							// if(goalsWithPromises[i2].items[i3].points >= 4) {
							// 	borrowedItem = goalsWithPromises[i2].items[i3]
							// 	borrowedItem.prefix = goalsWithPromises[i2].name;
							// 	this.fiveStarGoal.items.push(borrowedItem);
							// }

							//save logs to item
							goalsWithPromises[i2].items[i3].logs = itemPromise[0];
							goalsWithPromises[i2].items[i3].bigScore = Math.round(goalsWithPromises[i2].items[i3].logs.length/(goalsWithPromises[i2].daysSpent * goalsWithPromises[i2].items[i3].repetition / 7)*100, 2)+"%";

							if(itemPromise[0].length)
							{
								//Get streaks data
								let streakCounter = that.getStreaks(itemPromise[0]);
								// console.log("STREAKER", goalsWithPromises[i2].items[i3].name, streakCounter)
								if(streakCounter >= 5)
									goalsWithPromises[i2].labels.push(streakCounter +"x "+ goalsWithPromises[i2].items[i3].name);

								//Daily score
								let date = "";
								itemPromise[0].forEach((l, i) => {
									date = moment(l.timestamp*1000).format("YYYY-MM-DD");
									dayScore[date] = dayScore[date] ? dayScore[date] : 0;
									dayScore[date] += goalsWithPromises[i2].items[i3].points;
								})
							}

							//Today counts/points
							goalsWithPromises[i2].items[i3].countToday = itemPromise[1];
							goalsWithPromises[i2].items[i3].pointsToday = itemPromise[1]*goalsWithPromises[i2].items[i3].points;

							if(itemPromise[1]) {
								totalCountToday += itemPromise[1];
								totalPointsToday += itemPromise[1]*goalsWithPromises[i2].items[i3].points;
							}

							//Lifetime counts/points
							if(itemPromise[2]) {
								totalCount += itemPromise[2];
								totalPoints += itemPromise[2]*goalsWithPromises[i2].items[i3].points;
							}

							goalsWithPromises[i2].items[i3].lastActivity = itemPromise[3];
							goalsWithPromises[i2].items[i3].secondLastActivity = itemPromise[4];
							if(itemPromise[3] > 7) // || itemPromise[3] == -1
								goalsWithPromises[i2].backlogs.push(itemPromise[3] +"x "+ goalsWithPromises[i2].items[i3].name);

						})

						goalsWithPromises[i2].totalCountToday = totalCountToday;
						goalsWithPromises[i2].totalPointsToday = totalPointsToday;
						goalsWithPromises[i2].totalCount = totalCount;
						goalsWithPromises[i2].totalPoints = totalPoints;

						if(goalsWithPromises[i2].totalCount > 0)
						{
							goalsWithPromises[i2].chartData = that.getChartData(goalsWithPromises[i2]);
							goalsWithPromises[i2].topDay = Object.keys(dayScore).reduce(function(a, b){ return dayScore[a] > dayScore[b] ? a : b });
							goalsWithPromises[i2].topScore = dayScore[goalsWithPromises[i2].topDay];
							goalsWithPromises[i2].topDaySince = moment().diff(moment(goalsWithPromises[i2].topDay, "YYYY-MM-DD"), 'days');
							goalsWithPromises[i2].dayScore = dayScore;
						}

						if(goalsWithPromises[i2].totalPointsToday >= goalsWithPromises[i2].topScore)
							goalsWithPromises[i2].labels.push("TopDay!");

						//Almost complete label logic
						let percent80 = goalsWithPromises[i2].totalPoints/goalsWithPromises[i2].completed.totalDays*0.8;
						if(goalsWithPromises[i2].totalPointsToday > percent80 && goalsWithPromises[i2].totalPointsToday < goalsWithPromises[i2].totalPoints/goalsWithPromises[i2].completed.totalDays)
							goalsWithPromises[i2].labels.push("Almost done!");

						//Big Score

						if(goalsWithPromises[i2].mode == "tasks") {
							goalsWithPromises[i2].bigScore = Math.round(goalsWithPromises[i2].totalPoints/goalsWithPromises[i2].daysSpent*10)/10;
							goalsWithPromises[i2].isCompleted = goalsWithPromises[i2].totalPointsToday/goalsWithPromises[i2].bigScore >= 1 ? 1 : 0;
						}
						else if(goalsWithPromises[i2].mode == "habits") {
							goalsWithPromises[i2].bigScore = Math.round(goalsWithPromises[i2].totalCount/(goalsWithPromises[i2].totalDailyRepetitionTarget*goalsWithPromises[i2].daysSpent)*100);
							goalsWithPromises[i2].isCompleted = goalsWithPromises[i2].bigScore >= 100 ? 1 : 0;
							if(goalsWithPromises[i2].bigScore > 100)
								goalsWithPromises[i2].bigScore = 100;
						}

					});

					// goals.unshift(this.fiveStarGoal);
					// goals = this.fiveStarGoal.concat(goals);

					//sort the goals
					// goals = goals.sort(function(obj1, obj2) {
					// 	return obj1.isCompleted - obj2.isCompleted;
					// }).sort(function(obj1, obj2) {
					// 	return obj1.snoozed || 0 - obj2.snoozed || 0;
					// })

					// console.log("Model - Active Goals", goals);

					return goals;
				})
			})
		}
		catch(err){
			console.log("HAHAHA", err);
		}
	}

	getTags() {
		////// Appreciation
		// Up by 50%/100%
		// 3+ day streak
		// 3+ card closure streak
		// Top day
		// Top Week

		/////// WARNING:
		// No activity since 3+ days
	}

	getTopScore(logs) {

	}

	getStreaks(logs) {
		let dates = [];
		let date = '';
		logs.forEach((l, i) => {
			date = moment(l.timestamp*1000).format("YYYY-MM-DD");
			dates.push(date);
		})

		let counter = 0;
		let streak = 0;
		let yesterdayDate = moment().add(-1, 'days').format("YYYY-MM-DD");
		let stop = false;

		while(stop == false) {
			checkDate = moment().add(counter, 'days').format("YYYY-MM-DD");
			// console.log("Checking12345678", counter, checkDate, logs[0].itemName)

			// console.log("INDEXOF", dates, checkDate);
			if(dates.indexOf(checkDate) != -1) {
				counter--;
				streak++;
			}
			else if(counter == 0)
			{
				counter--;
			}
			else {
				stop = true;
			}

		}

		return streak;
	}

	createLog(goalName, itemName, timestamp) {
		let that = this;
		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return this.dblogs.insertAsync({goalName: goalName, itemName: itemName, timestamp: timestamp, createdAt: moment().unix()}).then(function(newDoc) {
			// that.dblogs.persistence.compactDatafile();
			return newDoc;
		});
	}

	getLogs() {
		let that = this;
		// let startingTimestamp = moment().startOf('day').unix();
		// timestamp: {$gte: startingTimestamp}

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.find({$not: {deleted:1}}).sort({ timestamp: -1 }).exec(function(err, docs){
				newDocs = {};
				docs.forEach((l, i) => {
					let dateString = moment.unix(l.timestamp).format("DD/MM/YYYY");
					newDocs[dateString] = newDocs[dateString] ? newDocs[dateString] : [];
					newDocs[dateString].push(l);
				})
				// console.log("RESOLVE", newDocs);
				resolve(newDocs);
			});
		});
	}

	getLatestEntryOfToday(goalName, taskName) {
		let that = this;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.find({goalName: goalName, itemName: taskName}).sort({ timestamp: -1 }).limit(1).exec(function(err, docs){
				console.log("DOCDOC", docs[0]._id);
				resolve(docs[0]._id);
			});
		});
	}

	getPointsTable() {
		let that = this;

		let dbgoals = new Datastore({ filename: 'goals1', autoload: true });

		return dbgoals.findAsync({}).then(function(goals){
			let pointsTable = {};
			goals.forEach((g) => {
				pointsTable[g.name] = {};

				if(g.items) {
					g.items.forEach((i) => {
						if(g.mode == "habits")
							pointsTable[g.name][i.name] = 3;
						else
							pointsTable[g.name][i.name] = i.points;
					})
				}
			})
			return pointsTable;
		});
	}

	// getBackLogs() {
	// 	let that = this;
	// 	return new Promise(function(resolve, reject) {
	// 		that.dbgoals.find({$not: {deleted:1}}, function(err, docs){
	// 			newDocs = {};
	// 			docs.forEach((l, i) => {
	// 				let dateString = moment.unix(l.timestamp).format("DD/MM/YYYY");
	// 				newDocs[dateString] = newDocs[dateString] ? newDocs[dateString] : [];
	// 				newDocs[dateString].push(l);
	// 			})
	// 			// console.log("RESOLVE", newDocs);
	// 			resolve(newDocs);
	// 		});
	// 	});
	// }

	getItemLogs(goalName, itemName) {
		let that = this;
		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.find({goalName: goalName, itemName: itemName, $not: {deleted:1}})
				.sort({ timestamp: 1 })
				.exec(function(err, docs){
					resolve(docs);
				})
		});
	}

	testingDb = () => {
		let that = this;
		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		console.log("AA");

		return new Promise(function(resolve, reject) {
			console.log("AAA111", "Gold", "5t");


			// console.log("BB", dblogs);
			that.dblogs.find({goalName: "Gold", itemName: "5t", $not: {deleted:1}})
			// console.log("BB2", test);
				.sort({ timestamp: 1 })
				.exec(function(err, docs){
					console.log("TRYING");
					throw err;
					console.log("AAA222");
					resolve(docs);
				}).catch(function(err) {
					console.log("CERR", err);
					reject(err);
				});

		});
	}

	getTotalPointsToday = () => {

		let todayStart = moment().startOf('day').unix(); // console.log(todayStart);
		let that = this;
		let totalPointsToday = 0;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.getPointsTable().then(function(pointsTable){
				that.dblogs
					.find({timestamp: {$gt: todayStart}, $not: {deleted: 1}})
					.exec(function(err, docs){
						// console.log("bigscreen", docs);
						if(docs.length) {
							docs.forEach((log) => {
								totalPointsToday += pointsTable[log.goalName][log.itemName];
							});
						}

						resolve(totalPointsToday);
					})
			})

		});

	}

	getCountTodayOf = (goalName, itemName, forDate) => {
		
		let todayStart = ((forDate)?moment(forDate, "DD/MM/YYYY"):moment()).startOf('day').unix();
		// if (forDate) {
		// 	todayStart = moment(forDate, "DD/MM/YYYY").startOf('day').unix();
		// }
		// else {
		// 	todayStart = moment().startOf('day').unix(); // console.log(todayStart);
		// }
		let that = this;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.count({goalName: goalName, itemName: itemName, timestamp: {$gt: todayStart}, $not: {deleted: 1}}, function(err, count){
				resolve(count);
			})
		});

	}

	getCount = (goalName, itemName) => {

		let todayStart = moment().startOf('day').unix(); // console.log(todayStart);
		let that = this;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.count({goalName: goalName, itemName: itemName, $not: {deleted: 1}}, function(err, count){
				resolve(count);
			})
		});
	}

	getLastActivity = (goalName, itemName) => {
		let that = this;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.find({goalName: goalName, itemName: itemName, $not: {deleted: 1}}).sort({ timestamp: -1 }).limit(1).exec(function(err, docs){
				if(docs.length) {
					let startDate = moment(docs[0].timestamp*1000).dayOfYear();
					let endDate = moment().dayOfYear();

					// let days = endDate.diff(startDate, 'days');
					let days = endDate - startDate;

					// if(itemName == "Games")
					// 	console.log(endDate, " - ", startDate)

					// console.log("TESTING DOCS", goalName, itemName, days, "days ago.");

					resolve(days);
				}
				else {
					resolve(-1)
				}
			})
		});
	}

	getSecondLastActivity = (goalName, itemName) => {
		let that = this;

		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });

		return new Promise(function(resolve, reject) {
			that.dblogs.find({goalName: goalName, itemName: itemName, $not: {deleted: 1}}).sort({ timestamp: -1 }).limit(2).exec(function(err, docs){
				if(docs.length == 2) {
					let startDate = moment(docs[1].timestamp*1000).dayOfYear();
					let endDate = moment().dayOfYear();

					// let days = endDate.diff(startDate, 'days');
					let days = endDate - startDate;

					// console.log("TESTING DOCS", goalName, itemName, days, "days ago.");

					resolve(days);
				}
				else {
					resolve(-1)
				}
			})
		});
	}

	getLogData(goalName, itemName, startDate, forDate) { // console.log("getLogData", goalName, itemName);
		// this.dblogs = new Datastore({ filename: 'logs2', autoload: true });

		let x = this.getItemLogs(goalName, itemName);
		let y = this.getCountTodayOf(goalName, itemName, forDate);
		let z = this.getCount(goalName, itemName);
		let a = this.getLastActivity(goalName, itemName);
		let b = this.getSecondLastActivity(goalName, itemName);

		let array = [x, y, z, a, b];
		let result = {};

		return Promise.all(array);
	}

	deleteLog(goalName, itemName, timestamp, createdAt) {
		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });
		this.dblogs.update({goalName: goalName, itemName: itemName, timestamp: timestamp, createdAt: createdAt}, {$set: {deleted: 1}}, {}, function(err, numRemoved){
			console.log(err);
			console.log(numRemoved);
		})
	}
	deleteLogById(_id) {
		// let dblogs = new Datastore({ filename: 'logs2', autoload: true });
		this.dblogs.update({_id: _id}, {$set: {deleted: 1}}, {}, function(err, numRemoved){
			console.log(err);
			console.log(numRemoved);
		})
	}

	getChartData(g) {
		if(g.startDate)
		{
			// let current = moment();
			let chartData = {};
			// let totalChartPoints = 0;

			g.items.forEach((item, i) => {
				// cumulatedChartData = cumulatedChartData ? cumulatedChartData : 0;

				item.logs.forEach((l, i2) => {
					let dateLabel = moment(l.timestamp*1000).format("YYYY-MM-DD");

					chartData[dateLabel] = chartData[dateLabel] ? chartData[dateLabel] : 0;
					chartData[dateLabel] += item.points;

					// cumulatedChartData += item.points;

					// totalChartPoints += item.points;
					// chartData[dateLabel] = totalChartPoints;
				})
			})

			let pointer = 0;
			let cumulatedChartData = chartData;
			Object.keys(chartData).forEach((v) => {
				cumulatedChartData[v] += pointer;
				pointer = cumulatedChartData[v];
			})

			// console.log("CHARTDATA9", cumulatedChartData);
			return cumulatedChartData;
		}
	}

	calculateCompletion(startDate)
	{
		// console.log(startDate);
		var startDate = moment(startDate*1000);
		var endDate = moment();

		var days = endDate.diff(startDate, 'days');
		var obj = {
			weeks: Math.floor(days/7)+1,
			days: (days)%7+1,
			totalDays: days+1,
		}
		// console.log(obj);
		return obj;

		// $('#result').html(result);
		// return {week: 3, day: 2};
	}

	getIdeas() {
		return ideas = [{
			dummy: true, title: 'Track your work', tip: 'The big score is your daily average',

			name: 'Service Business',
			mode: 'tasks',
			completed: { weeks: 5, days: 6, totalDays: 34 },
			totalPointsToday: 6,
			totalCount: 1,
			topScore: 23,
			bigScore: 7.2,
			isCompleted: 0,
			items: [
				{name: 'Pitch', countToday: 2,},
				{name: 'Client servicing', countToday: 0,},
				{name: 'Training', countToday: 1,},
				{name: 'Quality check', countToday: 0,},
				{name: 'Backoffice', countToday: 0,},
				{name: 'Huddle', countToday: 0,},
				{name: 'Team meeting', countToday: 1,},
				{name: 'Special client 1', countToday: 1,},
			]
		}, {
			dummy: true, title: 'A routine for your fitness', tip: 'Routine cards turns red below 75%',

			name: 'Build Muscle',
			mode: 'habits',
			completed: { weeks: 5, days: 6, totalDays: 34 },
			totalCount: 1,
			bigScore: 100,
			isCompleted: 0,
			items: [
				{name: 'Protein Breakfast', repetition: 7,logs: [], bigScore: '95%'},
				{name: 'Fruit Snack', repetition: 5,logs: [], bigScore: '45%'},
				{name: 'Protein Lunch', repetition: 6,logs: [], bigScore: '80%'},
				{name: 'Protein Shake', repetition: 4,logs: [], bigScore: '110%'},
				{name: 'Light Dinner', repetition: 4,logs: [], bigScore: '90%'},
			],
		}, {
			dummy: true, title: 'Small choices = big results!', tip: 'Activity card turns green if you beat your daily average',

			name: 'Easy Fitness',
			mode: 'tasks',
			completed: { weeks: 5, days: 6, totalDays: 34 },
			totalPointsToday: 6,
			totalCount: 1,
			topScore: 12,
			bigScore: 2.5,
			isCompleted: 0,
			items: [
				{name: 'Salad Meal', countToday: 2,},
				{name: 'Play cricket', countToday: 0,},
				{name: 'Go for a walk', countToday: 1,},
				{name: 'Take the stairs', countToday: 0,},
				{name: 'Home exercise', countToday: 0,},
				{name: 'Dance classes', countToday: 0,},
			]
		}, {
			dummy: true, title: 'Care for yourself', tip: 'Routine cards turns red below 75%',

			name: 'Personal care',
			mode: 'habits',
			completed: { weeks: 5, days: 6, totalDays: 34 },
			totalCount: 1,
			bigScore: 72,
			isCompleted: 0,
			items: [
				{name: 'Floss', repetition: 7,logs: [], bigScore: '95%'},
				{name: 'Sun Block', repetition: 5,logs: [], bigScore: '45%'},
				{name: 'Meditate', repetition: 4,logs: [], bigScore: '80%'},
				{name: 'Take a break', repetition: 1,logs: [], bigScore: '80%'},
			],
		}];
	}

}

const m = new model();
export default m;
