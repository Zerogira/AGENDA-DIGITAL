function excluirComponente(elemento) {
  console.log('Elemento excluir: ',elemento)
  if (elemento && elemento.parentNode) {
    const necessFuncionarioInput = elemento.querySelector(".necessFuncionario");
    if (necessFuncionarioInput) {
      const valorNecessFuncionario = parseInt(necessFuncionarioInput.value);
      if (valorNecessFuncionario === 1) {
        const spanMinimoFuncionarios = document.getElementById("minimo-funcionarios");
        const quantSpan = document.querySelector(".quant");
        const quantBrinquedo = parseInt(quantSpan.textContent);
        console.log('inputqp: ', quantBrinquedo);
        const valorSpan = parseInt(spanMinimoFuncionarios.textContent);
        if (!isNaN(valorSpan) && valorSpan > 0) {
          spanMinimoFuncionarios.textContent = valorSpan - quantBrinquedo;
        }
      }
    }
    elemento.parentNode.removeChild(elemento);
  }
}

function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
      $(modal).modal('show');
  }
}

function fecharModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
      $(modal).modal('hide');
  }
}

// ----------------------------------------------------------------------------------------------

function adicionarBrinquedos() {
  const checkboxesSelecionados = document.querySelectorAll('.check-box:checked');
  const data = document.getElementById('dataInicio').value;
  const horarioInicio = document.getElementById('horarioInicio').value + ':00';
  const horarioFim = document.getElementById('horarioFim').value + ':00';

  const brinquedosSelecionados = [];

  checkboxesSelecionados.forEach((checkbox) => {
    const brinquedoId = parseInt(checkbox.getAttribute('data-brinquedo-id'));
    const nomeBrinquedo = document.getElementById(`spanNomeBrinquedo${brinquedoId}`).textContent;
    const quantidade = document.getElementById(`quantidade${brinquedoId}`).value;
    const quantDisponivel = document.getElementById(`quantDisponivel${brinquedoId}`).value;
    console.log('quantidade brinquedo: ',quantidade)
    const necessFuncionario = document.getElementById(`necessFuncionario${brinquedoId}`).value;

    brinquedosSelecionados.push({
      id: brinquedoId,
      nome: nomeBrinquedo,
      quantidade: quantidade,
      quantDisponivel: quantDisponivel,
      data: data,
      horarioInicio: horarioInicio,
      horarioFim: horarioFim,
      necessFuncionario: necessFuncionario
    });
  });

  fetch('/api/disponibilidade-brinquedos')
    .then(response => response.json())
    .then(disponibilidadeB => {
      brinquedosSelecionados.forEach((brinquedo) => {
        const disponibilidade = verificarDisponibilidade(brinquedo, disponibilidadeB);
        console.log('disponibilidade: ', disponibilidade);

        if (disponibilidade.disponibilidade) {
          adicionarItemAListaBrinquedo(brinquedo);
          verificarNecessidadeFuncionario(brinquedo);
        } else {
          const motivoErro = disponibilidade.motivoErro;
          exibirMensagemDeErro(motivoErro); 
        }
      });
    })
    .catch(error => {
      console.error('Erro ao obter dados de disponibilidade da API:', error);
    });
}

function verificarQuantidadeDisponivel(brinquedoSelecionado) {
  console.log('Brinquedo selecionado: ',brinquedoSelecionado)

      const quantidadeDisponivel = brinquedoSelecionado.quantDisponivel;
      const quantidadeSelecionada = brinquedoSelecionado.quantidade;

      console.log('QuantidadeSelecionada: ',quantidadeSelecionada)
      console.log("Quantidade Disponivel: ",quantidadeDisponivel)

      if (quantidadeSelecionada > quantidadeDisponivel) {
          return false;
      } else {
          return true;
      }
}

