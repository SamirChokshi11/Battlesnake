export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    const height=gameState.board.height
    const width=gameState.board.width
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    
    // if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    //     moveSafety.left = false;
        
    // } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    //     moveSafety.right = false;
        
    // } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    //     moveSafety.down = false;
        
    // } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    //     moveSafety.up = false;
    // }
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board

    if(myHead.y==height-1){
        moveSafety.up=false
    }
    if(myHead.y==0){
        moveSafety.down=false
    }
    if(myHead.x==0){
        moveSafety.left=false
    }
    if(myHead.x==width-1){
        moveSafety.right=false
    }
    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake

    for (let i = 0; i < gameState.you.body.length; i++) {
        if(gameState.you.body[i].y==myHead.y+1){
            if(gameState.you.body[i].x==myHead.x){moveSafety.up=false}
        }
        if(gameState.you.body[i].y==myHead.y-1){
            if(gameState.you.body[i].x==myHead.x){moveSafety.down=false}
        }
        if(gameState.you.body[i].x==myHead.x-1){
            if(gameState.you.body[i].y==myHead.y){moveSafety.left=false}
        }
        if(gameState.you.body[i].x==myHead.x+1){
            if(gameState.you.body[i].y==myHead.y){moveSafety.right=false}
        }
    }

    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
   for (let i = 0; i < gameState.board.snakes.length; i++) {
    for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
        if(gameState.board.snakes[i].body[j].x==myHead.x){
            if(myHead.y+1==gameState.board.snakes[i].body[j].y){moveSafety.up=false}
        }
        if(gameState.board.snakes[i].body[j].x==myHead.x){
            if(myHead.y-1==gameState.board.snakes[i].body[j].y){moveSafety.down=false}
        }
        if(gameState.board.snakes[i].body[j].y==myHead.y){
            if(myHead.x-1==gameState.board.snakes[i].body[j].x){moveSafety.left=false}
        }
        if(gameState.board.snakes[i].body[j].y==myHead.y){
            if(myHead.x+1==gameState.board.snakes[i].body[j].x){moveSafety.right=false}
        }
    }
   }

    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected!`);
    }

    // Choose a random move from the safe moves
    let nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

    let futureMoveSafety={
        up: moveSafety.up,
        down: moveSafety.down,
        left: moveSafety.left,
        right: moveSafety.right
    }

    if(moveSafety.up==true){
        if(checkSafety(myHead.x,myHead.y+1)==false){futureMoveSafety.up=false}
    }
    if(moveSafety.down==true){
        if(checkSafety(myHead.x,myHead.y-1)==false){futureMoveSafety.down=false}
    }
    if(moveSafety.right==true){
        if(checkSafety(myHead.x+1,myHead.y)==false){futureMoveSafety.right=false}
    }
    if(moveSafety.left==true){
        if(checkSafety(myHead.x-1,myHead.y)==false){futureMoveSafety.down=false}
    }

    let futureSafeMoves=Object.keys(futureMoveSafety).filter(direction => futureMoveSafety[direction])

    if(futureSafeMoves.length==0){
        nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }else{
        console.log(safeMoves)
        console.log(futureSafeMoves)
        nextMove = futureSafeMoves[Math.floor(Math.random() * futureSafeMoves.length)];
    }

    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board

    let smallestDistance={value:Math.sqrt((myHead.x-gameState.board.food[0].x)**2+(myHead.y-gameState.board.food[0].y)**2),index:0}
    for (let i = 0; i < gameState.board.food.length; i++) {
        if(Math.sqrt((myHead.x-gameState.board.food[i].x)**2+(myHead.y-gameState.board.food[i].y)**2)<smallestDistance.value){
            smallestDistance.value=Math.sqrt((myHead.x-gameState.board.food[i].x)**2+(myHead.y-gameState.board.food[i].y)**2)
            smallestDistance.index=i
        }
    }
    
    let targetPoint={x:gameState.board.food[smallestDistance.index].x,y:gameState.board.food[smallestDistance.index].y}

    let deltaX = targetPoint.x - myHead.x
    let deltaY = targetPoint.y - myHead.y
  
    // if (Math.abs(deltaX) > Math.abs(deltaY)) {
    //   if (deltaX > 0) {
    //     if(moveSafety.right==true){nextMove='right'}
    //   } else if (deltaX < 0) {
    //     if(moveSafety.left==true){ nextMove='left'}
    //   }
    // } else {
    //   if (deltaY > 0) {
    //     if(moveSafety.down==true){nextMove='down'}
    //   } else if (deltaY < 0) {
    //     if(moveSafety.up==true){nextMove='up'}
    //   }
    // }

if(gameState.you.health<101){
    for (let i = 0; i < gameState.board.food.length; i++) {
        if(gameState.board.food[i].x==myHead.x+1){
            if(moveSafety.right==true&&gameState.board.food[i].y==myHead.y){nextMove='right'}
        }
        if(gameState.board.food[i].x==myHead.x-1){
            if(moveSafety.left==true&&gameState.board.food[i].y==myHead.y){nextMove='left'}
        }
        if(gameState.board.food[i].y==myHead.y+1){
            if(moveSafety.up==true&&gameState.board.food[i].x==myHead.x){nextMove='up'}
        }
        if(gameState.board.food[i].y==myHead.y-1){
            if(moveSafety.down==true&&gameState.board.food[i].x==myHead.x){nextMove='down'}
        }
    }
}

    console.log(`MOVE ${gameState.turn+1}: ${nextMove}`)
    return { move: nextMove};

function chaseTail(){
    if(gameState.turn%4==0){
        return {move:"up"}
    }
    if(gameState.turn%4==1){
        return {move:"right"}
    }
    if(gameState.turn%4==2){
        return {move:"down"}
    }
    if(gameState.turn%4==3){
        return {move:"left"}
    }
}

function checkSafety(xPos,yPos){
    if(xPos==0&&yPos==0){return false}
    if(xPos==width-1&&yPos==height-1){return false}
    if(xPos==0&&yPos==height-1){return false}
    if(xPos==width-1&&yPos==0){return false}
    let thisDirMoveSafety={
        up: true,
        down: true,
        left: true,
        right: true
    }
    if(yPos==height-1){
        thisDirMoveSafety.up=false
    }
    if(yPos==0){
        thisDirMoveSafety.down=false
    }
    if(xPos==0){
        thisDirMoveSafety.left=false
    }
    if(xPos==width-1){
        thisDirMoveSafety.right=false
    }
    
    for (let i = 0; i < gameState.you.body.length; i++) {
        if(gameState.you.body[i].y==yPos+1){
            if(gameState.you.body[i].x==xPos){thisDirMoveSafety.up=false}
        }
        if(gameState.you.body[i].y==yPos-1){
            if(gameState.you.body[i].x==xPos){thisDirMoveSafety.down=false}
        }
        if(gameState.you.body[i].x==xPos-1){
            if(gameState.you.body[i].y==yPos){thisDirMoveSafety.left=false}
        }
        if(gameState.you.body[i].x==xPos+1){
            if(gameState.you.body[i].y==yPos){thisDirMoveSafety.right=false}
        }
    }
    
    for (let i = 0; i < gameState.board.snakes.length; i++) {
    for (let j = 0; j < gameState.board.snakes[i].body.length; j++) {
        if(gameState.board.snakes[i].body[j].x==xPos){
            if(yPos+1==gameState.board.snakes[i].body[j].y){thisDirMoveSafety.up=false}
        }
        if(gameState.board.snakes[i].body[j].x==xPos){
            if(yPos-1==gameState.board.snakes[i].body[j].y){thisDirMoveSafety.down=false}
        }
        if(gameState.board.snakes[i].body[j].y==yPos){
            if(xPos-1==gameState.board.snakes[i].body[j].x){thisDirMoveSafety.left=false}
        }
        if(gameState.board.snakes[i].body[j].y==yPos){
            if(xPos+1==gameState.board.snakes[i].body[j].x){thisDirMoveSafety.right=false}
        }
    }
    }
    let thisDirSafeMoves=Object.keys(thisDirMoveSafety).filter(direction => thisDirMoveSafety[direction])
    if(thisDirSafeMoves.length==0){
        return false
    }else{
        console.log('a')
        console.log(thisDirSafeMoves)
        return true
    }
}
}