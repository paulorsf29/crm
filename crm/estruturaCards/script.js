// Script para Registro de Lead (indexCadastro.html)
document.addEventListener("DOMContentLoaded", () => {
  const leadForm = document.getElementById('lead-form');

  if (leadForm) {
    // Função para manipular o envio do formulário
    leadForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Captura os dados do formulário
      const leadData = {
        companyName: document.getElementById('company-name').value,
        oreType: document.getElementById('ore-type').value,
        companyType: document.getElementById('company-type').value,
        interestLevel: document.getElementById('interest-level').value,
        contactPerson: document.getElementById('contact-person').value,
        contactEmail: document.getElementById('contact-email').value,
        contactPhone: document.getElementById('contact-phone').value,
        observations: document.getElementById('observations').value
      };

      // Salva o lead no localStorage
      let leads = JSON.parse(localStorage.getItem('leads')) || [];
      leads.push(leadData);
      localStorage.setItem('leads', JSON.stringify(leads));

      alert('Lead registrado com sucesso!');

      // Redireciona para a página do CRM (Kanban)
      window.location.href = 'indexCrm.html';
    });
  }

  // Script para o CRM (indexCrm.html)
  const kanban = document.querySelector(".kanban");
  const addColumnButton = document.getElementById("add-column");
  const deleteLeadButton = document.getElementById("delete-lead");
  let selectedLead = null;

  // Função para adicionar um novo lead ao Kanban
  function addLeadToKanban(lead) {
    const selectedColumn = kanban.querySelector(".column:first-child"); // Coloca na primeira coluna por padrão
    
    if (selectedColumn) {
      const newItem = document.createElement("div");
      newItem.className = "item";
      newItem.draggable = true;
      newItem.innerHTML = `
        <h4>${lead.companyName}</h4>
        <p><strong>Minério:</strong> ${lead.oreType}</p>
        <p><strong>Tipo de Empresa:</strong> ${lead.companyType}</p>
        <p><strong>Nível de Interesse:</strong> ${lead.interestLevel}</p>
        <p><strong>Responsável:</strong> ${lead.contactPerson}</p>
        <p><strong>Email:</strong> ${lead.contactEmail}</p>
        <p><strong>Telefone:</strong> ${lead.contactPhone}</p>
        <p><strong>Observações:</strong> ${lead.observations}</p>
      `;
      // Adiciona evento de clique para seleção
      newItem.addEventListener("click", function () {
        if (selectedLead) {
          selectedLead.classList.remove("selected");
        }
        selectedLead = newItem;
        newItem.classList.add("selected");
      });
      selectedColumn.appendChild(newItem);
    }
  }

  // Função para adicionar a funcionalidade de drag and drop a uma coluna
  function enableDragAndDropForColumn(column) {
    column.addEventListener("dragover", (e) => {
      e.preventDefault(); // Necessário para permitir o drop
      const dragging = document.querySelector(".dragging");
      const applyAfter = getNewPosition(column, e.clientY);

      if (applyAfter) {
        applyAfter.insertAdjacentElement("afterend", dragging);
      } else {
        column.prepend(dragging);
      }
    });
  }

  // Função para carregar leads do localStorage e adicionar ao Kanban
  if (kanban) {
    let leads = JSON.parse(localStorage.getItem('leads')) || [];
    leads.forEach(lead => addLeadToKanban(lead));
  }

  // Função para adicionar uma nova coluna
  function addColumn() {
    const columnCount = document.querySelectorAll('.column').length;
    
    if (columnCount < 8) {
      const newColumn = document.createElement('div');
      newColumn.className = 'column';
      newColumn.setAttribute('contenteditable', 'true');
      
      // Adiciona o conteúdo da coluna junto com o ícone de lixeira
      newColumn.innerHTML = `
        <h4>Nova Coluna</h4>
        <button class="delete-column" style="background:none;border:none;color:white;cursor:pointer;">
          🗑️
        </button>
      `;
      
      // Adiciona a coluna ao kanban
      kanban.appendChild(newColumn);
  
      // Ativa drag and drop na nova coluna
      enableDragAndDropForColumn(newColumn);
  
      // Adiciona o evento de excluir à lixeira
      newColumn.querySelector('.delete-column').addEventListener('click', function() {
        newColumn.remove();
      });
    } else {
      alert("limite maximo de 8 colunas.");
    }
    
  }

  // Função para excluir o lead selecionado
  function deleteSelectedLead() {
    if (selectedLead) {
      const leadName = selectedLead.querySelector('h4').textContent;

      // Remove visualmente o card
      selectedLead.remove();

      // Remove do localStorage
      let leads = JSON.parse(localStorage.getItem('leads')) || [];
      leads = leads.filter(lead => lead.companyName !== leadName);
      localStorage.setItem('leads', JSON.stringify(leads));

      alert(`${leadName} foi excluído com sucesso.`);
      selectedLead = null;
    } else {
      alert("Selecione um lead para excluir.");
    }
  }

  // Adicionando eventos aos botões
  if (addColumnButton) {
    addColumnButton.addEventListener("click", addColumn);
  }

  if (deleteLeadButton) {
    deleteLeadButton.addEventListener("click", deleteSelectedLead);
  }

  // Adiciona drag and drop para todas as colunas iniciais
  const initialColumns = document.querySelectorAll(".column");
  initialColumns.forEach(column => enableDragAndDropForColumn(column));

  // Funções de arrastar e soltar
  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });

  document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });

  function getNewPosition(column, posY) {
    const cards = column.querySelectorAll(".item:not(.dragging)");
    let result;

    for (let refer_card of cards) {
      const box = refer_card.getBoundingClientRect();
      const boxCenterY = box.y + box.height / 2;

      if (posY >= boxCenterY) result = refer_card;
    }

    return result;
  }

  // Script para redimensionar a barra lateral
  const resizer = document.querySelector('.resizer');
  const sideNav = document.querySelector('.side-nav');
  let isResizing = false;

  if (resizer) {
    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
      });
    });
  }

  function handleMouseMove(e) {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 100) { // Limita a largura mínima para a side-nav
        sideNav.style.width = `${newWidth}px`;
      }
    }
  }
});
