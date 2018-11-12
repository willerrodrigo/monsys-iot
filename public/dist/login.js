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

            if(emailInput.value.length < 4) {
                alert('Por favor entre com um email.');
                return;
            }
            else if(passwordInput.value.length < 4) {
                alert('Por favor entre com a senha.');
                return;
            }

            firebase
                .auth()
                .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .then(function (result) {
                    console.log(result);
                })
                .catch(function (error) {
                    if(error.code == "auth/wrong-password")
                        alert("Senha incorreta ou o usuário não está cadastrado.")
                    else /* if(error.code == "auth/invalid-email") */
                        alert("O email inserido não existe.")
                });
        });
});