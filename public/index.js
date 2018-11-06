//Database
var db = firebase.database()

// VARIAVEIS DA JANELA
var janela = document.getElementById('sensorJan');
var btJanela = document.getElementById('btJanela');

// VARIAVEIS DA TEMPERATURA
var temperatura = document.getElementById('sensorTemp');
var btTemp = document.getElementById('btTemp');

// VARIAVEIS DA LUMINOSIDADE
var luminosidade = document.getElementById('sensorLum');
var btLum = document.getElementById('btLum');

// VARIAVEIS DA UMIDADE
var umidade = document.getElementById('sensorUm');

// BOTAO DE LOGOUT
var logOutButton = document.getElementById('logOutButton');

//MQTT
//const client = require('./server').module.client
var mqtt = require('mqtt');
var client = mqtt.connect('wss://iot.eclipse.org:443/ws');

//SLIDER
var sliderVent = document.getElementById("ventRange");
var sliderLamp = document.getElementById("lampRange");

var output = document.getElementById("ventLabel");
var output2 = document.getElementById("lampLabel");

output.innerHTML = sliderVent.value + '%';
output2.innerHTML = sliderLamp.value + '%';

sliderVent.oninput = function() {
  output.innerHTML = this.value + '%';
}

sliderLamp.oninput = function() {
  output2.innerHTML = this.value + '%';
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var uid = user.uid;

        client.reconnect()
        
        client.on("connect", function () {
            client.subscribe('monsys/Janela')

            client.subscribe('monsys/Temperatura')
            client.subscribe('estado/Ventilador')

            client.subscribe('monsys/Luminosidade')
            client.subscribe('estado/Lampada')

            client.subscribe('monsys/Umidade')
            console.log("connected");
        })

        client.on('message', (topic, message) => {

            switch (topic) {
                case 'monsys/Janela':
                    if (message.toString() == "JF") //Janela Fechada
                        createJan('Fechada')
                    else if (message.toString() == "JA")
                        createJan('Aberta')
                    break
                case 'monsys/Temperatura':
                        createTemp(message)
                    break
                case 'monsys/Luminosidade':
                        createLum(message)
                    break
                case 'monsys/Umidade':
                        createUmidade(message)
                    break
                case 'estado/Ventilador':
                        createVent(message)
                    break
                case 'estado/Lampada':
                        createLamp(message)
                    break
            }
        })

        client.on('offline', function(){
            console.log("offline")
        })

        client.on('error', function(){
            console.log("error to connect")
        })

        client.on('reconnect', function(){
            console.log("reconnecting")
        })


        //TEMPERATURA
        function createTemp(message) {
            var data = {
                valor: message.toString(),
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/temperatura').push(data);
        }

        db.ref('usuarios/'+uid+'/dados/temperatura').on('child_added', function (snapshot) {

            temperatura.innerHTML = snapshot.val().valor + "ºC";
        })

        //JANELA
        btJanela.addEventListener('click', function () {

            if (btJanela.innerText == "Abrir Janela") {
                client.publish('monsys/Janela', 'AJ') //Abrir Janela
            } else {
                client.publish('monsys/Janela', 'FJ')
            }
        });

        function createJan(estado) {
            var data = {
                estado: estado,
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/janela').push(data);
        }

        // ESTADO DA JANELA
        db.ref('usuarios/'+uid+'/dados/janela').on('child_added', function (snapshot) {

            var estadoJanela = snapshot.val().estado

            if (estadoJanela == "Aberta") {
                janela.innerHTML = "Aberta"
                btJanela.innerHTML = "Fechar Janela"
                $('#ledJanela').removeClass()
                $('#ledJanela').addClass('led led-green')
            } else if (estadoJanela == "Fechada") {
                janela.innerHTML = "Fechada"
                btJanela.innerHTML = "Abrir Janela"
                $('#ledJanela').removeClass()
                $('#ledJanela').addClass('led led-red')
            }
        })


        //VENTILADOR
        btTemp.addEventListener('click', function () {
            
            if (btTemp.innerText == "Ligar Ventilador") {
                client.publish('monsys/Ventilador', sliderVent.value) //Ligar Ventilador
            } else {           
                client.publish('monsys/Ventilador', '0')
            }

        });

        function createVent(valor) {
            var data = {
                valor: valor.toString(),
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/ventilador').push(data);
        }

        db.ref('usuarios/'+uid+'/dados/ventilador').on('child_added', function (snapshot) {

            const estadoVentilador = snapshot.val().valor

            if (estadoVentilador > 0) {
                btTemp.innerHTML = "Desligar Ventilador"
                $('#ledVentilador').removeClass()
                $('#ledVentilador').addClass('led led-green')
                $("#ventRangeDiv").addClass('disabledbutton', true)
            } else {
                btTemp.innerHTML = "Ligar Ventilador"
                $('#ledVentilador').removeClass()
                $('#ledVentilador').addClass('led led-red')
                $("#ventRangeDiv").removeClass('disabledbutton', true)
            }
        })

        //LAMPADA
        btLum.addEventListener('click', function () {

            if (btLum.innerText == "Acender Lâmpada") {
                client.publish('monsys/Lampada', sliderLamp.value) //Ligar Lampada
            } else {
                client.publish('monsys/Lampada', '0')
            }
        });

        function createLamp(message) {
            var data = {
                valor: message.toString(),
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/lampada').push(data);
        }

        db.ref('usuarios/'+uid+'/dados/lampada').on('child_added', function (snapshot) {

            var estadoLuz = snapshot.val().estado

            if (estadoLuz > 0) {
                btLum.innerHTML = "Apagar Lâmpada"
                $('#ledLampada').removeClass()
                $('#ledLampada').addClass('led led-green')
                $("#lampRangeDiv").addClass('disabledbutton', true)
            } else {
                btLum.innerHTML = "Acender Lâmpada"
                $('#ledLampada').removeClass()
                $('#ledLampada').addClass('led led-red')
                $("#lampRangeDiv").removeClass('disabledbutton', true)
            }
        })

        // LUMINOSIDADE
        function createLum(message) {
            var data = {
                valor: message.toString(),
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/luminosidade').push(data);
        }

        db.ref('usuarios/'+uid+'/dados/luminosidade').on('child_added', function (snapshot) {

            luminosidade.innerHTML = snapshot.val().valor + "%";
        })

        // UMIDADE
        function createUmidade(valor) {
            var data = {
                valor: valor.toString(),
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/umidade').push(data);
        }

        //ESTADO DA UMIDADE
        db.ref('usuarios/'+uid+'/dados/umidade').on('child_added', function (snapshot) {

            umidade.innerHTML = snapshot.val().valor + "%"

        })

        // Logout
        logOutButton.addEventListener('click', function () {
            firebase
                .auth()
                .signOut()
                .then(function () {
                    window.location = 'login.html';
                }, function (error) {
                    console.error(error);
                });
        });

    } else {
        window.location = 'login.html'
    }
});