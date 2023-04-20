// array de dados dos chamados
const chamados = [
    {
        numero: 1,
        tipoServico: "Suporte",
        descricao: "Problema no servidor",
        usuarioAbertura: "João",
        dataAbertura: "2022-04-21",
        tempoDesenvolvimento: "00:00:00",
        prioridade: 1,
    },
    {
        numero: 2,
        tipoServico: "Desenvolvimento",
        descricao: "Desenvolvimento de nova funcionalidade",
        usuarioAbertura: "Maria",
        dataAbertura: "2022-04-22",
        tempoDesenvolvimento: "00:00:00",
        prioridade: 2,
    },
    {
        numero: 3,
        tipoServico: "Suporte",
        descricao: "Problema na conexão com a internet",
        usuarioAbertura: "Pedro",
        dataAbertura: "2022-04-23",
        tempoDesenvolvimento: "00:00:00",
        prioridade: 3,
    },

];

// array que guarda todos os cards
let cards = [];

// código a ser executado após o carregamento da página
function initCards() {
    const todoList = document.getElementById("todo-list");

    for (let chamado of chamados) {
        const card = createCard(chamado);
        todoList.appendChild(card);
    }

    // adiciona listeners para drag and drop
    todoList.addEventListener("dragstart", handleDragStart);
    todoList.addEventListener("dragover", handleDragOver);
    todoList.addEventListener("drop", handleDrop);
}

// função para lidar com o evento de início do drag
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.priority);
}

// função para lidar com o evento de passagem do mouse sobre a área de drop
function handleDragOver(event) {
    event.preventDefault();
}

// função para lidar com o evento de soltura do card
function handleDrop(event) {
    const priority = event.dataTransfer.getData("text");
    const card = document.querySelector(`[data-priority="${priority}"]`);

    event.target.appendChild(card);
}

// função para carregar o timer
function formatTime(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    // Adiciona um zero na frente dos números menores que 10
    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return hours + ":" + minutes + ":" + seconds;
}


// função que cria um card com base nos dados de um chamado
function createCard(chamado) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-priority", chamado.prioridade);

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const cardButtons = document.createElement("div");
    cardButtons.classList.add("card-buttons");

    const playButton = document.createElement("button");
    playButton.classList.add("card-button", "play-button");
    playButton.innerHTML = '<i class="fas fa-play"></i>';

    const pauseButton = document.createElement("button");
    pauseButton.classList.add("card-button", "pause-button");
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';

    const stopButton = document.createElement("button");
    stopButton.classList.add("card-button", "stop-button");
    stopButton.innerHTML = '<i class="fas fa-stop"></i>';

    const cardServiceType = document.createElement("p");
    cardServiceType.classList.add("card-service-type");
    cardServiceType.textContent = `Tipo de serviço: ${chamado.tipoServico}`;

    const cardDescription = document.createElement("p");
    cardDescription.classList.add("card-description");
    cardDescription.textContent = `Descrição: ${chamado.descricao}`;

    const cardUser = document.createElement("p");
    cardUser.classList.add("card-user");
    cardUser.textContent = `Usuário: ${chamado.usuarioAbertura}`;

    cardButtons.appendChild(playButton);
    cardButtons.appendChild(pauseButton);
    cardButtons.appendChild(stopButton);

    cardContent.appendChild(cardServiceType);
    cardContent.appendChild(cardDescription);
    cardContent.appendChild(cardUser);
    cardContent.appendChild(cardButtons);

    card.appendChild(cardContent);

    // objeto que representa o timer do card
    const timer = {
        startTime: null,
        elapsedTime: null,
        timerId: null,
    };

    // adiciona os listeners de eventos aos botões
    playButton.addEventListener("click", () => {
        playTimer(timer, card);
    });

    pauseButton.addEventListener("click", () => {
        pauseTimer(timer);
    });

    stopButton.addEventListener("click", () => {
        stopTimer(timer, card);
    });

    return card;
}

