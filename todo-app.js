(function () {

	let itemsArray = 	[]// массив всех дел
	let listName = '';

//  Создание титула
	function createAppTitle(title) { 
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title;
		return appTitle;
	}
// Создание формы
	function createTodoItemForm() {
		let form = document.createElement('form');
		let input = document.createElement('input');
		let buttonWrapper = document.createElement('div');
		let button = document.createElement('button');
		let deleteAllButton = document.createElement('button');

		form.classList.add('input-group', 'mb-3');
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		buttonWrapper.classList.add('input-group-append');
		button.classList.add('btn', 'btn-primary');
		button.textContent = 'Добавить дело';
		deleteAllButton.classList.add('btn', 'btn-danger');
		deleteAllButton.setAttribute('type', 'button');
		deleteAllButton.textContent = 'Удалить все дела';

		if (!input.value) {
			button.disabled = true;
		};

		buttonWrapper.append(button);
		buttonWrapper.append(deleteAllButton);
		form.append(input);
		form.append(buttonWrapper);

		return {
			form,
			input,
			button,
			deleteAllButton,
		};
	};

	// создание массива дел с объектами в localStorage
	function saveItem (arr, listStorageName) {
		localStorage.setItem(listStorageName, JSON.stringify(arr));
	}
	// создание id
	function setId(arr) {
		let max = 0;
		for (const item of arr) {
			if (item.id > max) max = item.id;
		}
		return max + 1;
	}
	// создание дела
	function createTodoItem (name, storageName) {
		let item = document.createElement('li');
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');
		console.log (itemsArray);
		// объект дела
		let itemObject = {};
		// формирование объекта
		itemObject.name = name;
		itemObject.done = false;
		// получение текущих дел из localStorage
		let savedItems = localStorage.getItem(storageName);
		let parseArray = JSON.parse(savedItems); // распарcенный массив 
		itemsArray = parseArray; // установка массива дел из localStorage в itemsArray

		// добавление нового элемента в массив
		itemsArray.push(itemObject);

		// присваивание id элементу
		itemObject.id = setId(itemsArray);

		// сохранение дела в localStorage
		saveItem(itemsArray, storageName);

		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		item.textContent = name;

		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		return {
			item,
			doneButton,
			deleteButton,
			itemObject,
		};
	};

// создание листа
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list;
	}

// создание приложения
	function createTodoApp(container, title = 'Список дел', keyName) {
		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();

		listName = keyName;

		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

		// создание массива дел в localStorage, если их нет
		if (localStorage.getItem(listName) === null) {
			localStorage.setItem(listName, JSON.stringify([]));
		}

		// показ всех дел из массива itemsArray, если они там есть
		if (localStorage.length !== 0) {
			let savedItems = localStorage.getItem(listName);
			let parseArray = JSON.parse(savedItems); // распарcенный массив 
			let itemsList = document.querySelector('.list-group');
			console.log (parseArray);
			console.log (localStorage);

			for (let item of parseArray) {
				let li = document.createElement('li');
				li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
				li.textContent = item.name;

				let buttonGroup = document.createElement('div');
				buttonGroup.classList.add('btn-group', 'btn-group-sm');
		
				let doneButton = document.createElement('button');
				doneButton.classList.add('btn', 'btn-success');
				doneButton.textContent = 'Готово';
		
				let deleteButton = document.createElement('button');
				deleteButton.classList.add('btn', 'btn-danger');
				deleteButton.textContent = 'Удалить';

				buttonGroup.append(doneButton, deleteButton);
				li.append(buttonGroup);

				itemsList.append(li);

				if (item.done === true) {
					li.classList.add('list-group-item-success');
					doneButton.setAttribute('disabled', true);
				}

				// нажатие готово кнопки
				doneButton.addEventListener('click', function() {
					li.classList.add('list-group-item-success');
					doneButton.setAttribute('disabled', true);
					// изменение состояния done в объекте
					item.done = true;
					localStorage.setItem(listName, JSON.stringify(parseArray)); // сохранение массива в localStorage
			});

			// нажатие удалить кнопки
				deleteButton.addEventListener('click', function() {
					if (confirm('Вы уверены?')) {
						li.remove();
					// удаление объекта из массива
						let index = parseArray.indexOf(item);
						parseArray.splice(index, 1); 
						localStorage.setItem(listName, JSON.stringify(parseArray)); // сохранение массива в localStorage
				};
			});
			};
		};

		// установка атрибута disabled, если в input ничего не введено
		todoItemForm.input.addEventListener('input', function() {
			if (!todoItemForm.input.value) {
				todoItemForm.button.setAttribute('disabled', true);
			} else {
				todoItemForm.button.removeAttribute('disabled');
			}
		});

		// нажатие кнопки удалить все дела
			todoItemForm.deleteAllButton.addEventListener('click', function (){
				if (confirm('Вы уверены?')) {
					let itemsList = document.querySelector('.list-group');
					itemsList.querySelectorAll('li').forEach(function(item) {
							item.remove();
					});
					itemsArray.splice(0, itemsArray.length);
					localStorage.clear();
				};
			});
			
		// отправка формы
		todoItemForm.form.addEventListener('submit', function(e) {
			e.preventDefault();
			if (!todoItemForm.input.value) {
				return;
			}

			todoItemForm.button.setAttribute('disabled', true);
			let todoItem = createTodoItem(todoItemForm.input.value, listName);
			let itemObject = todoItem.itemObject;
			// нажатие готово кнопки
			todoItem.doneButton.addEventListener('click', function() {
				todoItem.item.classList.toggle('list-group-item-success');
				todoItem.doneButton.setAttribute('disabled', true);
				// изменение состояния done в объекте
				let object = itemsArray.find(item => item.id === itemObject.id);
				object.done = true;
				itemsArray.push(object);
				saveItem(itemsArray, listName); // сохранение изменений
				console.log (itemsArray);
			});
			// нажатие удалить кнопки
			todoItem.deleteButton.addEventListener('click', function() {
				if (confirm('Вы уверены?')) {
					todoItem.item.remove();
					// удаление объекта из массива
					let itemObject = todoItem.itemObject;
					let index = itemsArray.findIndex(item => item.id === itemObject.id);
					if (index !== -1) {
						itemsArray.splice(index, 1); // удаление объекта дела из массива
					}
					saveItem(itemsArray, listName); // сохранение изменений в localStorage
				};
			});

			todoList.append(todoItem.item);

			todoItemForm.input.value = '';
		});
	}
	
	window.createTodoApp = createTodoApp;
})();