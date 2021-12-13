const initialState = {
    filter: 'SHOW_ALL',
    tasks: [
        { id: 1, title: "Learn HTML", done: true },
        { id: 2, title: "Learn React", done: false },
        { id: 2, title: "Learn Redux", done: false }
    ]
}

//in our script, we already have the REdux variable in the global scope
// see line 24 of index.html

const { createStore } = Redux;

// 2 actions
//CHANGED_FILTER
//TOGGLED_DONE
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGED_FILTER':
            return {
                ...state,
                filter: action.payload //SHOW_DONE or SHOW_ALL or SHOW_TODO
            };

        case 'TOGGLED_DONE':
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    if (task.id === action.payload) {
                        return { ...task, done: !task.done }
                    } else {
                        return { ...task }
                    }
                }
                )
            };
        default:
            return state;
    }
}

const store = createStore(reducer);

const taskList = document.getElementById('task-list');
const filterSelector = document.getElementById('filter-selector');

function render() {
    // Get tasks from state
    const { tasks, filter } = store.getState();

    // Filter tasks according to filter value
    const filteredTasks = tasks.filter(
        task => (
            filter === 'SHOW_ALL'
            || (filter === 'SHOW_TODO' && !task.done)
            || (filter === 'SHOW_DONE' && task.done)
        )
    );

    // Generate HTML items from tasks
    const listItems = filteredTasks
        .map(task => {
            // Draw a line through the task if it's done
            const style = task.done ? 'text-decoration: line-through' : '';
            return `<li style="${style}">${task.title}</li>`;
        });

    // Join the items to build a single string
    taskList.innerHTML = listItems.join('');

    const taskItems = taskList.getElementsByTagName('li');
    for (let i = 0; i < taskItems.length; i++) {
        // Get id of the task that matches the task item
        const taskId = filteredTasks[i].id;
        taskItems[i].addEventListener(
            'click',
            e => store.dispatch({
                type: 'TOGGLED_DONE',
                payload: taskId
            })
        );
    }
}

render();

filterSelector.addEventListener('change', event => {
    store.dispatch({
        type: 'CHANGED_FILTER',
        payload: event.target.value
    })
})

store.subscribe(render);
