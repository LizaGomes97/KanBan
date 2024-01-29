       
    const $modal = document.getElementById('modal');
    const $descriptionInput = document.getElementById('description');
    const $priorityInput = document.getElementById ('priority');
    const $deadLineInput = document.getElementById ('deadLine');
    const $columnInput = document.getElementById ('column');
    const $idInput = document.getElementById('idInput');
    
    const $creationModeTitle = document.getElementById('creationModeTitle');
    const $editingModeTitle = document.getElementById('editingModeTitle');
    const $botaoCad = document.getElementById('botaoCad');
    const $botaoEdt = document.getElementById('botaoEdt');
    var taskList =[];
       
    function openModal(data_column){
        $modal.style.display ="flex";

        $columnInput.value=data_column;

            $creationModeTitle.style.display = "block";
            $editingModeTitle.style.display = "none";
            $botaoCad.style.display = "block";
            $botaoEdt.style.display = "none";

    }
    
    function openModalToEdit(id){
        $modal.style.display ="flex";
               $creationModeTitle.style.display = "none";
               $botaoCad.style.display = "none";
               $botaoEdt.style.display = "block";
    
                
                $editingModeTitle.style.display = "block";
    
                const index = taskList.findIndex (function(task){
                    return task.id == id;
                });
    
                const task = taskList[index];
    
                $idInput.value= task.id;
                $descriptionInput.value = task.description;
                $priorityInput.value = task.priority;
                $deadLineInput.value = task.deadLine;
                $columnInput.value=task.column;
           
        
    }

    function closeModal(){
        $modal.style.display ="none";
        
        $idInput.value ='';
        $descriptionInput.value ='';
        $priorityInput.value='';
        $deadLineInput.value='';
        $columnInput.value='';
    }
    function resetColumns(){
        document.querySelector('[data-column="1"] .body .cards_list').innerHTML='';
        document.querySelector('[data-column="2"] .body .cards_list').innerHTML='';
        document.querySelector('[data-column="3"] .body .cards_list').innerHTML='';
        document.querySelector('[data-column="4"] .body .cards_list').innerHTML='';
    }
    
    function generateCards(){
        
        resetColumns();
    
         taskList.forEach(function(task){

            const formattedDate =moment(task.deadLine).format('DD/MM/YYYY');
            
            const columnBody = document.querySelector(`[data-column='${task.column}'] .body .cards_list`);

            const card = `
            <div 
            id="${task.id}"
            class="card"  
            ondblclick="openModalToEdit(${task.id})"
            draggable="true"
            ondragstart="dragstart_handler(event)"
            >
    
             <div class="info">
                <b>Descrição:</b>
                <span>${task.description}</span>
             </div>
    
             <div class="info">
                <b>Prioridade:</b>
                <span>${task.priority}</span>
             </div>
    
             <div class="info">
                <b>Prazo:</b>
                <span>${formattedDate}</span>
             </div>
    
            </div>
            `;

            columnBody.innerHTML += card;

        });
    
    }
    
    function createTask(){
        
        const newTask= {
            id: Math.floor(Math.random()*9999999),
            description : $descriptionInput.value,
            priority: $priorityInput.value,
            column: $columnInput.value,
            deadLine: $deadLineInput.value,
        }
        taskList.push(newTask);
       
        closeModal();
        generateCards();
    
    }
    
    function updateTask(){
        const task= {
            id: $idInput.value,
            description : $descriptionInput.value,
            priority: $priorityInput.value,
            column: $columnInput.value,
            deadLine: $deadLineInput.value,
        }
        const index = taskList.findIndex (function(task){
            return task.id == $idInput.value;
        });

        taskList[index]= task;

        closeModal();
        generateCards();

    }

    function changeColumn(task_id, column_id){
        if (task_id && column_id){
            taskList = taskList.map( (task) =>  {
                if (task_id !== task.id) return task;

                return {
                    ... task,
                    column: column_id,
    
                };
            }); 
            generateCards();  
        }
        
      
    }
    
    function dragstart_handler(ev) {
        console.log("Drag started");
        // Adiciona o id do elemento alvo para o objeto de transferência de dados
        ev.dataTransfer.setData("my_custom_data", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
      }
      function dragover_handler(ev) {
        console.log("Drag over");
        ev.preventDefault();
        // Define o dropEffect para ser do tipo move
        ev.dataTransfer.dropEffect = "move";
      }
      function drop_handler(ev) {
        console.log("Dropped");
        ev.preventDefault();
        // Pega o id do alvo e adiciona o elemento que foi movido para o DOM do alvo
        const task_id = ev.dataTransfer.getData("my_custom_data");
        const column_id = ev.target.dataset.column;
        changeColumn(task_id, column_id);
      }