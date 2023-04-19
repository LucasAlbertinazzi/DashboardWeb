$(document).ready(function () {

    // Carrega os cards na página
    loadCards();

    // Formata as datas dos chamados
    formatDate();

    // Abre o modal de criação de card
    $(document).on("click", "#add-button", function () {
        $("#add-modal").css("display", "block");
    });

    // Fecha o modal de criação de card
    $(document).on("click", "#add-close-button", function () {
        $("#add-modal").css("display", "none");
    });

    // Cria um novo card
    $(document).on("submit", "#add-form", function (event) {
        event.preventDefault();
        let title = $("#add-title").val();
        let description = $("#add-description").val();
        let priority = $("#add-priority").val();
        createCard(title, description, priority);
        $("#add-modal").css("display", "none");
        $("#add-form")[0].reset();
    });

    // Abre o modal de edição de card
    $(document).on("click", ".edit-button", function () {
        let cardElement = $(this).parents(".card");
        let cardId = cardElement.data("id");
        let cardTitle = cardElement.find(".card-title").text();
        let cardDescription = cardElement.find(".card-description").text();
        let cardPriority = cardElement.find(".card-priority").text();
        $("#edit-id").val(cardId);
        $("#edit-title").val(cardTitle);
        $("#edit-description").val(cardDescription);
        $("#edit-priority").val(cardPriority);
        $("#edit-modal").css("display", "block");
    });

    // Fecha o modal de edição de card
    $(document).on("click", "#edit-close-button", function () {
        $("#edit-modal").css("display", "none");
    });

    // Atualiza um card existente
    $(document).on("submit", "#edit-form", function (event) {
        event.preventDefault();
        let id = $("#edit-id").val();
        let title = $("#edit-title").val();
        let description = $("#edit-description").val();
        let priority = $("#edit-priority").val();
        updateCard(id, title, description, priority);
        $("#edit-modal").css("display", "none");
    });

    // Deleta um card
    $(document).on("click", ".delete-button", function () {
        let cardElement = $(this).parents(".card");
        let cardId = cardElement.data("id");
        deleteCard(cardId);
    });

});

function loadCards() {
    $.ajax({
        url: "https://my-json-server.typicode.com/rafacdomin/kanban-api/cards",
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let card = data[i];
                createCardElement(card);
            }
        },
        error: function () {
            alert("Ocorreu um erro ao carregar os cards.");
        }
    });
}

function createCard(title, description, priority) {
    $.ajax({
        url: "https://my-json-server.typicode.com/rafacdomin/kanban-api/cards",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            title: title,
            description: description,
            priority: priority
        }),
        success: function (data) {
            createCardElement(data);
        },
        error: function (xhr, status, error) {
            console.log("Error creating card:", error);
        }
    });
}

function editCard(id, title, description, priority) {
    $.ajax({
        url: "https://my-json-server.typicode.com/rafacdomin/kanban-api/cards/" + id,
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            title: title,
            description: description,
            priority: priority
        }),
        success: function (data) {
            let cardElement = $(".card[data-id='" + data.id + "']");
            cardElement.find(".card-title").text(data.title);
            cardElement.find(".card-description").text(data.description);
            cardElement.find(".card-priority").text(data.priority);
        },
        error: function (xhr, status, error) {
            console.log("Error editing card:", error);
        }
    });
}

function deleteCard(id) {
    $.ajax({
        url: "https://my-json-server.typicode.com/rafacdomin/kanban-api/cards/" + id,
        type: "DELETE",
        dataType: "json",
        success: function () {
            $(".card[data-id='" + id + "']").remove();
        },
        error: function (xhr, status, error) {
            console.log("Error deleting card:", error);
        }
    });
}

function createCardElement(card) {
    let cardElement = $("<div>", { class: "card", "data-id": card.id });
    let cardHeader = $("<div>", { class: "card-header" });
    let cardTitle = $("<div>", { class: "card-title" }).text(card.title);
    let cardMenu = $("<div>", { class: "card-menu" });
    let editButton = $("<button>", { class: "edit-button" }).html('<i class="fas fa-edit"></i>');
    let deleteButton = $("<button>", { class: "delete-button" }).html('<i class="fas fa-trash-alt"></i>');
    let cardDescription = $("<div>", { class: "card-description" }).text(card.description);
    let cardInfo = $("<div>", { class: "card-info" });
    let cardPriority = $("<div>", { class: "card-priority" }).text(card.priority);

    cardMenu.append(editButton, deleteButton);
    cardHeader.append(cardTitle, cardMenu);
    cardInfo.append(cardPriority);
    cardElement.append(cardHeader, cardDescription, cardInfo);
    $("#todo-column .column-content").append(cardElement);
}

function init() {
    $.ajax({
        url: "https://my-json-server.typicode.com/rafacdomin/kanban-api/cards",
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                createCardElement(data[i]);
            }
        },
        error: function (xhr, status, error) {
            console.log("Error loading cards:", error);
        }
    });

    $("#add-form").on("submit", function (event) {
        event.preventDefault();
        let title = $("#add-title").val();
        let description = $("#add-description").val();
        let priority = $("#add-priority").val();
        createCard(title, description, priority);
        $("#add-modal").removeClass("show-modal");
        $("#add-form")[0].reset();
    });
}      
