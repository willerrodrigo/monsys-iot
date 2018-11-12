Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

const db = firebase.database()
const logOutButton = document.getElementById('logOutButton');

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

    //Firebase
    db.ref('usuarios/' + user.uid + '/dados/temperatura').limitToLast(12).once('value').then(function (snapshot) {

      var values = [];

      snapshot.forEach(value => {
        values.push(value.val().valor)
      })

      var ctx = document.getElementById("temperaturaChart");
      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
          datasets: [{
            label: "Celsius",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: values,
          }],
        },
        options: {
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: 100,
                maxTicksLimit: 5
              },
              gridLines: {
                color: "rgba(0, 0, 0, .125)",
              }
            }],
          },
          legend: {
            display: false
          }
        }
      });

    })

    db.ref('usuarios/' + user.uid + '/dados/umidade').limitToLast(12).once('value').then(function (snapshot) {

      var values = [];

      snapshot.forEach(value => {
        values.push(value.val().valor)
      })

      var ctx = document.getElementById("umidadeChart");
      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
          datasets: [{
            label: "Percentual",
            lineTension: 0.3,
            backgroundColor: "rgba(2,117,216,0.2)",
            borderColor: "rgba(2,117,216,1)",
            pointRadius: 5,
            pointBackgroundColor: "rgba(2,117,216,1)",
            pointBorderColor: "rgba(255,255,255,0.8)",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(2,117,216,1)",
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: values,
          }],
        },
        options: {
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                min: 0,
                max: 100,
                maxTicksLimit: 5
              },
              gridLines: {
                color: "rgba(0, 0, 0, .125)",
              }
            }],
          },
          legend: {
            display: false
          }
        }
      });

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