function verificarQuantidadeNoIntervalo(brinquedoSelecionado, registrosBrinquedo) {
  console.log('Brinquedo selecionado: ', brinquedoSelecionado)
  console.log('RegistrosBrinquedo: ', registrosBrinquedo)

  const brinquedoIDSelecionado = brinquedoSelecionado.id;
  const brinquedoData= brinquedoSelecionado.data;
  console.log('Brinquedos selecionados: ', brinquedoSelecionado)

  const registrosEspecifico = registrosBrinquedo.filter((registro) =>
        registro.brinquedoID === brinquedoIDSelecionado && registro.statusB === 'ABERTO' && registro.dataInicio === brinquedoData
    );

    const quantidadeUsada = registrosEspecifico.reduce((total, registro) => {
        console.log('Registros de pesquisa quantidadeUsada: ',registro)
        return total + parseFloat(registro.quantidade);
    }, 0);

    const quantidadeDisponivel = brinquedoSelecionado.quantDisponivel;
    const quantidadeSelecionada = brinquedoSelecionado.quantidade;

    console.log('QuantidadeSelecionada: ', quantidadeSelecionada);
    console.log("Quantidade Disponivel: ", quantidadeDisponivel);
    console.log("Quantidade Usada: ", quantidadeUsada);

    if (quantidadeSelecionada > (quantidadeDisponivel - quantidadeUsada)) {
        return false;
    } else {
        return true;
    }
}

function verificarQuantidadeNoIntervaloComExcessão(brinquedoSelecionado, registrosBrinquedo, registroAtualId) {
  console.log('Brinquedo selecionado: ', brinquedoSelecionado)
  console.log('RegistrosBrinquedo: ', registrosBrinquedo)

  const brinquedoIDSelecionado = brinquedoSelecionado.id;
  const brinquedoData= brinquedoSelecionado.data;
  console.log('Brinquedos selecionados: ', brinquedoSelecionado)

  const registrosEspecifico = registrosBrinquedo.filter((registro) =>
        registro.brinquedoID === brinquedoIDSelecionado && 
        registro.statusB === 'ABERTO' && 
        registro.dataInicio === brinquedoData &&
        registro.id !== registroAtualId
    );

    const quantidadeUsada = registrosEspecifico.reduce((total, registro) => {
        console.log('Registros de pesquisa quantidadeUsada: ',registro)
        return total + parseFloat(registro.quantidade);
    }, 0);

    const quantidadeDisponivel = brinquedoSelecionado.quantDisponivel;
    const quantidadeSelecionada = brinquedoSelecionado.quantidade;

    console.log('QuantidadeSelecionada: ', quantidadeSelecionada);
    console.log("Quantidade Disponivel: ", quantidadeDisponivel);
    console.log("Quantidade Usada: ", quantidadeUsada);

    if (quantidadeSelecionada > (quantidadeDisponivel - quantidadeUsada)) {
        return false;
    } else {
        return true;
    }
}

