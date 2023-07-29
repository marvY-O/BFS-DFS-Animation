var drawingBoard = document.querySelector('.drawing-board');
var modeBtn = document.querySelector('.mode');
var modeText = document.querySelector('.mode-text');
var modeSelect = document.querySelector('.mode-buttons');
var lines = document.querySelector('.lines');
var nodesContainer = document.querySelector('.nodes-container');
const algoSelect = document.querySelector('.algo-select');
const delay = document.querySelector('.delay-select');
const btnStart = document.querySelector('.start-animate');
const err_msg = document.querySelector('.error');
const resetBtn = document.querySelector('.reset-btn');
const clearBtn = document.querySelector('.clear-btn');


var svgns = "http://www.w3.org/2000/svg";
var size = 0;
const nodes = new Set();
const center_nodes = [];
const selected_nodes = new Set();
const adj_list = [];

function add_node(x, y){

    var g_ele = document.createElementNS(svgns, 'g');
    g_ele.setAttributeNS(null, 'id', size);

    var circle = document.createElementNS(svgns, 'circle');

    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', 16);
    circle.setAttributeNS(null, 'style', 'fill: white; stroke: black; stroke-width: 3px;' );

    var text = document.createElementNS(svgns, 'text');

    text.setAttributeNS(null, 'x', x);
    text.setAttributeNS(null, 'y', y);
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'stroke-width', '2px');
    text.setAttributeNS(null, 'dy', '0.3em');

    text.innerHTML = size;
    nodes.add(size);
    adj_list.push(new Set());
    size+=1;

    center_nodes.push([x,y]);


    g_ele.appendChild(circle);
    g_ele.appendChild(text);

    //console.log(circle);
    nodesContainer.appendChild(g_ele);
}

function drawCircle(event){
    add_node(event.clientX-drawingBoard.getBoundingClientRect().left, event.clientY);
}

function deselect_all_nodes(){
    for (const i of selected_nodes) {
        var g_ele = document.getElementById(String(i));
        g_ele.childNodes[0].style['fill'] = "white";
    }

    selected_nodes.clear();
}

function drawEdge(src, dest){
    var edge = document.createElementNS(svgns, 'line');
    edge.setAttributeNS(null, 'x1', center_nodes[src][0]);
    edge.setAttributeNS(null, 'y1', center_nodes[src][1]);
    edge.setAttributeNS(null, 'x2', center_nodes[dest][0]);
    edge.setAttributeNS(null, 'y2', center_nodes[dest][1]);
    edge.setAttributeNS(null, 'stroke', "black");
    edge.setAttributeNS(null, 'marker-end', "url(#arrowhead)")

    lines.appendChild(edge);
}

function add_edge(){
    const src = Array.from(selected_nodes)[0];
    const dest = Array.from(selected_nodes)[1];
    adj_list[src].add(dest);

    drawEdge(src, dest);

}

function select_node(event){

    x = event.clientX-drawingBoard.getBoundingClientRect().left;
    y = event.clientY;

    for (var i=0; i<size; i++){
        //console.log((center_nodes[i][0],center_nodes[i][1]));
        if (Math.abs(center_nodes[i][0] - x) < 16 && Math.abs(center_nodes[i][1] - y) < 16){

            if (selected_nodes.size == 1){
                selected_nodes.add(i);
                add_edge();
                deselect_all_nodes();

                return;
            }
            
            const g_ele = document.getElementById(String(i));
            g_ele.childNodes[0].style['fill'] = "orange";
            selected_nodes.add(i);
            
            return;
        }
    }

    deselect_all_nodes();
    
}

/*
function select_multiple(event){
    const src = selected[];
    if (src == -1) return;
    const g_src = document.getElementById(String(i));
    g_src.childNodes[0].style['fill'] = "orange";

    const dest = select_node(event);
    if (dest == -1){
        g_src.childNodes[0].style['fill'] = "white";
        return;
    }


}*/

function toggle_mode(){
    if (modeBtn.checked){
        modeText.innerHTML = "Add Edges";
        drawingBoard.removeEventListener("click", drawCircle);
        drawingBoard.addEventListener("click", select_node);
    }
    else{
        modeText.innerHTML = "Add Nodes";
        drawingBoard.addEventListener("click", drawCircle);
        drawingBoard.removeEventListener("click", select_node);
    }
}



//drawingBoard.addEventListener("click", drawCircle);

//modeBtn.addEventListener("change", toggle_mode)

document.querySelector('.draw-node').onclick = function () {
    document.querySelector('.draw-edge').style.backgroundColor = "white";
    document.querySelector('.cursor').style.backgroundColor = "white";
    
    this.style.backgroundColor = "pink";

    drawingBoard.style.cursor = "crosshair";

    drawingBoard.removeEventListener("click", select_node);
    drawingBoard.removeEventListener("click", select_source);
    drawingBoard.addEventListener("click", drawCircle);

}

