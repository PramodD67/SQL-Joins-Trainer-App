const appState = {
answer: [],
interviewMode: false,
currentQuestion: 1,
totalQuestions: 10,
score: 0,
timer: 60,
interval: null
}
let answer=[]
// Interview Mode Button
document
.getElementById("startInterview")
.addEventListener("click", startInterview)
function startInterview(){
appState.interviewMode = true
appState.currentQuestion = 1
appState.score = 0
updateInterviewPanel()
document
.getElementById("interviewPanel")
.classList.remove("hidden")
generate()
startTimer()
}
function updateInterviewPanel(){
document
.getElementById("questionNumber")
.innerText =
"Question " +
appState.currentQuestion +
" / " +
appState.totalQuestions

document
.getElementById("score")
.innerText =
"Score: " + appState.score
}
function startTimer(){
clearInterval(appState.interval)
appState.timer = 60
updateTimer()
appState.interval = setInterval(()=>{
appState.timer-
updateTimer()
if(appState.timer <= 0){
nextQuestion()
}
},1000)
}
function updateTimer(){
document
.getElementById("timer")
.innerText = appState.timer + "s"
}
function nextQuestion(){
clearInterval(appState.interval)
appState.currentQuestion++
if(appState.currentQuestion > appState.totalQuestions){
finishInterview()
return
}
updateInterviewPanel()
generate()
startTimer()
}
function finishInterview(){
clearInterval(appState.interval)
let accuracy = Math.round(
(appState.score / appState.totalQuestions) * 100
)
localStorage.setItem(
"bestScore",
Math.max(
appState.score,
localStorage.getItem("bestScore") || 0
)
)
alert(
"Interview Finished!\n\n" +
"Score: " +
appState.score +
"/" +
appState.totalQuestions +
"\n\nAccuracy: " + accuracy + "%"
)
appState.interviewMode = false
}
function shareResult(){
let text =
"I scored " +
appState.score +
"/" +
appState.totalQuestions +
" in SQL Joins Playground 😎"
if(navigator.share){
navigator.share({
title:"SQL Joins Playground",
text:text
})
}else{
alert(text)
}
}
function displayValue(v){
return v===null ? "NULL" : v
}
function generateValue(type,max,includeNull){
if(includeNull && Math.random()<0.35){
return null
}
if(type==="number"){
return Math.floor(Math.random()*max)+1
}
return String.fromCharCode(65 + Math.floor(Math.random()*max))
}
function randomList(size,max,includeNull,type){
let arr=[]
for(let i=0;i<size;i++){
arr.push(generateValue(type,max,includeNull))
}
return arr
}
function generate(){
let diff=document.getElementById("difficulty").value
let sizeA=4
let sizeB=4
let max=6
let includeNull=false
if(diff==="medium"){
sizeA=6
sizeB=6
max=9
includeNull=true
}
if(diff==="hard"){
sizeA=10
sizeB=1
max=14
includeNull=true
}
let type=Math.random()<0.5 ? "number" : "alpha"
let A=randomList(sizeA,max,includeNull,type)
let B=randomList(sizeB,max,includeNull,type)
window.currentA = A
window.currentB = B
let joinTypes = [
"inner",
"left",
"right",
"full",
"cartesian",
"union",
"unionall"
]
let randomJoin =
joinTypes[
Math.floor(Math.random()*joinTypes.length)
]
if(appState.interviewMode){
document
.getElementById("joinType")
.value = randomJoin

}
let selectedJoin =
document.getElementById("joinType").value
answer = join(A,B,selectedJoin)
appState.answer = answer
document.getElementById("tableA").value =
A.map(displayValue).join("\n")
document.getElementById("tableB").value =
B.map(displayValue).join("\n")
document.getElementById("rows").innerHTML=""
document.getElementById("result").innerText=""
document.getElementById("explanation")
.innerText = ""
}
function parse(x){
return x.split(/\n/).map(v=>{
v=v.trim()
if(v.toLowerCase()==="null") return null
return v
})
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
let matched=new Array(B.length).fill(false)
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
if(type==="cartesian"){
A.forEach(a=>{
B.forEach(b=>{
rows.push([a,b])
})
})
}
if(type==="union"){
let set=[...new Set([...A,...B])]
set.forEach(x=>rows.push([x,""]))
}
if(type==="unionall"){
[...A,...B].forEach(x=>rows.push([x,""]))
}
return rows
}
function check(){
let A=parse(document.getElementById("tableA").value)
let B=parse(document.getElementById("tableB").value)
let type=document.getElementById("joinType").value
answer=join(A,B,type)
let guess=parseInt(document.getElementById("guess").value)
if(guess===answer.length){
document.getElementById("result")
.innerText="✅ Correct"
if(appState.interviewMode){
appState.score++
updateInterviewPanel()
}
}else{
document.getElementById("result")
.innerText="❌ Incorrect"
}
if(appState.interviewMode){
setTimeout(()=>{
nextQuestion()
},1000)
}
}
function reveal(){
let tbody=document.getElementById("rows")
tbody.innerHTML=""
answer.forEach(r=>{
let tr=document.createElement("tr")
let a=displayValue(r[0])
let b=displayValue(r[1])
tr.innerHTML="<td>"+a+"</td><td>"+b+"</td>"
tbody.appendChild(tr)
})
let type =
document.getElementById("joinType").value
document.getElementById("result")
.innerText =
"Correct Row Count = " + answer.length
document.getElementById("explanation")
.innerHTML =
`<b>Explanation</b><br><br>
Join Type: ${type}<br>
Table A Rows: ${window.currentA.length}<br>
Table B Rows: ${window.currentB.length}<br>
Output Rows: ${answer.length}<br><br>
Duplicates and NULL values affect output count significantly.`
}
