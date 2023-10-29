export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    }
    
    // We've included code to prevent your Battlesnake from moving backwards

    const height=gameState.board.height
    const width=gameState.board.width
    const myHead = gameState.you.body[0]
    const myNeck = gameState.you.body[1]
    
    if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
        moveSafety.left = false
        
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
        moveSafety.right = false
        
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
        moveSafety.down = false
        
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
        moveSafety.up = false
    }
    
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

    for (let i = 0; i < gameState.you.body.length-1; i++) {
        if(gameState.you.body[i].y==myHead.y+1&&gameState.you.body[i].x==myHead.x){
            moveSafety.up=false
        }
        if(gameState.you.body[i].y==myHead.y-1&&gameState.you.body[i].x==myHead.x){
            moveSafety.down=false
        }
        if(gameState.you.body[i].x==myHead.x-1&&gameState.you.body[i].y==myHead.y){
            moveSafety.left=false
        }
        if(gameState.you.body[i].x==myHead.x+1&&gameState.you.body[i].y==myHead.y){
            moveSafety.right=false
        }
    }

    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake

    for (let i = 0; i < gameState.board.snakes.length; i++) {
        for (let j = 0; j < gameState.board.snakes[i].body.length-1; j++) {
            if(gameState.board.snakes[i].body[j].x==myHead.x&&myHead.y+1==gameState.board.snakes[i].body[j].y){
                moveSafety.up=false
            }
            if(gameState.board.snakes[i].body[j].x==myHead.x&&myHead.y-1==gameState.board.snakes[i].body[j].y){
                moveSafety.down=false
            }
            if(gameState.board.snakes[i].body[j].y==myHead.y&&myHead.x-1==gameState.board.snakes[i].body[j].x){
                moveSafety.left=false
            }
            if(gameState.board.snakes[i].body[j].y==myHead.y&&myHead.x+1==gameState.board.snakes[i].body[j].x){
                moveSafety.right=false
            }
        }
    }

    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    
    let nextMove=null
    let snakeArray=[]
    for (let i = 0; i < gameState.board.snakes.length; i++) {
        if(!isMe(gameState.board.snakes[i])){
            snakeArray.push(gameState.board.snakes[i])
        }
    }
    let smallestDistance={
        value:null,
        index:null
    }
    if(gameState.board.food.length>0){
        smallestDistance={value:Math.sqrt((myHead.x-gameState.board.food[0].x)**2+(myHead.y-gameState.board.food[0].y)**2),index:0}
        for (let i = 0; i < gameState.board.food.length; i++) {
            if(Math.sqrt((myHead.x-gameState.board.food[i].x)**2+(myHead.y-gameState.board.food[i].y)**2)<smallestDistance.value){
                smallestDistance.value=Math.sqrt((myHead.x-gameState.board.food[i].x)**2+(myHead.y-gameState.board.food[i].y)**2)
                smallestDistance.index=i
            }
        }
    }
    let closestSnake={
        value:null,
        index:null
    }
    if(snakeArray.length>0){
        closestSnake={value:Math.sqrt((snakeArray[0].head.x-myHead.x)**2+(snakeArray[0].head.y-myHead.y)**2),index:[0]}
        for (let i = 0; i < snakeArray.length; i++) {
            if(Math.sqrt((snakeArray[i].head.x-myHead.x)**2+(snakeArray[i].head.y-myHead.y)**2)<closestSnake.value){
                closestSnake.value=Math.sqrt((snakeArray[i].head.x-myHead.x)**2+(snakeArray[i].head.y-myHead.y)**2)
                closestSnake.index=i
            }
        }
    }
    let snakeBodyLengths=[]
    for (let i = 0; i < snakeArray.length; i++) {
        snakeBodyLengths.push(snakeArray[i].length)
    }
    let targetPoint={x:null,y:null}
    let killMode=false
    if(gameState.board.snakes.length>1&&Math.max(...snakeBodyLengths)<gameState.you.length&&closestSnake.index!=null){
        killMode=true
        targetPoint.x=snakeArray[closestSnake.index].head.x
        targetPoint.y=snakeArray[closestSnake.index].head.y
    }else if(smallestDistance.index!=null){
        targetPoint.x=gameState.board.food[smallestDistance.index].x
        targetPoint.y=gameState.board.food[smallestDistance.index].y
    }
    let futureMoveSafety={
        up: moveSafety.up,
        down: moveSafety.down,
        left: moveSafety.left,
        right: moveSafety.right
    }
    if(moveSafety.up){
        if(!checkSafety(myHead.x,myHead.y+1)){
            futureMoveSafety.up=false
        }
    }
    if(moveSafety.down){
        if(!checkSafety(myHead.x,myHead.y-1)){
            futureMoveSafety.down=false
        }
    }
    if(moveSafety.right){
        if(!checkSafety(myHead.x+1,myHead.y)){
            futureMoveSafety.right=false
        }
    }
    if(moveSafety.left){
        if(!checkSafety(myHead.x-1,myHead.y)){
            futureMoveSafety.left=false
        }
    }
    let potMoveSafety={
        up: futureMoveSafety.up,
        down: futureMoveSafety.down,
        left: futureMoveSafety.left,
        right: futureMoveSafety.right
    }
    if(!killMode){
        let snakeHeads=[]
        for (let i = 0; i < snakeArray.length; i++) {
            if(snakeArray[i].length>=gameState.you.length){
                snakeHeads.push({x:snakeArray[i].head.x,y:snakeArray[i].head.y})
            }
        }
        for (let i = 0; i < snakeHeads.length; i++) {
            if(futureMoveSafety.up){
                if(snakeHeads[i].y+1==myHead.y+1&&snakeHeads[i].x==myHead.x){
                    potMoveSafety.up=false
                }
                if(snakeHeads[i].y-1==myHead.y+1&&snakeHeads[i].x==myHead.x){
                    potMoveSafety.up=false
                }
                if(snakeHeads[i].y==myHead.y+1&&snakeHeads[i].x+1==myHead.x){
                    potMoveSafety.up=false
                }
                if(snakeHeads[i].y==myHead.y+1&&snakeHeads[i].x-1==myHead.x){
                    potMoveSafety.up=false
                }
            }
            if(futureMoveSafety.down){
                if(snakeHeads[i].y+1==myHead.y-1&&snakeHeads[i].x==myHead.x){
                    potMoveSafety.down=false
                }
                if(snakeHeads[i].y-1==myHead.y-1&&snakeHeads[i].x==myHead.x){
                    potMoveSafety.down=false
                }
                if(snakeHeads[i].y==myHead.y-1&&snakeHeads[i].x+1==myHead.x){
                    potMoveSafety.down=false
                }
                if(snakeHeads[i].y==myHead.y-1&&snakeHeads[i].x-1==myHead.x){
                    potMoveSafety.down=false
                }
            }
            if(futureMoveSafety.left){
                if(snakeHeads[i].x+1==myHead.x-1&&snakeHeads[i].y==myHead.y){
                    potMoveSafety.left=false
                }
                if(snakeHeads[i].x-1==myHead.x-1&&snakeHeads[i].y==myHead.y){
                    potMoveSafety.left=false
                }
                if(snakeHeads[i].x==myHead.x-1&&snakeHeads[i].y+1==myHead.y){
                    potMoveSafety.left=false
                }
                if(snakeHeads[i].x==myHead.x-1&&snakeHeads[i].y-1==myHead.y){
                    potMoveSafety.left=false
                }
            }
            if(futureMoveSafety.right){
                if(snakeHeads[i].x+1==myHead.x+1&&snakeHeads[i].y==myHead.y){
                    potMoveSafety.right=false
                }
                if(snakeHeads[i].x-1==myHead.x+1&&snakeHeads[i].y==myHead.y){
                    potMoveSafety.right=false
                }
                if(snakeHeads[i].x==myHead.x+1&&snakeHeads[i].y+1==myHead.y){
                    potMoveSafety.right=false
                }
                if(snakeHeads[i].x==myHead.x+1&&snakeHeads[i].y-1==myHead.y){
                    potMoveSafety.right=false
                }
            }
        }
    }
    let deltaX=targetPoint.x-myHead.x
    let deltaY=targetPoint.y-myHead.y
    if(Math.abs(deltaX)>Math.abs(deltaY)){
        if(deltaX>0&&potMoveSafety.right){
            nextMove='right'
        }else if(deltaX<0&&potMoveSafety.left){
            nextMove='left'
        }
    }else{
        if(deltaY<0&&potMoveSafety.down){
            nextMove='down'
        }else if(deltaY>0&&potMoveSafety.up){
            nextMove='up'
        }
    }
    if(gameState.you.health<101){
        for (let i = 0; i < gameState.board.food.length; i++) {
            if(gameState.board.food[i].x==myHead.x+1&&potMoveSafety.right&&gameState.board.food[i].y==myHead.y){
                nextMove='right'
            }
            if(gameState.board.food[i].x==myHead.x-1&&potMoveSafety.left&&gameState.board.food[i].y==myHead.y){
                nextMove='left'
            }
            if(gameState.board.food[i].y==myHead.y+1&&potMoveSafety.up&&gameState.board.food[i].x==myHead.x){
                nextMove='up'
            }
            if(gameState.board.food[i].y==myHead.y-1&&potMoveSafety.down&&gameState.board.food[i].x==myHead.x){
                nextMove='down'
            }
        }
    }
    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction])
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected!`)
    }  
    let futureSafeMoves = Object.keys(futureMoveSafety).filter(direction => futureMoveSafety[direction])
    let potSafeMoves = Object.keys(potMoveSafety).filter(direction => potMoveSafety[direction])
    console.log('\n'+gameState.turn);console.log(safeMoves);console.log(futureSafeMoves);console.log(potSafeMoves);if(killMode){console.log('KILL MODE ACTIVATED')};console.log(targetPoint)
    if(nextMove==null){
        if(potSafeMoves.length!=0){
            nextMove=potSafeMoves[Math.floor(Math.random() * potSafeMoves.length)]
        }
        else if(futureSafeMoves.length!=0){
            nextMove=futureSafeMoves[Math.floor(Math.random() * futureSafeMoves.length)]
        }
        else{
            nextMove=safeMoves[Math.floor(Math.random() * safeMoves.length)]
        }
    }
    if(gameState.board.snakes.length<2&&gameState.you.health>10){
        chaseTail()
    }
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove};
    function chaseTail(){
        if(gameState.turn%4==0&&potMoveSafety.up){
            nextMove='up'
        }
        if(gameState.turn%4==1&&potMoveSafety.right){
            nextMove='right'
        }
        if(gameState.turn%4==2&&potMoveSafety.down){
            nextMove='down'
        }
        if(gameState.turn%4==3&&potMoveSafety.left){
            nextMove='left'
        }
    }
    function isMe(snake){
        if(snake.head.x==myHead.x&&snake.head.y==myHead.y){
            return true
        }else{
            return false
        }
    }
    function checkSafety(xPos,yPos){
        let thisDirMoveSafety={
            up: true,
            down: true,
            left: true,
            right: true
        }
        if (myNeck.x==xPos-1&&myNeck.y==yPos) {
            thisDirMoveSafety.left = false;
        } else if (myNeck.x==xPos+1&&myNeck.y==yPos) {
            thisDirMoveSafety.right = false;
            
        } else if (myNeck.y==yPos-1&&myNeck.x==xPos) {
            thisDirMoveSafety.down = false;
            
        } else if (myNeck.y==yPos+1&&myNeck.x==xPos) {
            thisDirMoveSafety.up = false;
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
        for (let i = 0; i < gameState.you.body.length-1; i++) {
            if(gameState.you.body[i].y==yPos+1&&gameState.you.body[i].x==xPos){
                thisDirMoveSafety.up=false
            }
            if(gameState.you.body[i].y==yPos-1&&gameState.you.body[i].x==xPos){
                thisDirMoveSafety.down=false
            }
            if(gameState.you.body[i].x==xPos-1&&gameState.you.body[i].y==yPos){
                thisDirMoveSafety.left=false
            }
            if(gameState.you.body[i].x==xPos+1&&gameState.you.body[i].y==yPos){
                thisDirMoveSafety.right=false
            }
        }
        for (let i = 0; i < gameState.board.snakes.length; i++) {
            for (let j = 0; j < gameState.board.snakes[i].body.length-1; j++) {
                if(gameState.board.snakes[i].body[j].x==xPos&&yPos+1==gameState.board.snakes[i].body[j].y){
                    thisDirMoveSafety.up=false
                }
                if(gameState.board.snakes[i].body[j].x==xPos&&yPos-1==gameState.board.snakes[i].body[j].y){
                    thisDirMoveSafety.down=false
                }
                if(gameState.board.snakes[i].body[j].y==yPos&&xPos-1==gameState.board.snakes[i].body[j].x){
                    thisDirMoveSafety.left=false
                }
                if(gameState.board.snakes[i].body[j].y==yPos&&xPos+1==gameState.board.snakes[i].body[j].x){
                    thisDirMoveSafety.right=false
                }
            }
        }
        let thisDirSafeMoves = Object.keys(thisDirMoveSafety).filter(direction => thisDirMoveSafety[direction])
        if(thisDirSafeMoves.length==0){
            return false
        }else{
            return true
        }
    }
}