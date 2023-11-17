const funcLista = document.querySelector('.func-lista');
const containerRegistros = document.querySelector('.container-registros');

function criarMensagemSemRegistros() {

    const mensagemVazia = `
    <ul class="list-group">
        <span style="font-size:22px;">NENHUM EVENTO ENCONTRADO.</span>
    </ul>
    `;

    funcLista.innerHTML = mensagemVazia;
}

function adicionarElementosDeTitulo() {

    const titulosHtml = `
        <ul class="list-group">
            <li class="list-group-item titulos-lista">
                <div class="item-titulo-lista" style="border-right: 1px solid;">
                    <span>TITULO</span>
                </div>
                <div class="item-titulo-lista" style="border-right: 1px solid;">
                    <span>INICIO</span>
                </div>
                <div class="item-titulo-lista" style="border-right: 1px solid;">
                    <span>TERMINO</span>
                </div>
                <div class="item-titulo-lista" style="border-right: 1px solid;">
                    <span>STATUS</span>
                </div>
            </li>
        </ul>
        <div class="container-registros">
            
        </div>
    `;

    funcLista.innerHTML = titulosHtml;
}

function criarEventoRelatorio(eventosFiltrados) {
    const containerRegistros = document.querySelector('.container-registros');
    const html = eventosFiltrados.map(evento => {
        const brinquedosHtml = Array.isArray(evento.nomesBrinquedos) ? evento.nomesBrinquedos.map((brinquedo, index) => `
            <div class="brinquedo-item">
                <span class="span-second">${brinquedo}</span><span>(${evento.quantidadesBrinquedos[index]}x),</span>
            </div>
        `).join('') : '';

        const funcionariosHtml = Array.isArray(evento.nomesFuncionarios) ? evento.nomesFuncionarios.map(funcionario => `
            <div class="funcionario-item">
                <span class="span-second">${funcionario}, </span>
            </div>
        `).join('') : '';

        return `
            <div class="containerGeral">
                <li class="relatorio">
                    <div class="item-lista-relatorio" style="border-right: 1px solid;">
                        <span>${evento.titulo}</span>
                    </div>
                    <div class="item-lista-relatorio" style="border-right: 1px solid;">
                        <span>${evento.horarioInicio}</span>
                    </div>
                    <div class="item-lista-relatorio" style="border-right: 1px solid;">
                        <span>${evento.horarioFim}</span>
                    </div>
                    <div class="item-lista-relatorio" style="border-right: 1px solid;">
                        <span>${evento.status}</span>
                    </div>
                    <div class="funcionario-icones">
                        <div class="detail-container">
                            <span class="detail" onclick="exibirDetalhes(this)">detalhes</span>
                        </div>
                    </div>
                </li>
                <div class="detalhes-evento" style="display: none;">
                    <div class="info-detalhes">
                        <div class="titulo-linha-detalhes">Informações gerais:</div>
                        <span class="span-first">TIPO: <span class="span-second">${evento.tipo} - </span></span>
                        <span class="span-first">CONTATO: <span class="span-second">${evento.contato} - </span></span>
                        <span class="span-first">OBSERVAÇÕES: <span class="span-second">${evento.observacao} - </span></span>
                        <span class="span-first">Endereço: <span class="span-second">${evento.endereco} - </span></span>
                        <span class="span-first">Cidade: <span class="span-second">${evento.cidade}</span></span>
                    </div>
                    <div class="brinq-detalhes">
                        <div class="titulo-linha-detalhes">Briquedos:</div>
                        <div class="linha-nomes">
                            ${brinquedosHtml}
                        </div>
                        
                    </div>
                    <div class="brinq-detalhes">
                        <div class="titulo-linha-detalhes">Funcionarios:</div>
                        <div class="linha-nomes">
                            ${funcionariosHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    containerRegistros.innerHTML = html;
}
