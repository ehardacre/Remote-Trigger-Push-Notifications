//PREVIOUSLY

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
  

//REFACTORED

//Initializes empty array that we will eventually be populating and returning
var pomonaTokens2 = [];

//set var ref equal to the object set of token registrations
var ref = firebase.database().ref("users/users");
ref.once("value")
  .then(function(snapshot) {
    //Loop through tokens
    snapshot.forEach(function(childSnapshot) {
    
      //set var usrToken to the current token we have looped on
      var usrTok = childSnapshot.key;
      
      //get the school for that user token
      var school = snapshot.child("{usrTok}/Registration Token").val();
      
      if (school == "Pomona") {
        pomonaTokens2.push(usrTok);
      }
    })
 });
