function formatarEventos(eventosDoServidor) {
    return eventosDoServidor.map(evento => ({
        id: evento.id,
        title: evento.titulo,
        start: `${evento.dataInicio}T${evento.horarioInicio}`, 
        end: `${evento.dataFim}T${evento.horarioFim}` 
    }));
}

async function carregarEventosDoServidor() {
    try {
        const response = await fetch('/api/eventos');
        const eventosDoServidor = await response.json();
        return formatarEventos(eventosDoServidor);
    } catch (error) {
        console.error('Erro ao carregar eventos do servidor:', error);
        return [];
    }
}

function carregarEventoParaLista(evento) {
    const eventoId = evento.id;

    fetch(`/api/eventos/${eventoId}`)
    .then(response => response.json())
    .then(dataRecebidos => {
        
        const eventoDetalhado = dataRecebidos.evento[0];
        const nomesBrinquedos = dataRecebidos.nomesBrinquedos;
        const nomesFuncionarios = dataRecebidos.nomesFuncionarios;
    
        var eventoParaLista = {
            id: eventoDetalhado.id,
            titulo: eventoDetalhado.titulo,
            horarioInicio: eventoDetalhado.horarioInicio,
            horarioFim: eventoDetalhado.horarioFim,
            dataInicio: eventoDetalhado.dataInicio,
            dataFim: eventoDetalhado.dataFim,
            tipo: eventoDetalhado.tipo,
            endereco: eventoDetalhado.endereco,
            cidade: eventoDetalhado.cidade,
            contato: eventoDetalhado.contato,
            observacao: eventoDetalhado.observacao,
            status: eventoDetalhado.status,
            nomesBrinquedos: nomesBrinquedos,
            nomesFuncionarios: nomesFuncionarios
        };

        atualizarListaDeEventos([eventoParaLista]);
    })
    .catch(error => {
        console.error('Erro ao carregar detalhes do evento:', error);
    });
}

function carregarEventosDoDia(data) {
    const diaAtual = diaAtualInput.value;

    if (diaAtual === data) {
        return;
    }

    diaAtualInput.value = data;

    const dataFormatada = encodeURIComponent(data);

    fetch('/api/eventos-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataInicio: dataFormatada }),
    })
        .then(response => response.json())
        .then(eventos => {
            if (eventos.length === 0) {
                eventos = [{
                    titulo: 'Não há registros para esse dia',
                    tipo: 'MENSAGEM',
                    dataInicio: data,
                    dataFim: data,
                    horarioInicio: '00:00',
                    horarioFim: '00:00',
                    endereco: '',
                    cidade: '',
                    contato: '',
                    observacao: '',
                    status: 'MENSAGEM',
                    nomesBrinquedos: '',
                    nomesFuncionarios: '',
                    quantidadesBrinquedos: ''
                }];

                atualizarListaDeEventos(eventos);
        
                eventosCarregadosParaDia = true;
                return;
            }
        
            const eventosDetalhados = eventos.map(evento => {
                const nomesBrinquedos = evento.nomesBrinquedos;
                const nomesFuncionarios = evento.nomesFuncionarios;
                const quantidadesBrinquedos = evento.quantidadesBrinquedos;
        
                const eventoParaLista = {
                    id: evento.evento.id,
                    titulo: evento.evento.titulo,
                    horarioInicio: evento.evento.horarioInicio,
                    horarioFim: evento.evento.horarioFim,
                    dataInicio: evento.evento.dataInicio,
                    dataFim: evento.evento.dataFim,
                    tipo: evento.evento.tipo,
                    endereco: evento.evento.endereco,
                    cidade: evento.evento.cidade,
                    contato: evento.evento.contato,
                    observacao: evento.evento.observacao,
                    status: evento.evento.status,
                    nomesBrinquedos: nomesBrinquedos,
                    nomesFuncionarios: nomesFuncionarios,
                    quantidadesBrinquedos: quantidadesBrinquedos
                };
        
                return eventoParaLista;
            });
            console.log('Eventos completos: ',eventosDetalhados)
            atualizarListaDeEventos(eventosDetalhados);
        
            eventosCarregadosParaDia = true;
        })
        .catch(error => {
            console.error('Erro ao buscar eventos do servidor:', error);
        });        
}

function carregarEventosDoMes(dataInicial, dataFinal) {
    const dataInicioFormatada = dataInicial.toISOString().split('T')[0];
    const dataFimFormatada = dataFinal.toISOString().split('T')[0];

    fetch(`/api/eventos-mes?dataInicio=${dataInicioFormatada}&dataFim=${dataFimFormatada}`)
        .then(response => response.json())
        .then(eventos => {
            atualizarCalendario(eventos);
        })
        .catch(error => {
            console.error('Erro ao carregar eventos do mês:', error);
        });
}

function determinarCorPorTipo(tipo) {
    switch (tipo) {
        case 'PARTICULAR':
            return '#002296'; 
        case 'PARTICULAR FORA DA CIDADE':
            return 'purple';
        case 'PREFEITURA':
            return 'green'; 
        case 'PREFEITURA FORA DA CIDADE':
            return 'orange'; 
        default:
            return 'cor padrão';
    }
}