function verificarDisponibilidade(brinquedoSelecionado, disponibilidadeB) {
  const brinquedoIDSelecionado = brinquedoSelecionado.id;
  console.log('Brinquedos selecionados: ',brinquedoSelecionado)
  
  if (brinquedoIDSelecionado == null) {
    const motivoErro = `O brinquedo '${brinquedoSelecionado.nome}' não está disponível para agendamento devido a um erro interno.`;
    return { disponibilidade: false, motivoErro };
  }

  const registrosBrinquedo = disponibilidadeB.filter((registro) => 
    registro.brinquedoID === brinquedoIDSelecionado && registro.statusB === 'ABERTO'
  );
  console.log('Registros brinquedos: ', registrosBrinquedo);
  
  if(registrosBrinquedo.lengh === 0) {
  	if(verificarQuantidadeDisponivel(brinquedoSelecionado)){
      	return {disponibilidade: true}
      } else {
      const motivoErro = `A quantidade selecionada para o brinquedo '${brinquedoSelecionado.nome}' excede a quantidade disponível.`;
      	return {disponibilidade: false, motivoErro} 
      }
  }

  //Verifica se o status do brinquedo está DISPONIVEL 
  const statusBSelecionado = document.getElementById(`statusB${brinquedoIDSelecionado}`).value;
  if (statusBSelecionado !== 'DISPONIVEL') {
      const motivoErro = `O brinquedo '${brinquedoSelecionado.nome}' não está disponível para agendamento devido ao status '${statusBSelecionado}'.`;
      console.log('erro: ', motivoErro);
      return { disponibilidade: false, motivoErro };
  }

  //Coleta a data selecionada pelo usuario no formulario
  const dataInicioSelecionado = document.getElementById('dataInicio').value;
  const dataFimSelecionado = document.getElementById('dataFim').value;
  console.log('Data Inicio: ',dataInicioSelecionado)
  console.log('Data Fim: ',dataFimSelecionado)

  //Verifica se existe algum registro do brinquedo na data selecionada
  const conflitoData = registrosBrinquedo.some((registro) => {
    const dataInicio = registro.dataInicio;
    const dataFim = registro.dataFim;
    if(dataInicio <= dataInicioSelecionado && dataFim>= dataFimSelecionado) {
      return true;
    }
  });

  console.log('Conflito Data: ',conflitoData)

  //Se houver registros na data, será levado ao proximo passo: verificar se existe conflito de horarios
  if (conflitoData) {
    //Coleta os horarios inseridos pelo usuario no formulario
    const horarioInicioSelecionado = document.getElementById('horarioInicio').value;
    const horarioFimSelecionado = document.getElementById('horarioFim').value;
    console.log('horario inicio selecionado: ',horarioInicioSelecionado)
    console.log('horario fim selecionado: ',horarioFimSelecionado)

    //Verifica se o horario é vazio
    if (horarioInicioSelecionado === '' || horarioFimSelecionado === ''){
      const motivoErro = `Horario não pode estar vazio.`;
      return { disponibilidade: false, motivoErro };
    } else {
      horarioInicioSelecionado + '00';
      horarioFimSelecionado + '00'
    }

    //Verifica se existe conflito de horarios, se verdadeiro irá verificar a quantidade disponivel que resta no intervalo de horario
    //Se for falso, irá salvar os registros dos eventos, irá verificar a quantidade disponivel do brinquedo apenas. 
    const conflitoHorario = registrosBrinquedo.some((registro) => {
        const inicioDisponivel = registro.horarioInicio;
        const fimDisponivel = registro.horarioFim;

        if (
            (inicioDisponivel <= horarioInicioSelecionado && horarioInicioSelecionado < fimDisponivel) ||
            (inicioDisponivel < horarioFimSelecionado && horarioFimSelecionado <= fimDisponivel) ||
            (horarioInicioSelecionado <= inicioDisponivel && fimDisponivel <= horarioFimSelecionado)
        ) {
          console.log('true')
            return true;
        } else {
          console.log('false')
          return false;
        }
    });

    //Se houver conflito de horario irá chamar a função VerificarQuantidadeNoIntervalo();
    if (conflitoHorario) {

      const eventoIdElement = document.getElementById('eventoId');
      let registroAtualId;

      if (eventoIdElement) {
        registroAtualId = eventoIdElement.value;
      } else {
        registroAtualId = null;
      }

      if(registroAtualId != null) {
        if (verificarQuantidadeNoIntervaloComExcessão(brinquedoSelecionado, registrosBrinquedo, registroAtualId)){
          return {disponibilidade: true}
        } else {
        const motivoErro = `A quantidade selecionada para o brinquedo '${brinquedoSelecionado.nome}' excede a quantidade disponível.`;
          return {disponibilidade: false, motivoErro} 
        }
      } else {
        if (verificarQuantidadeNoIntervalo(brinquedoSelecionado,registrosBrinquedo)){
          return {disponibilidade: true}
        } else {
        const motivoErro = `A quantidade selecionada para o brinquedo '${brinquedoSelecionado.nome}' excede a quantidade disponível.`;
          return {disponibilidade: false, motivoErro} 
        }
      }
      

    } else {
      // coloque aqui o que vai acontecer se o horario for permitido
      if(verificarQuantidadeDisponivel(brinquedoSelecionado)){
      	return {disponibilidade: true}
      } else {
      const motivoErro = `A quantidade selecionada para o brinquedo '${brinquedoSelecionado.nome}' excede a quantidade disponível.`;
      	return {disponibilidade: false, motivoErro} 
      }
    }
  } else {
    // coloque aqui se a data for permitida
    if(verificarQuantidadeDisponivel(brinquedoSelecionado)){
      	return {disponibilidade: true}
      } else {
      const motivoErro = `A quantidade selecionada para o brinquedo '${brinquedoSelecionado.nome}' excede a quantidade disponível.`;
      	return {disponibilidade: false, motivoErro} 
      }
  };
}



