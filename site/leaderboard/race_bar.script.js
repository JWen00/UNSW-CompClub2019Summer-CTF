users = {};

leaderboardProvider(function scoreRunner(data, ready) {
  // Initialise Isotope
	if (typeof iso === 'undefined') {
		iso = new Isotope(document.getElementById('contents'), {
			getSortData: {
				name: elem => users[elem.uid].name,
				score: elem => users[elem.uid].points
			},
			sortAscending: {
				name: true,
				score: false
			},
			layoutMode: 'vertical',
			stagger: 50,
			transitionDuration: 800			
		});
	}

  // Setup
	let contentsElem = document.getElementById('contents');
	const __countup_options__ = {
		useEasing: true,
		useGrouping: false,
	};

  let maxScore = Math.max.apply(null, Object.values(data).map(e => e.points));
  
  // Update points of each user
	for (let uid in data) {
		let user = data[uid];
		if (user.points === 0) continue; // Skip users that have 0 points

    // If new user (or old user has more than 0 points), create a DOM element
		if (!users.hasOwnProperty(uid)) {
			let userElem = document.createElement('div');
			userElem.uid = uid;
			userElem.classList.add('item');

			let nameElem = document.createElement('span');
			nameElem.classList.add('name');
			nameElem.innerText = user.name;
			userElem.appendChild(nameElem);

			let scoreElem = document.createElement('div');
			scoreElem.classList.add('score');
			userElem.appendChild(scoreElem);

      // Update global object map
			users[uid] = {
				name: user.name,
				userElem: userElem,
				scoreElem: scoreElem,
			};
			users[uid].scoreCountup = new CountUp(scoreElem, user.points, 0, 0, __updateDelay / 3, __countup_options__); // Init

			contentsElem.appendChild(userElem);
			iso.appended(userElem);
		} else {
		  // Animate count up
			users[uid].scoreCountup.update(user.points);
		}
		
		// Update point value
		users[uid].points = user.points;
		users[uid].scoreElem.style.width = `${user.points / maxScore * 100}%`;
	}

  // Reorder users
	iso.updateSortData()
	iso.arrange({ sortBy: 'score' });
	
	ready();
});