// função que adiciona um card na lista
function addCard(numero, tipoServico, descricao, usuarioAbertura, dataAbertura, tempoDesenvolvimento, prioridade) {
    // cria um novo objeto com as informações do card
    const card = {
        numero: numero,
        tipoServico: tipoServico,
        descricao: descricao,
        usuarioAbertura: usuarioAbertura,
        dataAbertura: dataAbertura,
        tempoDesenvolvimento: tempoDesenvolvimento,
        prioridade: prioridade,
        timerInterval: null
    };

    // adiciona o card na lista de cards
    cards.push(card);

    // renderiza o card na tela
    renderCard(card);
}

// função que renderiza um card na tela
function renderCard(card) {
    // cria os elementos HTML do card
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.priority = card.prioridade;

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const cardNumber = document.createElement("h3");
    cardNumber.classList.add("card-number");
    cardNumber.textContent = `#${card.numero}`;

    const cardButtons = document.createElement("div");
    cardButtons.classList.add("card-buttons");

    const playButton = document.createElement("button");
    playButton.classList.add("card-button", "play-button");
    playButton.innerHTML = '<i class="fas fa-play"></i>';

    const pauseButton = document.createElement("button");
    pauseButton.classList.add("card-button", "pause-button");
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';

    const stopButton = document.createElement("button");
    stopButton.classList.add("card-button", "stop-button");
    stopButton.innerHTML = '<i class="fas fa-stop"></i>';

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-content");

    const cardServiceType = document.createElement("div");
    cardServiceType.classList.add("card-service-type");
    cardServiceType.textContent = card.tipoServico;

    const cardDescription = document.createElement("div");
    cardDescription.classList.add("card-description");
    cardDescription.textContent = card.descricao;

    const cardUser = document.createElement("div");
    cardUser.classList.add("card-user");
    cardUser.textContent = "Aberto por ${card.usuarioAbertura} em ${card.dataAbertura}";

    const cardTimer = document.createElement("div");
    cardTimer.classList.add("card-timer");
    cardTimer.textContent = card.tempoDesenvolvimento;

    // adiciona os listeners de eventos aos botões
    playButton.addEventListener("click", () => playTimer(cardTimer, card));
    pauseButton.addEventListener("click", () => pauseTimer(card));
    stopButton.addEventListener("click", () => stopTimer(card));

    // adiciona os elementos HTML do card na página
    cardButtons.appendChild(playButton);
    cardButtons.appendChild(pauseButton);
    cardButtons.appendChild(stopButton);

    cardBody.appendChild(cardServiceType);
    cardBody.appendChild(cardDescription);
    cardBody.appendChild(cardUser);
    cardBody.appendChild(cardTimer);

    cardHeader.appendChild(cardNumber);
    cardHeader.appendChild(cardButtons);

    cardElement.appendChild(cardHeader);
    cardElement.appendChild(cardBody);

    cardList.appendChild(cardElement);
}

// função que inicia o timer do card e pausa todos os outros
function playTimer(timerElement, card) {
    cards.forEach((c) => {
        if (c.numero !== card.numero && c.intervalId !== null) {
            pauseTimer(c);
        }
    });

    // armazena o horário de início do timer
    card.timerInicio = Date.now();

    // define um intervalo para atualizar o tempo restante
    card.intervalId = setInterval(() => {
        // calcula o tempo decorrido desde o início do timer
        const tempoDecorrido = Date.now() - card.timerInicio;
        // atualiza o tempo restante
        card.tempoDesenvolvimento = formatTime(tempoDecorrido);

        // atualiza o elemento HTML que exibe o tempo restante
        timerElement.innerHTML = card.tempoDesenvolvimento;
    }, 1000);
}

// função que pausa o timer do card
function pauseTimer(card) {
    if (card.intervalId !== null) {
        clearInterval(card.intervalId);
        card.intervalId = null;
    }
}

// função que para o timer do card e reseta o tempo de desenvolvimento
function stopTimer(timerElement, card) {
    pauseTimer(card);
    card.timerInicio = null;
    card.tempoDesenvolvimento = "00:00:00";
    timerElement.innerHTML = card.tempoDesenvolvimento;
}

// função que remove um card da lista
function removeCard(numero) {
    // encontra o índice do card com o número especificado
    const index = cards.findIndex((card) => card.numero === numero);

    if (index !== -1) {
        // remove o card do array
        cards.splice(index, 1);
        // atualiza a lista de cards
        renderCards();

    }
}