function adicionarItemAListaBrinquedo(brinquedo) {
  const listaB = document.getElementById("lista-conteudo-brinquedo");

  const elementoExistente = Array.from(listaB.children).find((item) => {
    const nomeItem = item.querySelector(".span-b").textContent;
    return nomeItem === brinquedo.nome;
  });

  if (elementoExistente) {
    alert("Este item já foi adicionado à lista.");
    return;
  }

  const newItem = criarNovoItemBrinquedo(brinquedo);

  listaB.appendChild(newItem);

  fecharModalBrinquedos();
}

function criarNovoItemBrinquedo(brinquedo) {
  console.log('Brinquedo NovoItem: ',brinquedo)
  const newItem = document.createElement("li");
  newItem.classList.add("item-lista");
  const idQuantidade = `quantSelecionado${brinquedo.id}`;

    newItem.innerHTML = `
        <div class="item-nome">
            <span class='span-b'>${brinquedo.nome}</span>
            <input type="hidden" class="necessFuncionario" value="${brinquedo.necessFuncionario}">
            <input type="hidden" class="idbrinquedo" value="${brinquedo.id}">
        </div>
        <div class="btn-qtn">
            <span id='${idQuantidade}' class="quant quantSelecionado"> ${brinquedo.quantidade}</span>
        </div>
        <div class="excluir-componente" onclick="excluirComponente(this.parentNode)">
            <i class="fas fa-times"></i>
        </div>
    `;

  return newItem;
}

