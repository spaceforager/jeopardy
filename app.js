class Jeopardy {
	//constructor for new Jeopardy object
	constructor(p1, p2, p3, height = 6, width = 6) {
		this.players = [ p1, p2, p3 ];
		this.height = height;
		this.width = width;
		this.ids = [];
		this.clues = [];
		this.board = [];
		this.makeBoard();
		this.makeHTMLBoard();
		this.initQuestions();
		this.gameover = false;
		this.lockboard = false;
	}

	makeBoard() {
		//creating the board
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}

	makeHTMLBoard() {
		const board = document.getElementById('board');
		board.innerHTML = '';

		// make column top which will be the area for categories
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		board.append(top);

		// dynamically make main part of board
		for (let y = 0; y < this.height - 1; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				cell.innerText = '$' + 200 * (y + 1);
				cell.style.textAlign = 'center';
				cell.style.fontFamily = 'Impact';
				cell.style.fontSize = '90px';
				cell.style.color = 'darkorange';
				row.append(cell);
			}

			board.append(row);
		}

		// store a reference to the handleClick bound function
		this.handleEachClick = this.handleClick.bind(this);
		board.addEventListener('click', this.handleEachClick);
	}

	async initQuestions() {
		this.arr = await this.getCategory()
		// and continue with this.ids = await getCategoriesIds
		// etc
	}

	//Obtains categories and pushes the ids of those categories to arr property of new object
	async getCategory() { // isn't it more like setCategory? check out object attibutes setters https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
		//getting 100 categories from Jeopardy API
		const result = await axios.get('http://jservice.io/api/categories?count=100'); // is it neccessary to get 100 when number of categories is already defined?
		const categoryIds = []
		for (let x = 0; x < this.width; x++) {
			const random = Math.floor(Math.random() * result.data.length);
			categoryIds.push(result.data[random].id);

			const topmostCell = document.getElementById(`${x}`);
			topmostCell.innerText = result.data[random].title.toUpperCase();
			topmostCell.style.textAlign = 'center'; // would consider using class here instead of inline styling in js
			topmostCell.style.fontFamily = 'Impact';
			topmostCell.style.fontSize = '40px';
			topmostCell.style.color = 'white';
		}
		// i would rather return the whole object not just ids and then execute the six lines above in initQuestions() and loop over arr. The reason is that this method should do just one part of the logic - get categories and thats it.
		return categoryIds
	}
	//gets ids of categories and invokes getClues instance method to obtain clues
	async getCategoryId(arr) {
		const res1 = await axios.get(`http://jservice.io/api/category?id=${arr[0]}`); // number of calls can vary right? You should handle the number of api calls dynamically. Take a look at Promise.all() https://alligator.io/js/async-functions/
		const res2 = await axios.get(`http://jservice.io/api/category?id=${arr[1]}`);
		const res3 = await axios.get(`http://jservice.io/api/category?id=${arr[2]}`);
		const res4 = await axios.get(`http://jservice.io/api/category?id=${arr[3]}`);
		const res5 = await axios.get(`http://jservice.io/api/category?id=${arr[4]}`);
		const res6 = await axios.get(`http://jservice.io/api/category?id=${arr[5]}`);

		this.ids.push(res1.data, res2.data, res3.data, res4.data, res5.data, res6.data);
		console.log(this.ids);
		return this.getClues(this.ids);
	}
	//gets clues based on the ids of the categories
	getClues(arr) {
		//need to find a better replacement for 'element' below
		for (let element of arr) {
			this.clues.push(element.clues);
		}
		console.log(this.clues);
		return this.clues;
	}

	// click handler for clicked Tds displaying $ amounts
	handleClick(e) {
		let targetID = e.target.id;

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height - 1; y++) {
				if (targetID.includes(`${y}-${x}`) && targetID) {
					this.lockboard = true;
					let clickedTD = document.getElementById(`${y}-${x}`);
					console.log(clickedTD);
					clickedTD.classList.add('zoom-in');
					console.log(this.clues[x][y].question);
					console.log(this.clues[x][y].answer);
				}
			}
		}
	}
}

let newGame = new Jeopardy('Sauvik', 'Bethany', 'Ez');
