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
var mqtt = require('mqtt');
var client = mqtt.connect('wss://iot.eclipse.org:443/ws');

client.reconnect()

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var uid = user.uid;
        console.log(String(uid))

        client.on("connect", function () {
            client.subscribe('monsys/estadoJanela')
            client.subscribe('monsys/estadoTemperatura')
            client.subscribe('monsys/estadoLuminosidade')
            client.subscribe('monsys/estadoUmidade')
            console.log("connected");
        })

        client.on('message', (topic, message) => {

            switch (topic) {
                case 'monsys/estadoJanela':
                    if (message.toString() == "JF") //Janela Fechada
                        createJan('Fechada')
                    else if (message.toString() == "JA")
                        createJan('Aberta')
                    break
                case 'monsys/estadoTemperatura':
                    if (message.toString().endsWith('VD')) //Ventilador Desligado
                        createTemp(message)
                    else if (message.toString().endsWith('VL'))
                        createTemp(message)
                    break
                case 'monsys/estadoLuminosidade':
                    if (message.toString().endsWith('LD')) //Lampada Desligada
                        createLum(message)
                    else if (message.toString().endsWith('LL'))
                        createLum(message)
                    break
                case 'monsys/estadoUmidade':
                    createUmidade(message)
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

        //JANELA
        btJanela.addEventListener('click', function () {

            if (btJanela.innerText == "Abrir Janela") {
                client.publish('monsys/estadoJanela', 'AJ') //Abrir Janela
            } else {
                client.publish('monsys/estadoJanela', 'FJ')
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


        //TEMPERATURA
        btTemp.addEventListener('click', function () {

            if (btTemp.innerText == "Ligar Ventilador") {
                client.publish('monsys/estadoVentilador', 'LV') //Ligar Ventilador
            } else {
                client.publish('monsys/estadoVentilador', 'DV')
            }

        });

        function createTemp(message) {

            var splittedMessage = String(message).split("/");
            var estado = splittedMessage[1] == 'VD' ? 'Desligado' : 'Ligado'
            var valor = splittedMessage[0]

            var data = {
                estado: estado,
                valor: valor,
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/temperatura').push(data);
        }

        //ESTADO DA TEMPERATURA
        db.ref('usuarios/'+uid+'/dados/temperatura').on('child_added', function (snapshot) {

            var estadoVentilador = snapshot.val().estado
            temperatura.innerHTML = snapshot.val().valor + "ºC";

            if (estadoVentilador == "Ligado") {
                btTemp.innerHTML = "Desligar Ventilador"
                $('#ledVentilador').removeClass()
                $('#ledVentilador').addClass('led led-green')
            } else if (estadoVentilador == "Desligado") {
                btTemp.innerHTML = "Ligar Ventilador"
                $('#ledVentilador').removeClass()
                $('#ledVentilador').addClass('led led-red')
            }
        })

        // LUMINOSIDADE
        btLum.addEventListener('click', function () {

            if (btLum.innerText == "Ligar Lâmpada") {
                client.publish('monsys/estadoVentilador', 'LLA') //Ligar Lampada
            } else {
                client.publish('monsys/estadoVentilador', 'DL')
            }
        });

        function createLum(message) {

            var splittedMessage = String(message).split("/");
            var estado = splittedMessage[1] == 'LD' ? 'Desligado' : 'Ligado'
            var valor = splittedMessage[0]

            var data = {
                estado: estado,
                valor: valor,
                time: Date.now()
            }

            return db.ref().child('usuarios/'+uid+'/dados/luminosidade').push(data);
        }

        //ESTADO DA LUMINOSIDADE
        db.ref('usuarios/'+uid+'/dados/luminosidade').on('child_added', function (snapshot) {

            var estadoLuz = snapshot.val().estado
            luminosidade.innerHTML = snapshot.val().valor + "%";

            if (estadoLuz == "Ligado") {
                btLum.innerHTML = "Desligar Lâmpada"
                $('#ledLampada').removeClass()
                $('#ledLampada').addClass('led led-green')
            } else if (estadoLuz == "Desligado") {
                btLum.innerHTML = "Ligar Lâmpada"
                $('#ledLampada').removeClass()
                $('#ledLampada').addClass('led led-red')
            }
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