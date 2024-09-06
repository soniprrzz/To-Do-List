document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = input.value;
      if (task) {
        fetch('/add-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(data => {
          displayTask(data);
          input.value = '';
        });
      }
    });
  
    function displayTask(task) {
      const li = document.createElement('li');
  
      // Checkbox
      const checkboxWrapper = document.createElement('label');
      checkboxWrapper.className = 'checkbox-wrapper';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `task${task._id}`;
      const customCheckbox = document.createElement('span');
      customCheckbox.className = 'custom-checkbox';
      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(customCheckbox);
  
      // Task text
      const taskText = document.createElement('span');
      taskText.textContent = task.task;
  
      // Remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'remove';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        console.log(`Removing task with ID: ${task._id}`);
        fetch(`/delete-task/${task._id}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(() => {
            li.remove();
          })
          .catch(err => console.error('Error removing task:', err));
      });
  
      li.appendChild(checkboxWrapper);
      li.appendChild(taskText);
      li.appendChild(removeButton);
  
      taskList.appendChild(li);
    }
  
    // Load existing tasks
    fetch('/tasks')
      .then(response => response.json())
      .then(tasks => {
        tasks.forEach(task => displayTask(task));
      });
  });