function desmarcarCheckboxesBrinquedos() {
  const checkboxesBrinquedos = document.querySelectorAll('#modalBrinquedos .check-box');
  checkboxesBrinquedos.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function fecharModalBrinquedos() {
  desmarcarCheckboxesBrinquedos();

  const seuModal = document.getElementById("modalBrinquedos");
  if (seuModal) {
    seuModal.style.display = "none"; 
    document.body.classList.remove("modal-open"); 
    const backdrop = document.querySelector(".modal-backdrop"); 
    if (backdrop) {
      backdrop.remove(); 
    }
  }
}

if (window.location.pathname === '/agendar') {
  const botaoFecharPadraoBrinquedos = document.querySelector('#modalBrinquedos .close');
  botaoFecharPadraoBrinquedos.addEventListener('click', () => {
    fecharModalBrinquedos();
  });

  const botaoFecharModalBrinquedos = document.querySelector('#modalBrinquedos .btn-secondary');
  botaoFecharModalBrinquedos.addEventListener('click', () => {
    fecharModalBrinquedos();
  });

  function desmarcarCheckboxesFuncionarios() {
    const checkboxesFuncionarios = document.querySelectorAll('#modalFuncionarios .check-box');
    checkboxesFuncionarios.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
}

function verificarNecessidadeFuncionario(brinquedo) {
  const spanMinimoFuncionarios = document.getElementById("minimo-funcionarios");
  const inputQuantPagina = parseInt(document.getElementById(`quantSelecionado${brinquedo.id}`).textContent);
  console.log('InputQuantPagina: ',inputQuantPagina)
  console.log('quantSelecionado: ',document.getElementById(`quantSelecionado${brinquedo.id}`).textContent)
  
  if (brinquedo.necessFuncionario === "1") {
    let valorSpan = parseInt(spanMinimoFuncionarios.textContent);
    valorSpan += inputQuantPagina;
    spanMinimoFuncionarios.textContent = valorSpan.toString();
  }
}

function removerTodosBrinquedos() {
  const spanMinimoFuncionarios = document.getElementById("minimo-funcionarios");
  spanMinimoFuncionarios.textContent = '0';

  const listaBrinquedos = document.getElementById("lista-conteudo-brinquedo");

  while (listaBrinquedos.firstChild) {
    listaBrinquedos.removeChild(listaBrinquedos.firstChild);
  }
}

function exibirMensagemDeErro(motivoErro) {
  fecharModalBrinquedos();
  fecharModalFuncionarios();
  const mensagemErroElement = document.getElementById('mensagemErro');
  if (mensagemErroElement) {
      mensagemErroElement.textContent = motivoErro;
      abrirModal('modalErro');
  }
}

// 
// ----------------- FUNÇÕES ADICIONAR FUNCIONARIOS -----------------
// 

function adicionarFuncionarios() {
  const checkboxesSelecionados = document.querySelectorAll('.check-box:checked');
  const data = document.getElementById('dataInicio').value;
  const horarioInicio = document.getElementById('horarioInicio').value + ':00';
  const horarioFim = document.getElementById('horarioFim').value + ':00';

  const funcionariosSelecionados = [];

  checkboxesSelecionados.forEach((checkboxF) => {
    const funcionarioId = parseInt(checkboxF.getAttribute('data-funcionario-id'));
    const nomeFuncionario = document.getElementById(`spanNomeFuncionario${funcionarioId}`).textContent;
    
    const disponibilidadeFuncionario = document.getElementById(`spanDisponibilidade${funcionarioId}`).textContent;

    funcionariosSelecionados.push({
      id: funcionarioId,
      nome: nomeFuncionario,
      disponibilidade: disponibilidadeFuncionario, 
    });
  });

  console.log('Funcionario selecionado: ',funcionariosSelecionados)
  fetch('/api/disponibilidade-funcionarios')
    .then(response => response.json())
    .then(disponibilidadeFuncionarios => {
      funcionariosSelecionados.forEach((funcionario) => {
        const disponibilidade = verificarDisponibilidadeFuncionario(funcionario, disponibilidadeFuncionarios);
        if (disponibilidade.disponibilidade) {
          adicionarItemAListaFuncionario(funcionario, data, horarioInicio, horarioFim);
        } else {
          const motivoErro = disponibilidade.motivoErro;
          exibirMensagemDeErro(motivoErro); 
        }
      });
    })
    .catch(error => {
      console.error('Erro ao obter dados de disponibilidade de funcionários da API:', error);
    });
}


function verificarDisponibilidadeFuncionario(funcionarioSelecionado, disponibilidadeFuncionarios) {
  console.log('funcionarioSelecionado: ',funcionarioSelecionado)
  const funcionarioIDSelecionado = funcionarioSelecionado.id;
  console.log('funcionario id: ',funcionarioIDSelecionado)

  const registrosFuncionario = disponibilidadeFuncionarios.filter((registro) => 
      registro.funcionarioID === funcionarioIDSelecionado && registro.statusB === 'ABERTO'
    );

  console.log('Consulta dos registros: ',registrosFuncionario)

  const disponibilidadeFuncionario = document.getElementById(`spanDisponibilidade${funcionarioIDSelecionado}`).textContent;

  if (funcionarioIDSelecionado == null) {
    const motivoErro = `O funcionário '${funcionarioSelecionado.nome}' não está disponível para agendamento devido a um erro interno.`;
    return { disponibilidade: false, motivoErro };
  }

  const dataInicioSelecionado = document.getElementById('dataInicio').value;
  const dataFimSelecionado = document.getElementById('dataFim').value;
  console.log('Data Inicio: ',dataInicioSelecionado)
  console.log('Data Fim: ',dataFimSelecionado)

  //Verificar se o funcionario está disponivel no dia selecionado
  if (disponibilidadeFuncionario === 'Segunda a Sexta' && !ehDiaDeSemana(dataInicioSelecionado)) {
    const motivoErro = `O funcionário '${funcionarioSelecionado.nome}' só trabalha de segunda a sexta-feira.`;
    return { disponibilidade: false, motivoErro };
  }

  if (disponibilidadeFuncionario === 'Apenas sábado e domingo' && ehDiaDeSemana(dataInicioSelecionado)) {
    const motivoErro = `O funcionário '${funcionarioSelecionado.nome}' só trabalha aos sábados e domingos.`;
    console.log('Disponibilidade funcionario: ',disponibilidadeFuncionario,' É dia de semana: ',ehDiaDeSemana(dataInicioSelecionado))
    return { disponibilidade: false, motivoErro };
  }

  const conflitoData = registrosFuncionario.some((registro) => {
    const dataInicio = registro.dataInicio;
    const dataFim = registro.dataFim;
    if(dataInicio <= dataInicioSelecionado && dataFim>= dataFimSelecionado) {
      console.log('data Inicio disponivel: ', dataInicio,'data Fim disponivel: ',dataFim)
      return true;
    }

  });

  if (conflitoData) {
    const horarioInicioSelecionado = document.getElementById('horarioInicio').value + ':00';
    const horarioFimSelecionado = document.getElementById('horarioFim').value + ':00';
    console.log('Horario inicio selecionado: : ', horarioInicioSelecionado);
    console.log('Horario FIm selecionado: ', horarioFimSelecionado);
    console.log('registros funcionarios: ', registrosFuncionario);

    const conflitoHorario = registrosFuncionario.some((registro) => {
        const inicioDisponivel = registro.horarioInicio;
        const fimDisponivel = registro.horarioFim;

        if (
            (inicioDisponivel <= horarioInicioSelecionado && horarioInicioSelecionado < fimDisponivel) ||
            (inicioDisponivel < horarioFimSelecionado && horarioFimSelecionado <= fimDisponivel) ||
            (horarioInicioSelecionado <= inicioDisponivel && fimDisponivel <= horarioFimSelecionado)
        ) {
            return true;
        }
    });

    console.log('Conflito horario: ', conflitoHorario);

    if (conflitoHorario) {
        const motivoErro = `O funcionário '${funcionarioSelecionado.nome}' não está disponível para o horário selecionado devido a conflito de horários.`;
        return { disponibilidade: false, motivoErro };
    } else {
        return { disponibilidade: true };
    }
} else {
    return { disponibilidade: true };
}
}

function ehDiaDeSemana(data) {
  const partesData = data.split('-');
  console.log('partes data: ',partesData)
  const ano = parseInt(partesData[0], 10);
  const mes = parseInt(partesData[1], 10) - 1;
  const dia = parseInt(partesData[2], 10);

  console.log('ano: ',ano)
  console.log('mes: ',mes)
  console.log('dia: ',dia)

  if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
    return false; 
  }

  const dataUTC = Date.UTC(ano, mes, dia);

  const diaDaSemana = new Date(dataUTC).getUTCDay();

  return diaDaSemana >= 1 && diaDaSemana <= 5;
}

function ehFinalDeSemana() {
  const hoje = new Date().getDay();
  return hoje === 0 || hoje === 6;
}



function adicionarItemAListaFuncionario(funcionario) {
  const listaF = document.getElementById("lista-conteudo-funcionario");

  const elementoExistenteF = Array.from(listaF.children).find((item) => {
    const nomeItemF = item.querySelector(".span-f").textContent;
    return nomeItemF === funcionario.nome;
  });

  if (elementoExistenteF) {
    alert("Este funcionário já foi adicionado à lista.");
    return;
  }

  const newItemF = criarNovoItemFuncionario(funcionario);

  listaF.appendChild(newItemF);

  fecharModalFuncionarios();
}

function criarNovoItemFuncionario(funcionario) {
  const newItemF = document.createElement("li");
  newItemF.classList.add("item-lista-f");
  newItemF.innerHTML = `
    <div class="item-nome">
      <span class='span-f'>${funcionario.nome}</span>
      <input type="hidden" class="idfuncionario" value="${funcionario.id}">
    </div>
    <div class="excluir-componente" onclick="excluirComponente(this.parentNode)">
      <i class="fas fa-times"></i>
    </div>
  `;

  return newItemF;
}

function desmarcarCheckboxesFuncionarios() {
  const checkboxesFuncionarios = document.querySelectorAll('#modalFuncionarios .check-box');
  checkboxesFuncionarios.forEach((checkbox) => {
    checkbox.checked = false;
  });
}


function fecharModalFuncionarios() {

  desmarcarCheckboxesFuncionarios();

  const seuModal = document.getElementById("modalFuncionarios");
  if (seuModal) {
    seuModal.style.display = "none";
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  }
}

if (window.location.pathname === '/agendar') {
  const botaoFecharPadrao = document.querySelector('#modalFuncionarios .close');
  botaoFecharPadrao.addEventListener('click', () => {
    fecharModalFuncionarios();
  });

  const botaoFecharModal = document.querySelector('#modalFuncionarios .btn-secondary');
  botaoFecharModal.addEventListener('click', () => {
    fecharModalFuncionarios();
  });

  function removerTodosFuncionarios() {
    const listaFuncionarios = document.getElementById("lista-conteudo-funcionario");

    while (listaFuncionarios.firstChild) {
      listaFuncionarios.removeChild(listaFuncionarios.firstChild);
    }
  }
}


// FUNÇÕES GERAIS
function aumentarQuantidade(input) {
  const valorAtual = parseInt(input.value);
  if (!isNaN(valorAtual)) {
    input.value = valorAtual + 1;
  }
}

function diminuirQuantidade(input) {
  const valorAtual = parseInt(input.value);
  if (!isNaN(valorAtual) && valorAtual > 1) {
    input.value = valorAtual - 1;
  }
}

function verificarQuantidadeFuncionarios() {
  const quantidadeMinimaFuncionarios = parseInt(document.getElementById("minimo-funcionarios").textContent);
  console.log('quantidade minima: ', quantidadeMinimaFuncionarios);
  const listaFuncionarios = document.querySelectorAll("#lista-conteudo-funcionario .idfuncionario");
  const quantidadeFuncionariosNaLista = listaFuncionarios.length;
  console.log('Lista funcionarios: ',quantidadeFuncionariosNaLista)

  if (quantidadeFuncionariosNaLista >= quantidadeMinimaFuncionarios) {
      return true;
  } else {
      const motivoErro = `É necessário selecionar pelo menos ${quantidadeMinimaFuncionarios} funcionários.`;
      exibirMensagemDeErro(motivoErro);
      return false;
  }
}

function salvarEvento() {
  const titulo = document.getElementById("titulo").value;
  const contato = document.getElementById("contato").value;
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  const horarioInicio = document.getElementById("horarioInicio").value;
  const horarioFim = document.getElementById("horarioFim").value;
  const endereco = document.getElementById("endereco").value;
  const cidade = document.getElementById("cidade").value;
  const tipo = document.getElementById("tipo").value;
  const observacao = document.getElementById("observacao").value;
  const quantidadeMinimaFuncionarios = parseInt(document.getElementById("minimo-funcionarios").textContent);

  const listaBrinquedos = document.querySelectorAll("#lista-conteudo-brinquedo .idbrinquedo");
  const brinquedoID = Array.from(listaBrinquedos).map((element) => parseInt(element.value));
  console.log('Array com ID dos brinquedos: ',brinquedoID)

  const listaFuncionarios = document.querySelectorAll("#lista-conteudo-funcionario .idfuncionario");
  const funcionarioID = Array.from(listaFuncionarios).map((element) => parseInt(element.value)); 
  console.log('Array com ID dos funcionarios: ',funcionarioID)

  const quantidadesSpans = document.querySelectorAll('.quantSelecionado');
  const quantidades = Array.from(quantidadesSpans).map(span => parseInt(span.textContent));
  console.log('Array com quantidades dos brinquedos: ',quantidades)

  const evento = {
    titulo,
    contato,
    dataInicio,
    dataFim,
    horarioInicio,
    horarioFim,
    endereco,
    cidade,
    tipo,
    observacao,
    brinquedoID: brinquedoID,
    funcionarioID: funcionarioID, 
    quantidades: quantidades,
    quantidadeMinimaFuncionarios: quantidadeMinimaFuncionarios
  };
  console.log('Evento: ', evento)


  if (verificarQuantidadeFuncionarios()) {
    fetch("/aplication/eventos/novo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evento),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Evento salvo com sucesso!");
          window.location.href = "/aplication/calendar";
        } else {
          const motivoErro = 'Ocorreu um erro ao salvar o evento.'
          exibirMensagemDeErro(motivoErro);
        }
      })
      .catch((error) => {
        console.error("Erro ao salvar o evento:", error);
        const motivoErro = 'Ocorreu um erro ao salvar o evento.'
        exibirMensagemDeErro(motivoErro);
      });
  } else {
    const motivoErro = 'Quantidade de funcionarios insuficiente.'
    exibirMensagemDeErro(motivoErro);
    }
}

