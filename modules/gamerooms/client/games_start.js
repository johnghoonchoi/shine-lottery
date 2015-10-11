Template.gameStart.onCreated(function() {
  //커넥션 정보에서 최대 30명으로 가정한 정보
  let currentGamers = [
    { _id: 1 },
    { _id: 2 },
    { _id: 3 },
    { _id: 4 },
    { _id: 5 },
  ];

  currentGamers.forEach(function(gamer) {
    let selectNum = Random.fraction() * 1000;
    gamer.score = selectNum;
  });

  let winner = _.max(currentGamers, function(gamer){
    console.log('gamer: ', gamer);
    
    return gamer.score;
  });
  
  console.log('winner: ', winner);

});

Template.gameStart.onDestroyed(function() {

});

Template.gameStart.onRendered(function() {

});