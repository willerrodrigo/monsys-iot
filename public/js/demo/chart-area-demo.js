Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

const db = firebase.database()
var values = [];
var myLineChart;

const logOutButton = document.getElementById('logOutButton');

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

    //Firebase
    db.ref('usuarios/' + user.uid + '/dados/temperatura').limitToLast(10).once('value').then(function (snapshot) {

      snapshot.forEach(value => {
        values.push(value.val().valor)
      })

      var ctx = document.getElementById("myAreaChart");
      myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["", "", "", "", "", "", "", "", "", ""],
          datasets: [{
            label: "Sessions",
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
                max: 50,
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