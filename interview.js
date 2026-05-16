let currentQuestion = 1
let totalQuestions = 10

let score = 0

let timer
let timeLeft = 60

let currentAnswer = []

function displayValue(v){

return v===null ? "NULL" : v

}

function randomValue(max, includeNull){

if(includeNull && Math.random()<0.3){
return null
}

return Math.floor(Math.random()*max)+1

}

function randomList(size,max,includeNull){

let arr=[]

for(let i=0;i<size;i++){

arr.push(
randomValue(max,includeNull)
)

}

return arr

}

function generateQuestion(){

let sizeA = Math.floor(Math.random()*5)+4
let sizeB = Math.floor(Math.random()*5)+4

let max = 5

let includeNull = true

let A = randomList(sizeA,max,includeNull)
let B = randomList(sizeB,max,includeNull)

document.getElementById("tableA").value =
A.map(displayValue).join("\n")

document.getElementById("tableB").value =
B.map(displayValue).join("\n")

let joins = [
"inner",
"left",
"right",
"full"
]

let randomJoin =
joins[
Math.floor(Math.random()*joins.length)
]

document.getElementById("joinType").value =
randomJoin

currentAnswer =
calculateJoin(A,B,randomJoin)

}

function calculateJoin(A,B,type){

let rows=[]

if(type==="inner"){

A.forEach(a=>{

B.forEach(b=>{

if(
a!==null &&
b!==null &&
a===b
){
rows.push([a,b])
}

})

})

}

if(type==="left"){

A.forEach(a=>{

let matched=false

B.forEach(b=>{

if(
a!==null &&
b!==null &&
a===b
){

rows.push([a,b])

matched=true

}

})

if(!matched){
rows.push([a,null])
}

})

}

if(type==="right"){

B.forEach(b=>{

let matched=false

A.forEach(a=>{

if(
a!==null &&
b!==null &&
a===b
){

rows.push([a,b])

matched=true

}

})

if(!matched){
rows.push([null,b])
}

})

}

if(type==="full"){

let matched =
new Array(B.length).fill(false)

A.forEach(a=>{

let m=false

B.forEach((b,i)=>{

if(
a!==null &&
b!==null &&
a===b
){

rows.push([a,b])

matched[i]=true

m=true

}

})

if(!m){
rows.push([a,null])
}

})

B.forEach((b,i)=>{

if(!matched[i]){

rows.push([null,b])

}

})

}

return rows

}


function startInterview(){

document
.getElementById("startBtn")
.style.display = "none"

currentQuestion = 1
score = 0

document.getElementById("score").innerText =
"Score: 0"

document.getElementById("result").innerText =
""

nextQuestion()

}

function nextQuestion(){

if(currentQuestion >= totalQuestions + 1){

clearInterval(timer)

document.getElementById("result").innerText =
"Interview Finished! Final Score: " + score

return

}

document.getElementById("questionNumber").innerText =
"Question " +
currentQuestion +
" / " +
totalQuestions

document.getElementById("guess").value = ""

generateQuestion()

startTimer()

}

function startTimer(){

clearInterval(timer)

timeLeft = 60

document.getElementById("timer").innerText =
timeLeft + "s"

timer = setInterval(()=>{

timeLeft--

document.getElementById("timer").innerText =
timeLeft + "s"

if(timeLeft<=0){

clearInterval(timer)

currentQuestion++

nextQuestion()

}

},1000)

}

function submitInterviewAnswer(){

let guess =
parseInt(
document.getElementById("guess").value
)

if(guess===currentAnswer.length){

score++

document.getElementById("result").innerText =
"✅ Correct"

}else{

document.getElementById("result").innerText =
"❌ Wrong"

}

document.getElementById("score").innerText =
"Score: " + score

clearInterval(timer)

currentQuestion++

setTimeout(()=>{

nextQuestion()

},1200)

}
