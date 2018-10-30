// Buttons
var authEmailPassButton = document.getElementById('authEmailPassButton');

// Inputs
var emailInput = document.getElementById('inputEmail');
var passwordInput = document.getElementById('inputPassword');


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location = 'index.html'
    }else
        // Autenticar com E-mail e Senha
        authEmailPassButton.addEventListener('click', function () {
            firebase
                .auth()
                .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .then(function (result) {
                    console.log(result);
                })
                .catch(function (error) {
                    console.error(error.code);
                    console.error(error.message);
                    alert('Falha ao autenticar, verifique o erro no console.')
                });
        });
});