# Remote-Trigger-Push-Notifications
A firebase cloud fiunction that responds to ticks on App Engine Cron

```
exports.pomona_laundry_job =
  functions.pubsub.topic('pomona-laundry-tick').onPublish((event) => {
    console.log("The Laundry Van Has Arrived at Pomona")
    const deviceTokens = admin.database().ref(`/users/users`).once('value');
    var schools = [];
    return Promise.all([deviceTokens]).then(results => {
        const tokenSnapshot = results[0];
        console.log(tokenSnapshot);
        if (!tokenSnapshot.hasChildren()) {
          return console.log("There are no users picking up at Pomona");
        }
        const payload = {
          notification: {
            title: "The 5C Laundry van is arriving",
            body: "The 5C Laundry van is at Pomona"
          }
        };

        const tokens = Object.keys(tokenSnapshot.val());
        var schoolsForTokens = [];
        var pomonaTokens = [];
        for(var user in tokens){
            var userToken = tokens[user];
            var schoolForUser = admin.database().ref(`/users/users/{userToken}`).once('value');
            schoolsForTokens.push(schoolForUser);
        }

        return Promise.all(schoolsForTokens).then(results => {
          const schoolSnapShot = results[0];
          console.log(schoolSnapShot.val());
          for (user in schools){
            var schoolOfUser = schools[user];
            if (schoolOfUser == "Pomona"){
              var userToken = tokens[user];
              pomonaTokens.push(userToken);
            }
          }

          admin.messaging().sendToDevice(pomonaTokens, payload).then(response => {
              const tokensToRemove = [];
              response.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                  console.error('Failure to send notification to', tokens[index], error);
                  if (error.code === 'messaging/invalid-registration-token' ||
                      error.code === 'messaging/registration-token-not-registered') {
                      tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
                  }
                }
              });
              return Promise.all(tokensToRemove);
          });
        }); //end of promise.all
    });
  });
```