function salvarEventoEditado() {
  const eventoId = document.getElementById('eventoId').value;
  const titulo = document.getElementById("titulo").value;
  const contato = document.getElementById("contato").value;
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  const horarioInicio = document.getElementById("horarioInicio").value;
  const horarioFim = document.getElementById("horarioFim").value;
  const endereco = document.getElementById("endereco").value;
  const cidade = document.getElementById("cidade").value;
  const tipo = document.getElementById("tipo").value;
  const observacao = document.getElementById("observacao").value;
  const quantidadeMinimaFuncionarios = parseInt(document.getElementById("minimo-funcionarios").textContent);

  const listaBrinquedos = document.querySelectorAll("#lista-conteudo-brinquedo .idbrinquedo");
  const brinquedoID = Array.from(listaBrinquedos).map((element) => parseInt(element.value));
  console.log('Array com ID dos brinquedos: ',brinquedoID)

  const listaFuncionarios = document.querySelectorAll("#lista-conteudo-funcionario .idfuncionario");
  const funcionarioID = Array.from(listaFuncionarios).map((element) => parseInt(element.value)); 
  console.log('Array com ID dos funcionarios: ',funcionarioID)

  const quantidadesSpans = document.querySelectorAll('#quantSelecionado');
  const quantidades = Array.from(quantidadesSpans).map(span => parseInt(span.textContent));
  console.log('Array com quantidades dos brinquedos: ',quantidades)

  const evento = {
    titulo,
    contato,
    dataInicio,
    dataFim,
    horarioInicio,
    horarioFim,
    endereco,
    cidade,
    tipo,
    observacao,
    brinquedoID: brinquedoID,
    funcionarioID: funcionarioID, 
    quantidades: quantidades,
    quantidadeMinimaFuncionarios: quantidadeMinimaFuncionarios
  };
  console.log('Evento: ', evento)


  if (verificarQuantidadeFuncionarios()) {
    fetch(`/aplication/eventos/editar/${eventoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evento),
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      }
      throw new Error('Ocorreu um erro ao salvar o evento.');
      })
      .then((data) => {
          console.log(data.message);
          window.location.href = "/aplication/calendar";
      })
      .catch((error) => {
          console.error("Erro ao salvar o evento:", error);
          const motivoErro = 'Ocorreu um erro ao salvar o evento.'
          exibirMensagemDeErro(motivoErro);
      });
  } else {
    const motivoErro = 'Quantidade de funcionarios insuficiente.'
    exibirMensagemDeErro(motivoErro);
    }
}