function atualizarListaDeEventos(eventos) {
    var eventListUl = document.getElementById('event-list-ul');
    eventListUl.innerHTML = '';
    
    eventos.forEach(function(evento) {
        var listItem = document.createElement('li');
        listItem.className = 'list-calendario-item';

        var tituloEvento = document.createElement('span');
        tituloEvento.className = 'titulo-evento';
        var corBorda = determinarCorPorTipo(evento.tipo);
        tituloEvento.style.borderLeft = `3px solid ${corBorda}`;
        tituloEvento.textContent = evento.titulo;
        tituloEvento.style.cursor = 'pointer';

        var iconesAcao = document.createElement('div');
        iconesAcao.className = 'icones-acao';
        
        var iconeConcluir = document.createElement('i');
        iconeConcluir.className = 'fas fa-check-circle';
        iconeConcluir.id = 'concluir-evento-btn';
        iconeConcluir.addEventListener('click', function() {
            ConcluirEvento(evento.id);
        });

        var iconeEditar = document.createElement('i');
        iconeEditar.className = 'fas fa-edit';
        iconeEditar.id = 'editar-evento-btn';
        iconeEditar.addEventListener('click', function() {
            window.location.href = `/aplication/editar-evento/${evento.id}`;
        });


        var iconeExcluir = document.createElement('i');
        iconeExcluir.className = 'fas fa-trash-alt';
        iconeConcluir.id = 'remover-evento-btn';
        iconeExcluir.addEventListener('click', function() {
            DeletarEvento(evento.id);
        });

        iconesAcao.appendChild(iconeConcluir);
        iconesAcao.appendChild(iconeEditar);
        iconesAcao.appendChild(iconeExcluir);

        listItem.appendChild(tituloEvento);
        listItem.appendChild(iconesAcao);

        tituloEvento.addEventListener('click', function(event) {
            event.stopPropagation();
            var infoDiv = listItem.querySelector('.info-evento');
            if (!infoDiv) {
                infoDiv = document.createElement('div');

                var inputHidden = document.createElement('input');
                inputHidden.type = 'hidden';
                inputHidden.name = 'evento-id';
                inputHidden.value = evento.id;

                infoDiv.className = 'info-evento';
                
                var horarioDiv = document.createElement('div');
                horarioDiv.textContent = `Horário: ${evento.horarioInicio} - ${evento.horarioFim}`;
                infoDiv.appendChild(horarioDiv);
                
                var nomesBrinquedosDiv = document.createElement('div');
                nomesBrinquedosDiv.textContent = 'Brinquedos: ';

                var spanBrinquedos = document.createElement('span');
                spanBrinquedos.textContent = evento.nomesBrinquedos.join(', ');
                spanBrinquedos.style.display = 'inline';

                nomesBrinquedosDiv.appendChild(spanBrinquedos);
                infoDiv.appendChild(nomesBrinquedosDiv);

                infoDiv.appendChild(document.createTextNode(' ')); // Adiciona um espaço entre os elementos

                var nomesFuncionariosDiv = document.createElement('div');
                nomesFuncionariosDiv.textContent = 'Funcionários: ';

                var spanFuncionarios = document.createElement('span');
                spanFuncionarios.textContent = evento.nomesFuncionarios.join(', ');
                spanFuncionarios.style.display = 'inline';

                nomesFuncionariosDiv.appendChild(spanFuncionarios);
                infoDiv.appendChild(nomesFuncionariosDiv);
        
                var tipoDiv = document.createElement('div');
                tipoDiv.textContent = `Tipo: ${evento.tipo}`;
                infoDiv.appendChild(tipoDiv);
        
                var enderecoDiv = document.createElement('div');
                enderecoDiv.textContent = `Endereço: ${evento.endereco}, ${evento.cidade}`;
                infoDiv.appendChild(enderecoDiv);
        
                var dataDiv = document.createElement('div');
                dataDiv.textContent = `Data: ${evento.dataInicio} - ${evento.dataFim}`;
                infoDiv.appendChild(dataDiv);
        
                var contatoDiv = document.createElement('div');
                contatoDiv.textContent = `Contato: ${evento.contato}`;
                infoDiv.appendChild(contatoDiv);
        
                var observacaoDiv = document.createElement('div');
                observacaoDiv.textContent = `Observação: ${evento.observacao || 'Nenhuma observação disponível.'}`;
                infoDiv.appendChild(observacaoDiv);

                var statusDiv = document.createElement('div');
                statusDiv.textContent = `Status: ${evento.status}`;
                infoDiv.appendChild(statusDiv);
        
                listItem.appendChild(infoDiv);
            } else {
                listItem.removeChild(infoDiv);
            }
        });

        eventListUl.appendChild(listItem);
    });
}

function ConcluirEvento(eventoId) {
    $('#confirmarConclusaoModal').modal('show');
    document.getElementById('confirmarConclusaoBtn').addEventListener('click', function() {
        $('#confirmarConclusaoModal').modal('hide');

        fetch(`/aplication/marcar-concluido/${eventoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'CONCLUIDO' })
        })
        .then(response => response.json())
        .then(data => {
            $('#confirmacaoSucessoModal').modal('show');
        })
        .catch(error => {
            console.error('Erro ao marcar evento como concluído:', error);
        });
    });
}

