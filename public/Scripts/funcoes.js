function exibirDetalhes(element) {
    const listItem = element.closest('.funcionario, .relatorio');
    const detalhesConteudo = listItem.nextElementSibling;
    detalhesConteudo.style.display = detalhesConteudo.style.display === 'grid' ? 'none' : 'grid';
}

function adicionarMascaraCPF(porName) {
    const campos = document.getElementsByName(porName);
    if (campos && campos.length > 0) {
        campos.forEach(campo => {
            const mascaraCPF = IMask(campo, {
                mask: '000.000.000-00'
            });
        });
    }
}

function adicionarMascaraTelefone(porName) {
    const campos = document.getElementsByName(porName);
    if (campos && campos.length > 0) {
        campos.forEach(campo => {
            const mascaraTelefone = IMask(campo, {
                mask: '(00) 00000-0000'
            });
        });
    }
}

function adicionarMascaraCEP(porName) {
    const campos = document.getElementsByName(porName);
    if (campos && campos.length > 0) {
        campos.forEach(campo => {
            const mascaraTelefone = IMask(campo, {
                mask: '00000-000'
            });
        });
    }
}

function pesquisarFuncionario() {
    var termoPesquisa = document.getElementById("searchFuncionario").value.toLowerCase();
    var funcionarios = document.querySelectorAll('.funcionario-nome span');

    for (var i = 0; i < funcionarios.length; i++) {
        var nomeFuncionario = funcionarios[i].textContent.toLowerCase();
        var listItem = funcionarios[i].closest('.funcionario');

        if (nomeFuncionario.includes(termoPesquisa)) {
            listItem.style.display = "grid";
        } else {
            listItem.style.display = "none";
        }
    }
}


function pesquisarBrinquedo() {
    var termoPesquisa = document.getElementById("searchBrinquedo").value.toLowerCase();
    var brinquedos = document.querySelectorAll('.brinquedo-nome span');

    for (var i = 0; i < brinquedos.length; i++) {
        var nomeBrinquedo = brinquedos[i].textContent.toLowerCase();
        var listItem = brinquedos[i].closest('.brinquedo');

        if (nomeBrinquedo.includes(termoPesquisa)) {
            listItem.style.display = "flex";
        } else {
            listItem.style.display = "none";
        }
    }
}


