const searchForm = document.querySelector('form');
const submitSearch = document.querySelector('[type=button]');

const showElement = elem => elem[0].style.display = 'block';
const hideElement = elem => elem[0].style.display = 'none';

let p = document.getElementsByTagName("p");
hideElement(p);

const getListOfTopics = async (search) => {
	try{
		const topicList = await getTopicsBySearch(search);	
		const firsTopic = topicList[1][0];
		const extractedTopics = await getExtractedData(firsTopic);
		
		return {topicList, extractedTopics };
	}
	catch{
		createTable([]);
	}
	
};

const clearTable = ()=>{
	const tbody = document.getElementById('tbody');
	tbody.innerHTML = "";
}

const createTable = (obj) =>{
	displayByAsc(obj);
	const tbody = document.getElementById('tbody');
	tbody.innerHTML = "";
	if(!obj.length){
		obj = [{"text":"No data is available", "stars":"error"}];
	}
	for (let i = 0; i < obj.length; i++) {						
		let tr = "<tr>";						
		tr += "<td>" + obj[i].text + "</td>" + "<td>" +  "( " + obj[i].stars + " )" + "</td></tr>";
		tbody.innerHTML += tr;
	}	
}

submitSearch.addEventListener('click', (e)=>{	 
	e.preventDefault();
	const searchValue = searchForm.search.value.trim();
	if(searchValue.length < 1){	
		alert("Please enter a correct word");		
	}
	else{
		clearTable();
		showElement(p);
		getListOfTopics(searchValue)
			.then((data) => {			
				const extractedText = findAllByKey(data,'extract').toString();
				const rankedText = removeUnwantedcharcters(extractedText);					
			    createTable(wordFreq(rankedText).reverse());
				hideElement(p);
			})
			.catch(err =>{
				 console.log(err);
				 hideElement(p);
				 createTable([]);
			});
	}		
});


