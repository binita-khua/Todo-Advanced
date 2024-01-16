document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.querySelector('.task-list');
  const importantTaskList = document.querySelector('.important-task-list');
  const taskInput = document.getElementById('task-input');
  const navLinks = document.querySelectorAll('.menu .nav-link');
  const starButtons = document.querySelectorAll('.star-btn');
  const importantLink = document.querySelector('.menu .nav-link:nth-child(2)');
  const myDayLink = document.querySelector('.menu .nav-link:first-child');

  const tasks = []; // Array to store all tasks

  function createTask(name) {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task');

      const taskCheckbox = document.createElement('input');
      taskCheckbox.type = 'checkbox';
      taskCheckbox.className = 'task-checkbox';
      taskCheckbox.addEventListener('change', () => {
          if (taskCheckbox.checked) {
              taskItem.classList.add('completed');
          } else {
              taskItem.classList.remove('completed');
          }
      });

      const taskText = document.createElement('span');
      taskText.textContent = name;
      taskText.className = 'task-text';

      const taskActionsContainer = document.createElement('div');
      taskActionsContainer.classList.add('task-actions');

      const starBtn = document.createElement('button');
      starBtn.textContent = 'Star';
      starBtn.className = 'star-btn';
      starBtn.onclick = () => toggleImportant(taskItem, name);

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      editBtn.onclick = () => makeEditable(taskText, editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = () => deleteTask(taskItem, name);

      taskActionsContainer.appendChild(starBtn);
      taskActionsContainer.appendChild(editBtn);
      taskActionsContainer.appendChild(deleteBtn);

      taskItem.appendChild(taskCheckbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(taskActionsContainer);

      return taskItem;
  }

  function toggleImportant(taskItem, name) {
      const isImportant = taskItem.classList.toggle('important');
      const index = tasks.findIndex(task => task.name === name);

      if (isImportant) {
          tasks[index].important = true;
      } else {
          tasks[index].important = false;
      }
      updateNavLinksActiveState();
      showImportantTasks();
  }

  function makeEditable(taskTextElement, editButton) {
      const originalText = taskTextElement.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalText;
      input.className = 'edit-input';

      taskTextElement.parentNode.replaceChild(input, taskTextElement);

      editButton.textContent = 'Save';
      editButton.onclick = () => saveEdits(input, originalText, editButton);
  }

  function saveEdits(inputElement, originalText, editButton) {
      const newTaskText = document.createElement('span');
      newTaskText.className = 'task-text';
      newTaskText.textContent = inputElement.value.trim() || originalText;

      inputElement.parentNode.replaceChild(newTaskText, inputElement);

      editButton.textContent = 'Edit';
      editButton.onclick = () => makeEditable(newTaskText, editButton);
  }

  function deleteTask(taskItem, name) {
      taskItem.remove();
      const index = tasks.findIndex(task => task.name === name);
      if (index !== -1) {
          tasks.splice(index, 1);
      }
      updateNavLinksActiveState();
      showImportantTasks();
  }

  addTaskBtn.addEventListener('click', () => {
      const taskName = taskInput.value.trim();
      if (taskName) {
          const taskItem = createTask(taskName);
          taskList.appendChild(taskItem);
          tasks.push({ name: taskName, important: false });
          taskInput.value = '';
      }
  });

  navLinks.forEach(navLink => {
      navLink.addEventListener('click', () => {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');

          const index = Array.from(navLinks).indexOf(navLink);
          switch (index) {
              case 1: // Important
                  importantTaskList.classList.remove('hidden');
                  taskList.classList.add('hidden');
                  showImportantTasks();
                  break;
              default: // My Day, Planned, or Tasks
                  taskList.classList.remove('hidden');
                  importantTaskList.classList.add('hidden');
                  break;
          }
      });
  });

  starButtons.forEach((starBtn, index) => {
      starBtn.addEventListener('click', () => {
          const taskItem = starBtn.closest('.task');
          const taskText = taskItem.querySelector('.task-text');
          toggleImportant(taskItem, taskText.textContent);
      });
  });

  function showImportantTasks() {
      importantTaskList.innerHTML = ''; // Clear the Important list

      tasks.forEach(task => {
          if (task.important) {
              const taskItem = createTask(task.name);
              importantTaskList.appendChild(taskItem);
              taskItem.classList.add('important');
          }
      });
  }

  function updateNavLinksActiveState() {
      if (importantTaskList.children.length > 0) {
          importantLink.classList.add('active');
          myDayLink.classList.remove('active');
      } else {
          myDayLink.classList.add('active');
          importantLink.classList.remove('active');
      }
  }
});
