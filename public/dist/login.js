// Buttons
var authEmailPassButton = document.getElementById('authEmailPassButton');

// Inputs
var emailInput = document.getElementById('inputEmail');
var passwordInput = document.getElementById('inputPassword');


// Autenticar com E-mail e Senha
authEmailPassButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function (result) {
            console.log(result);
            alert('Autenticado ' + emailInput.value);
            window.location = 'index.html';
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});