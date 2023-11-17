function LimparCampos() {
  // Seleciona todos os inputs dentro do formulário
  const inputs = document.querySelectorAll('.input-box-cadastro input');

  // Limpa o valor de cada input e habilita novamente o placeholder
  inputs.forEach((input) => {
    input.value = ''; // Limpa o valor do input
    input.removeAttribute('disabled'); // Remove o atributo "disabled" para habilitar o input
    input.placeholder = input.getAttribute('placeholder'); // Restaura o placeholder original
  });
}
