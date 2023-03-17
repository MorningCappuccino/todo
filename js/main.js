// 1. Находим элементы на странице
// 2. Находим form
const form = document.querySelector('#form');
// console.log(form);

// 3. Находим input
const input = document.querySelector('#taskInput');
// console.log(input);

// 5.1 Находим Ul чтобы добавить задачу на страницу
const taskList = document.querySelector('#tasksList');

 // 5.3 Находим li чтобы скрыть блок "СПИСОК ДЕЛ ПУСТ"
const emptyList = document.querySelector('#emptyList');



// 8 РАБОТА С ДАННЫМИ создаем пустой массив
   let tasks = []; 
   checkEmptyList();

    // 17 Получили мы что то из Localstorage
    if(localStorage.getItem('tasks')) {
       tasks =  JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task) {
    
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`
    taskList.insertAdjacentHTML('beforeend', taskHTML);
    })

    // 5. Вешаем прослушку на form метод "submit" Добавление задачи
    form.addEventListener('submit', addTask) 

    // 5. Пишем Функцию addTask добавление задачи
    function addTask(event) {
        // отменяем отправку формы
     event.preventDefault(); //Метод отменяет стандартную перезагрузку страницы
   // console.log('SUBMIT!!!');

   
// Достаем текст задачи из поля ввода
    const taskText = input.value
    console.log(taskText);

    // 9 Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // 9.1 Добавляем задачу в массив с задачами
    tasks.push(newTask);
     console.log(tasks);
    
    // 9.2 Формируем css class
    const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

    // Формируем разметку для новой задачи
    const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`
    // console.log(taskHTML)

    // 5.1 Добавляем задачу на страницу
    taskList.insertAdjacentHTML('beforeend', taskHTML);

    // 5.2 Очищаем поле ввода и возвращаем на него фокус
    input.value = '';
    input.focus()
    
    // 5.3 Скрываем блок "СПИСОК ДЕЛ ПУСТ"
    // Проверка. Если в списке задач более 1-го элемента,скрываем блок СПИСОК ДЕЛ ПУСТ
    // if(taskList.children.length > 1) {
    //     emptyList.classList.add('none')
    // }
    checkEmptyList();
    saveToLocalStorage();
    }

    // 6. Удаление задачи
    taskList.addEventListener('click', deleteTask)

    // 6. Пишем функцию deleteTask
    function deleteTask(event) {
        // console.log('deleteTask');
        // console.log(event.target);

        // Проверяем что клик был по кнопке "удалить задачу"
        if(event.target.dataset.action === 'delete') {
            console.log('DELETE');
            const parenNode = event.target.closest('.list-group-item');
            console.log(parenNode);


            // 10 Определяем ID задачи
            const id = parenNode.id
            console.log(id);

            // 11 Находим индекс задачи в массиве 
            // const index = tasks.findIndex(function(task) {
            //    console.log(task);
            //    if (task.id == id) {
            //     return true
            //    }
            // })
            //  console.log(index);

            //  12 Удаляем задачу из массива с задачами 
            // tasks.splice(index, 1)
            // console.log(index);

            //    13 Удаляем задачу через фильтрации массива
            tasks = tasks.filter(function (task) {
                if (task.id == id) {
                    return false
                } else {
                    return true
                }
            })
            console.log(tasks);

            // Удаляем задачу из разметки
            parenNode.remove();

            // Проверка. Если в списке задач  1  элемент, то показываем  блок СПИСОК ДЕЛ ПУСТ
            // if(taskList.children.length === 1) {
            // emptyList.classList.remove('none')
            // }
        }
        checkEmptyList();
        saveToLocalStorage();

    }

    // 7. Отмечаем задачу завершенной
    taskList.addEventListener('click', doneTask)

     // 7. Пишем функцию doneTask
     function doneTask(event) {
    //   console.log('doneTask');
    //   console.log(event.target);
       
        // Проверяем что клик был по кнопке "выполнить задачу"
        if(event.target.dataset.action === 'done') {
            console.log('DONE');
            const parenNode = event.target.closest('.list-group-item');
            
            // 14 Определяем ID задачи
            const id = parenNode.id;
            // Находим задачу в массиве задач
             const task = tasks.find(function(task) {
                if(task.id == id) {
                   return true;
                }
            })
            task.done = !task.done
            console.log(task);

            const taskTitle = parenNode.querySelector('.task-title');

            taskTitle.classList.toggle('task-title--done');
            // taskTitle.classList.add('task-title--done');
            console.log(parenNode);
            console.log(taskTitle);
        }
        saveToLocalStorage();
     }


    //   15 Создаем функцию на открытие и закрытие блока СПИСОК ДЕЛ через базу данных
    function checkEmptyList() {
        if(tasks.length === 0) {
           const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
           <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
           <div class="empty-list__title " >Список дел пуст</div>
       </li>`;
         
       taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
        }

        if(tasks.length > 0) {
            const emptyListEl = document.querySelector('#emptyList');
            emptyListEl ? emptyListEl.remove() : null;
        }
    }

    // 16 Сохранение массива с задачами в localStorage
    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }








   




