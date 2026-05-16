let answer = []
let currentJoinType = ""

function displayValue(v){
return v===null ? "NULL" : v
}

function seededRandom(seed){

let x = Math.sin(seed) * 10000

return x - Math.floor(x)

}

function getDailySeed(){

let today = new Date()

return Number(
`${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`
)

}

function seededValue(seed,max){

return Math.floor(
seededRandom(seed) * max
)+1

}

function generateDailyChallenge(){

let seed = getDailySeed()

let date = new Date()

let formattedDate =
date.toDateString()

document.getElementById("challengeDate").innerText =
formattedDate

let sizeA = (seededValue(seed,5)) + 3
let sizeB = (seededValue(seed+1,5)) + 3

let A=[]
let B=[]

for(let i=0;i<sizeA;i++){

let val = seededValue(seed+i,6)

if(seededRandom(seed+i)>0.8){
val = null
}

A.push(val)

}

for(let i=0;i<sizeB;i++){

let val = seededValue(seed+i+10,6)

if(seededRandom(seed+i+20)>0.8){
val = null
}

B.push(val)

}

let joins = [
"inner",
"left",
"right",
"full"
]

let joinType =
joins[
seededValue(seed+99,joins.length)-1
]
currentJoinType = joinType
  
answer = join(A,B,joinType)

document.getElementById("tableA").value =
A.map(displayValue).join("\n")

document.getElementById("tableB").value =
B.map(displayValue).join("\n")

document.getElementById("questionText").innerHTML =

"What will be the row count for the <b>" +

joinType.toUpperCase() +

"</b> JOIN between the tables below?"

}

function join(A,B,type){

let rows=[]

if(type==="inner"){

A.forEach(a=>{
B.forEach(b=>{
if(a!==null && b!==null && a===b){
rows.push([a,b])
}
})
})

}

if(type==="left"){

A.forEach(a=>{

let matched=false

B.forEach(b=>{

if(a!==null && b!==null && a===b){
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

if(a!==null && b!==null && a===b){
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

let matched = new Array(B.length).fill(false)

A.forEach(a=>{

let m=false

B.forEach((b,i)=>{

if(a!==null && b!==null && a===b){
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

function checkDailyChallenge(){

let guess = parseInt(
document.getElementById("guess").value
)

if(guess===answer.length){

showToast(
"✅ Correct Answer",
"success"
)

}else{

showToast(
"❌ Wrong Answer",
"error"
)

}

}

function revealDailyAnswer(){

let tbody =
document.getElementById("rows")

tbody.innerHTML = ""

answer.forEach(r=>{

let tr =
document.createElement("tr")

let a = displayValue(r[0])
let b = displayValue(r[1])

tr.innerHTML =
"<td>"+a+"</td><td>"+b+"</td>"

tbody.appendChild(tr)

})

showExplanation(currentJoinType)

document.getElementById("result").innerText =
"Correct Row Count = " + answer.length

}

function showExplanation(type){

let text = ""

if(type==="inner"){
text =
"INNER JOIN returns only matching rows between both tables."
}

if(type==="left"){
text =
"LEFT JOIN returns all rows from Table A and matching rows from Table B."
}

if(type==="right"){
text =
"RIGHT JOIN returns all rows from Table B and matching rows from Table A."
}

if(type==="full"){
text =
"FULL JOIN returns all matching and non-matching rows from both tables."
}

document.getElementById("explanation").innerHTML =
"<b>Explanation</b><br><br>" + text

}

function showToast(message,type){

let toast =
document.getElementById("toast")

toast.innerText = message

toast.className =
"toast show " + type

setTimeout(()=>{

toast.className = "toast"

},2200)

}

window.onload = function(){

generateDailyChallenge()

}
