document.addEventListener('DOMContentLoaded', ()=>{
    manager = new MemoryManager(MAX_SIZE);
    init(session1)
    init(session2)
    document.querySelector("#add-btn").onclick = newJob();
})

function init(id){
    // 初始化空闲区表        
    var newRow = document.getElementById(id).children["idleTable"].insertRow(-1);
    newRow.className = "Node"
    newRow.insertCell(0).innerHTML = 0;         //起始地址
    newRow.insertCell(1).innerHTML = MAX_SIZE;  //结束地址
    newRow.insertCell(2).innerHTML = MAX_SIZE;  //大小
}

function isValid(size){
    if(!isNaN(size)){
        if (size > MAX_SIZE){
            window.alert("输入内存过大，当前最大空间为"+MAX_SIZE);
            return false;
        }
        else if(size <= 0){
            window.alert("请输入合法的内存大小")
            return false;
        }
        return true;
    }
    window.alert("请输入一个合法数字(1-"+MAX_SIZE+")");
    return false;
}

function newJob(){  //为两种算法分配分别分配内存
    let size = document.getElementById("input_size").value;
    if(isValid(size)){
        size = parseInt(size);
        cnt++;
        if(!allocate(session1, size, cnt))
            window.alert("MEM1 当前内存碎片过多，请释放一些内存再试一试！")
        if(! allocate(session2, size, cnt)){
            window.alert("MEM2 当前内存碎片过多，请释放一些内存再试一试！");
        }
    }
}

function allocate(id, size, PID){
    var idleTable = document.getElementById(id).children["idleTable"].
    var Nodes = idleTable.querySelectorAll(".Node");
    for(var i = 0; i < Nodes.length; i++){
        var bg = Nodes[i].querySelector(".bg");
        var ed = Nodes[i].querySelector(".ed");
        var freeSize = Nodes[i].querySelector(".size");
        if(size <= freeSize){ 
            Nodes[i].querySelector(".bg").innerHTML += size;
            Nodes[i].querySelector(".size").innerHTML -= size;
            addNodeToBusy(id, bg, ed, size, PID)    //分配成功，添加到占用区表单
            if(Nodes[i].querySelector(".size").innerHTML == '0'){//空闲区刚好用完
                idleTable.deleteRow(i);
            }
            // Animation
            return true;
        }
    }   
    return false;
}

function addNodeToBusy(id, bg, ed, size, PID){
    // 初始化空闲区表        
    var newRow = document.getElementById(id).children["busyTable"].insertRow(-1);
    newRow.className = "Node"
    newRow.insertCell(0).innerHTML = PID;         //PID
    newRow.insertCell(1).innerHTML = bg;  //起始地址
    newRow.insertCell(2).innerHTML = ed;  //终止地址
    newRow.insertCell(3).innerHTML = size;  //size

    var btn = document.createElement("button");
    btn.onclick = free(id, btn);
    newRow.insertCell(4).append(btn) 
    // = "<td><button onclick=\"del(this)\">结束本进程</button></td>";
    // //删除按键
}

function renew(from, to){
    var tb = document.getElementById("idleTable");
    var rows = tb.rows;
    for(var i = 0; i < rows.length; i++){
        var bg = rows[i].cells[0].innerHTML;
        var ed = rows[i].cells[1].innerHTML;
        var size = rows[i].cells[2].innerHTML;
        if( from["bg"] == bg && from["ed"] == ed && from["size"] == size){
            rows[i].cells[0].innerHTML = to["bg"];
            rows[i].cells[1].innerHTML = to["ed"];
            rows[i].cells[2].innerHTML = to["size"];
        }
    }
}

function free(id, e){
    var tr = e.parentElement.parentElement;
    var index = tr.rowIndex;
    var busyTable = document.getElementById(id).children["busyTable"]
    // 释放的内存信息
    var x1 = busyTable.rows[i].cells[0].innerHTML; //起始地址
    var x2 = busyTable.rows[i].cells[1].innerHTML; //结束地址
    //从占用表中删除该进程
    busyTable.deleteRow(index); 
    var idleTable = document.getElementById(id).children["idleTable"]
    // 将多出来的空间合并
    var Nodes = idleTable.querySelectorAll(".Node")
    var flag = 0;//找到恰当的位置
    for(var i = 0; i < Nodes.length-1; i++){
        var y1 = Nodes[i].querySelector(".bg");
        var y2 = Nodes[i].querySelector(".ed");
        var z1 = Nodes[i+1].querySelector(".bg");
        var z2 = Nodes[i+1].querySelector(".ed");
        // 第一个节点
        if(i == 0 && x2 == y1){ 
            Nodes[i].querySelector(".bg").innerHTML = x1;
            Nodes[i].querySelector(".size").innerHTML += (x2-x1);
            flag = 1;
            break;
        }
        // 中间情况
        else if(y2 == x1 && x2 == z1){//[y1本来闲置区y2][x1释放区x2][z1本来闲置区z2]
            Nodes[i].querySelector(".ed").innerHTML = z2;
            Nodes[i].querySelector(".size").innerHTML += (x2-x1) + (z2-z1);
            idleTable.deleteRow(i+1);
            flag = 1;
            break;
        }
        else if(y2 == x1){
            Nodes[i].querySelector(".ed").innerHTML = x2;
            Nodes[i].querySelector(".size").innerHTML += (x2-x1);
            flag = 1;
            break;
        }
        else if(x2 == z1){
            Nodes[i+1].querySelector(".bg").innerHTML = x1;
            Nodes[i+1].querySelector(".size").innerHTML += (x2-x1);
            flag = 1;
            break;
        }
        // 末尾
        if(i == Nodes.length-2 && z2 == x1){
            Nodes[i+1].querySelector(".ed").innerHTML = x2;
            Nodes[i+1].querySelector(".size").innerHTML += (x2-x1);
            flag = 1;
            break;
        }
    }
    if(!flag){//需要新建一个行
        var newRow = idleTable.insertRow(-1);
        newRow.className = "Node"
        newRow.insertCell(0).innerHTML = x1;         //起始地址
        newRow.insertCell(1).innerHTML = x2;         //结束地址
        newRow.insertCell(2).innerHTML = x2-x1;      //大小
    }

}
