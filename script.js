/* VARIÁVEIS */

const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-nome");
const sFuncao = document.querySelector("#m-funcao");
const sSalario = document.querySelector("#m-salario");
const btnSalvar = document.querySelector("#btnSalvar");

let itens; // Armazena os itens do nosso banco
let id; // Variável id irá armazenar o index para realizarmos a edição

const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? []; // Função que pega os itens do banco através do .getItem no banco DBfunc
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens)); // Função que irá setar a variável itens pra dentro do banco DBfunc

// Função que vai ser executada assim que a tela for carregada. Vai pegar os itens do banco, fazer um for em cada dado para que seja criada cada uma das novas linhas.
function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = "";
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

loadItens();

function insertItem(item, index) {
  // item do banco e o index
  let tr = document.createElement("tr"); // Cria elemento tr

  // Através do innerHTML, são criados o nome, a função e o salário e também as colunas de edição e exclusão, passando os icons do box-icons junto.
  tr.innerHTML = `
   <td>${item.nome}</td>
   <td>${item.funcao}</td>
   <td>R$ ${item.salario}</td>
   <td class="acao"> 
     <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
   </td>
   <td class="acao">
     <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
   </td>
 `;
  // Conforme cada item for carregado no insertItem, ele será integrado no tbody, que vai ser apresentado em tela.
  tbody.appendChild(tr);
}

// Função de edição: é passado o index e ela então chama a função openModal
function editItem(index) {
  openModal(true, index);
}

// Função de deleção: é passado o index do item e no array, vai ser feito um splice do index, removendo um item. Após isso, o banco será atualizado com o novo array e carregar os dados em tela.
function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

// Função abrir modal: quando for um novo item, que foi clicado direto no incluir, não será passado nenhum parâmetro, por isso estão opcionais.
function openModal(edit = false, index = 0) {
  modal.classList.add("active"); // Ao abrir o modal, ele será adicionado à classe active, para ficar visível em  tela.

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      // Caso clique fora do modal, ele irá fechar.
      modal.classList.remove("active");
    }
  };

  if (edit) {
    // Quando for um item de edição, ele irá carregar para os itens do modal o nome, a função e o salário já armazenados naquela lista.
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = itens[index].salario;
    id = index; // Atribui para a variável id o index do funcionário
  } else {
    // Caso não for uma edição, ele irá carregar com os valores em branco.
    sNome.value = "";
    sFuncao.value = "";
    sSalario.value = "";
  }
}

// Evento onclick do botão salvar
btnSalvar.onclick = (e) => {
  if (sNome.value == "" || sFuncao.value == "" || sSalario.value == "") {
    // Se deixar algum campo vazio, ele vai cair nessa validação pedindo pra preencher o campo.
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    // Se o id for diferente de undefined, ou seja, se ele vir de uma edição, o array será atualizado com os valores de tela.
    itens[id].nome = sNome.value;
    itens[id].funcao = sFuncao.value;
    itens[id].salario = sSalario.value;
  } else {
    // Caso contrário ele irá dar um push incluindo um novo item no banco.
    itens.push({
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: sSalario.value,
    });
  }

  setItensBD(); // Depois, ele irá atualizar o banco, sendo edição ou inclusão.

  modal.classList.remove("active"); // Ao fechar o modal, ele vai remover a classe active e atualizar novamente a lista de itens.
  loadItens();
  id = undefined;
};