document.querySelector('.draw-edge').onclick = function () {
    document.querySelector('.draw-node').style.backgroundColor = "white";
    document.querySelector('.cursor').style.backgroundColor = "white";
    
    this.style.backgroundColor = "pink";

    drawingBoard.style.cursor = "pointer";

    drawingBoard.addEventListener("click", select_node);
    drawingBoard.removeEventListener("click", drawCircle);
    drawingBoard.removeEventListener("click", select_source);

}

document.querySelector('.cursor').onclick = function () {
    document.querySelector('.draw-node').style.backgroundColor = "white";
    document.querySelector('.draw-edge').style.backgroundColor = "white";
    
    this.style.backgroundColor = "pink";

    drawingBoard.style.cursor = "default";

    drawingBoard.removeEventListener("click", select_node);
    drawingBoard.removeEventListener("click", drawCircle);
    drawingBoard.addEventListener("click", select_source);

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }


function setColor(i, color){
    var g_ele = document.getElementById(String(i));
    g_ele.childNodes[0].style['fill'] = color;
}

function resetColorAll(){
    for (var i=0; i<size; i++){
        setColor(i, "white");
    }
}

async function bfs(src, timeout){
    resetColorAll();
    var visited = new Array(size);
    for (var i=0; i<size; i++){
        visited[i] = false;
    }
    var q = new Queue();
    q.add(src);
    while (!q.empty()){
        var cur = q.front();
        setColor(cur, "cyan");
        await new Promise(done => setTimeout(() => done(), timeout));
        visited[cur] = true;
        q.pop();
        //console.log(cur);
        for (const i of adj_list[cur]){
            if (visited[i]) continue;
            //console.log(i);
            setColor(i, "yellow");
            await new Promise(done => setTimeout(() => done(), timeout));
            q.add(i);
            setColor(i, "white")
        }

        setColor(cur, "red");

    }
}

async function bestfirstsearch(src, timeout){
    resetColorAll();
    var visited = new Array(size);
    for (var i=0; i<size; i++){
        visited[i] = false;
    }
    var q = new Queue();
    q.add(src);
    while (!q.empty()){
        var cur = q.front();
        setColor(cur, "cyan");
        await new Promise(done => setTimeout(() => done(), timeout));
        visited[cur] = true;
        q.pop();
        //console.log(cur);
        for (const i of adj_list[cur]){
            if (visited[i]) continue;
            //console.log(i);
            setColor(i, "yellow");
            await new Promise(done => setTimeout(() => done(), timeout));
            q.add(i);
            setColor(i, "white")
        }

        setColor(cur, "red");

    }
}


async function dfs(src, timeout){
    resetColorAll();
    var visited = new Array(size);
    for (var i=0; i<size; i++){
        visited[i] = false;
    }
    var q = new Stack();
    q.add(src);
    while (!q.empty()){
        var cur = q.front();
        setColor(cur, "cyan");
        await new Promise(done => setTimeout(() => done(), timeout));
        visited[cur] = true;
        q.pop();
        //console.log(cur);
        for (const i of adj_list[cur]){
            if (visited[i]) continue;
            //console.log(i);
            setColor(i, "yellow");
            await new Promise(done => setTimeout(() => done(), timeout));
            q.add(i);
            setColor(i, "white")
        }

        setColor(cur, "red");

    }
}

function start_animate(event){
    var alg = algoSelect.selectedIndex;
    var delay_val = delay.selectedIndex;

    delay_val = Number(delay[delay_val].value)*1000;
    
    if (selected_nodes.size == 0){
        err_msg.innerHTML = "Source not selected!";
        return;
    }

    if (alg == 0){
        bfs(Array.from(selected_nodes)[0], delay_val);
    }
    else if (alg == 1){
        dfs(Array.from(selected_nodes)[0], delay_val);
    }
}

function select_source(event){
    x = event.clientX-drawingBoard.getBoundingClientRect().left;
    y = event.clientY;

    for (var i=0; i<size; i++){
        //console.log((center_nodes[i][0],center_nodes[i][1]));
        if (Math.abs(center_nodes[i][0] - x) < 16 && Math.abs(center_nodes[i][1] - y) < 16){
            if (selected_nodes.size >= 1){
                selected_nodes.clear();
                resetColorAll();
            }
            err_msg.innerHTML = "";
            const g_ele = document.getElementById(String(i));
            g_ele.childNodes[0].style['fill'] = "green";
            selected_nodes.add(i);

            return;
        }
    }

    selected_nodes.clear();
    deselect_all_nodes();
}

resetBtn.onclick = function() {
    nodesContainer.innerHTML = "";
    lines.innerHTML = "";
    err_msg.innerHTML = "";
    size = 0;
    nodes.clear();
    center_nodes.length = 0;;
    selected_nodes.clear();
    adj_list.length = 0;
}

clearBtn.onclick = function(){
    resetColorAll();
}


btnStart.addEventListener("click", start_animate);

