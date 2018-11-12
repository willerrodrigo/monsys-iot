function sendPasswordReset() {
    var email = document.getElementById('inputEmail').value;
    console.log(email)
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('E-mail de redefinição de senha enviado!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert('Email Invalido');
      } else if (errorCode == 'auth/user-not-found') {
        alert('Email não encontrado');
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}