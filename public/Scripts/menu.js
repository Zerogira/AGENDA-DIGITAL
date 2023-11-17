function aplicarEstiloBorda(dataPrazoTexto, tituloAviso) {
    const partesData = dataPrazoTexto.split('/');
    const dataPrazoFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
    const dataPrazo = new Date(dataPrazoFormatada);
    const diferencaDias = Math.floor((dataPrazo - new Date()) / (1000 * 60 * 60 * 24));

    let corBorda = '';

    if (diferencaDias <= 7) {
        corBorda = 'red'; 
    } else if (diferencaDias <= 21) {
        corBorda = 'orange'; 
    } else {
        corBorda = 'green'; 
    }

    tituloAviso.style.borderLeft = `4px solid ${corBorda}`;
}


const listaAvisos = document.querySelectorAll('.list-group-item.aviso');

listaAvisos.forEach(item => {
    item.addEventListener('click', () => {
        const detalhesDiv = item.nextElementSibling; 
        if (detalhesDiv.style.display === 'none' || detalhesDiv.style.display === '') {
            detalhesDiv.style.display = 'block';
        } else {
            detalhesDiv.style.display = 'none';
        }
    });
});

const iconesConcluir = document.querySelectorAll('.fas.fa-check-square');

iconesConcluir.forEach(ic => {
    ic.addEventListener('click', () => {
        const avisoId = ic.getAttribute('data-aviso-id'); 
        const tituloAviso = ic.getAttribute('data-titulo'); 
        const descricaoAviso = ic.getAttribute('data-descricao'); 

        document.getElementById('modalTitulo').innerText = `Título: ${tituloAviso}`;
        document.getElementById('modalDescricao').innerText = `Descrição: ${descricaoAviso}`;

        $('#concluirModal').modal('show');

        document.getElementById('botaoConfirmar').addEventListener('click', () => {
            fetch(`/api/atualizar-aviso/${avisoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statusA: 'CONCLUIDO' }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Aviso concluído com sucesso:', data);
                window.location.reload();              
            })
            .catch(error => {
                console.error('Erro ao concluir aviso:', error);
            })
            .finally(() => {
                $('#concluirModal').modal('hide');
            });
        });
    });
});

const iconesExcluir = document.querySelectorAll('.fas.fa-trash');

iconesExcluir.forEach(ic => {
    ic.addEventListener('click', () => {
        const avisoId = ic.getAttribute('data-aviso-id'); 
        const tituloAviso = ic.getAttribute('data-titulo'); 
        const descricaoAviso = ic.getAttribute('data-descricao'); 

        document.getElementById('modalTituloExclusao').innerText = `Título: ${tituloAviso}`;
        document.getElementById('modalDescricaoExclusao').innerText = `Descrição: ${descricaoAviso}`;

        $('#confirmarExclusaoModal').modal('show');

        document.getElementById('botaoConfirmarExclusao').addEventListener('click', () => {
            fetch(`/api/excluir-aviso/${avisoId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log('Aviso excluído com sucesso:', data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Erro ao excluir aviso:', error);
            })
            .finally(() => {
                $('#confirmarExclusaoModal').modal('hide');
            });
        });
    });
});


function formatarDataParaFormatoISO(data) {
    const partesData = data.split('/');
    // Cria uma nova data em UTC
    const dataUTC = new Date(Date.UTC(partesData[2], partesData[1] - 1, partesData[0]));
    
    // Obtém as partes da data formatada
    const ano = dataUTC.getUTCFullYear();
    const mes = String(dataUTC.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(dataUTC.getUTCDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
}

const iconesEditar = document.querySelectorAll('.fas.fa-edit');

iconesEditar.forEach(ic => {
    ic.addEventListener('click', () => {
        const avisoId = ic.getAttribute('data-aviso-id'); 
        const tituloAviso = ic.getAttribute('data-titulo'); 
        const descricaoAviso = ic.getAttribute('data-descricao');
        const prazoAviso = ic.getAttribute('data-prazo');
        
        const formattedPrazoAviso = formatarDataParaFormatoISO(prazoAviso); 

        console.log('Data: ', formattedPrazoAviso);

        document.getElementById('avisoId').value = avisoId;
        document.getElementById('tituloEditar').value = tituloAviso;
        document.getElementById('mensagemEditar').value = descricaoAviso;
        document.getElementById('prazoEditar').value = formattedPrazoAviso;

        $('#editarModal').modal('show');
    });
});



function editarAviso() {
    const avisoId = document.getElementById('avisoId').value;
    const titulo = document.getElementById('tituloEditar').value;
    const descricao = document.getElementById('mensagemEditar').value;
    const prazo = document.getElementById('prazoEditar').value;
    console.log('AvisoId: ',avisoId)
    console.log('Dados Enviados:', JSON.stringify({ titulo, descricao, prazo }));
    fetch(`/api/editar-aviso/${avisoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            prazo: prazo,
        }),
        
    })
    .then(response => response.json())
    .then(data => {
        console.log('Aviso editado com sucesso:', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro ao editar aviso:', error);
    })
    .finally(() => {
        $('#editarModal').modal('hide');
    });
}