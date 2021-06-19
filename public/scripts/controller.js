
const base = "http://localhost:3000";
const stars = {
	1: "*",
	2: "**",
	3: "***",
	4: "****",
	5: "*****"
};

const displayByAsc = (arr) => {
	arr.sort((a, b) => {
		if (a.stars.length == b.stars.length) {
			return ('' + a.text).localeCompare(b.text);
		}
	})
}

const getTopicsBySearch = async (key) => {
	const rest = base + `/api/topics?search=${key}`;
	const response = await fetch(rest);
	const data = await response.json();
	return data;
}

const getExtractedData = async (key) => {

	const rest = base + `/api/topic/context?title=${key}`;
	const response = await fetch(rest);
	const data = await response.json();

	return data;
}

//get all values of specific key
const findAllByKey = (obj = {}, keyToFind = '') => {
	return Object.entries(obj)
		.reduce((acc, [key, value]) => (key === keyToFind) ? acc.concat(value) : (typeof value === 'object' && value)
				? acc.concat(findAllByKey(value, keyToFind))
				: acc
			, []) || [];
}



const sortAsc = (arr) => {
	arr.sort(function (a, b) {
		return a.weight - b.weight;
	});
	return arr;
}

const createStars = (obj, rank) => {
	let numOfStars = 5;
	let divider = parseFloat(rank / numOfStars);
	let arrStars = [];
	for (let i = 1; i <= numOfStars; i++) {
		arrStars.push((divider * i).toFixed(1));
	}

	for (let i = 0; i < obj.length; i++) {
		const output = arrStars.reduce((prev, curr) => Math.abs(curr - obj[i].rank) < Math.abs(prev - obj[i].rank) ? curr : prev);
		const index = arrStars.indexOf(output) + 1;
		const star = stars[index];
		obj[i].stars = star;
	}
}

const createRanks = (hashmap) => {
	const rankArray = [];
	for (let key in hashmap) {
		rankArray.push(hashmap[key]);
	}
	sortAsc(rankArray);
	let rank = 1;
	for (let i = 1; i < rankArray.length; i++) {
		if (rankArray[i].weight > rankArray[i - 1].weight) {
			rank++;
		}
		rankArray[i].rank = rank;
	}
	createStars(rankArray, rank);
	return rankArray;
}

// map words with ranks
const wordFreq = (text) => {
	let words = text.replace(/[.]/g, '').split(/\s/);
	const freqMap = {};
	words.forEach(function (word) {
		if (word) {
			if (!freqMap[word]) {
				freqMap[word] = { "text": word, "weight": 0, "stars": "" };
			}
			freqMap[word]["weight"] += 1;
		}
	});
	return createRanks(freqMap);
}

//remove all html characterss
const strip = (html) => {
	let doc = new DOMParser().parseFromString(html, 'text/html');
	return doc.body.textContent || "";
}

const removeUnwantedcharcters = str => strip(str.replace(/<\!--.+?-->/sg, "").replace(/[^\w\s]/gi, ''));







