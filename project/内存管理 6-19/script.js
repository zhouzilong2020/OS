MAX_SIZE = 690;
var cnt = 0;
document.addEventListener('DOMContentLoaded', ()=>{
    // manager = new MemoryManager(MAX_SIZE);
    // 初始化空闲区域表
    addNodeToIdle('session1', 0, MAX_SIZE, MAX_SIZE);
    addNodeToIdle('session2', 0, MAX_SIZE, MAX_SIZE);
    var btn = document.querySelector("#add-btn");
    btn.onclick = newJob;
    btn.disabled = true
    document.querySelector('#input_size').onkeyup = () => {
        //every time you try to push a key
        if (document.querySelector('#input_size').value.length > 0)
            btn.disabled = false;
        else
           btn.disabled = true;
    };

})

function addNodeToIdle(id, bg, ed, size, index = -1){
    // 添加空闲区表节点
    let newRow = document.getElementById(id).children["idleTable"].insertRow(index);
    newRow.className = "Node";
    let cell0 = newRow.insertCell(0);   //起始地址
    let cell1 = newRow.insertCell(1);  //结束地址
    let cell2 = newRow.insertCell(2);  //大小
    cell0.className = 'bg';
    cell1.className = 'ed';
    cell2.className = 'size';
    cell0.innerHTML = bg;
    cell1.innerHTML = ed;
    cell2.innerHTML = size;
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
    document.getElementById("input_size").value = '';
    document.querySelector('#add-btn').disabled = true;

    if(isValid(size)){
        size = Number(size);
        cnt++;
        if(!allocate('session1', size, cnt))
            window.alert("MEM1 当前内存碎片过多，请释放一些内存再试一试！")
        if(! allocate('session2', size, cnt)){
            window.alert("MEM2 当前内存碎片过多，请释放一些内存再试一试！");
        }
    }
}

function allocate(id, size, PID){
    let idleTable = document.getElementById(id).children["idleTable"];
    let Nodes = idleTable.querySelectorAll(".Node");

    if(id == 'session2'){   // 首次适应算法
        for(let i = 0; i < Nodes.length; i++){
            let bg = Nodes[i].querySelector(".bg").innerHTML;
            let freeSize = Nodes[i].querySelector(".size").innerHTML;
            if(size <= freeSize){ 
                Nodes[i].querySelector(".bg").innerHTML -= (-size);
                Nodes[i].querySelector(".size").innerHTML -= size;
                addNodeToBusy(id, Number(bg), Number(bg)+Number(size), Number(size), PID)    //分配成功，添加到占用区表单
                if(Nodes[i].querySelector(".size").innerHTML == '0' && Nodes.length >1){//空闲区刚好用完
                    idleTable.deleteRow(i);
                }
                return true;
            }
        } 
    }
    else{   //最佳适应算法
        let index = -1;
        let min = MAX_SIZE+1;
        let bg, freeSize;
        for(let i = 0; i < Nodes.length; i++){
            bg = Nodes[i].querySelector(".bg").innerHTML;
            freeSize = Number(Nodes[i].querySelector(".size").innerHTML);
            if(size <= freeSize && freeSize < min){ 
                index = i;
                min = freeSize;
            }
        } 
        if(index != -1){
            Nodes[index].querySelector(".bg").innerHTML -= (-size);
            Nodes[index].querySelector(".size").innerHTML -= size;
            addNodeToBusy(id, Number(bg), Number(bg)+Number(size), Number(size), PID)    //分配成功，添加到占用区表单
            if(Nodes[index].querySelector(".size").innerHTML == '0' && Nodes.length >1){//空闲区刚好用完
                idleTable.deleteRow(i);
            }
            return true;
        }
    }
    return false;
}

function addNodeToBusy(id, bg, ed, size, PID){
    // 初始化空闲区表
    let newRow = document.getElementById(id).children["busyTable"].insertRow(-1);
    newRow.className = "Node"
    // 插入单元格
    let cell0 = newRow.insertCell(0)    //PID
    let cell1 = newRow.insertCell(1)    //起始地址
    let cell2 = newRow.insertCell(2)    //终止地址
    let cell3 = newRow.insertCell(3)    //size
    // 类名
    cell0.className = 'PID';
    cell1.className = 'bg';
    cell2.className = 'ed';
    cell3.className = 'size';
    // 赋值
    cell0.innerHTML = PID;
    cell1.innerHTML = bg;
    cell2.innerHTML = ed;
    cell3.innerHTML = size;
    let btn = document.createElement("button");
    btn.innerHTML = '结束进程'
    btn.onclick = function(){free(id, btn)};
    newRow.insertCell(4).append(btn) 
    // = "<td><button onclick=\"del(this)\">结束本进程</button></td>";
    // //删除按键
}

function free(id, e){
    let tr = e.parentElement.parentElement;
    let index = tr.rowIndex;
    let busyTable = document.getElementById(id).children["busyTable"]
    // 释放的内存信息
    let x1 = busyTable.rows[index].cells[1].innerHTML; //起始地址
    let x2 = busyTable.rows[index].cells[2].innerHTML; //结束地址
    //从占用表中删除该进程
    busyTable.deleteRow(index); 
    let idleTable = document.getElementById(id).children["idleTable"]
    // 将多出来的空间合并
    let Nodes = idleTable.querySelectorAll(".Node")
    let flag = 0;//找到恰当的位置
    // 只有一个节点
    if( Nodes.length == 1){ 
        let y1 = Nodes[0].querySelector(".bg").innerHTML;
        let y2 = Nodes[0].querySelector(".ed").innerHTML;
        if(x2 == y1){
            Nodes[0].querySelector(".bg").innerHTML = x1;
            Nodes[0].querySelector(".size").innerHTML -= -(x2-x1);
            flag = 1
        }
        else if(x1 == y2){
            Nodes[0].querySelector(".ed").innerHTML = x2;
            Nodes[0].querySelector(".size").innerHTML -= -(x2-x1);
            flag = 1;
        }
    }
    else{
        for(let i = 0; i < Nodes.length-1; i++){
            let y1 = Nodes[i].querySelector(".bg").innerHTML;
            let y2 = Nodes[i].querySelector(".ed").innerHTML;
            let z1 = Nodes[i+1].querySelector(".bg").innerHTML;
            let z2 = Nodes[i+1].querySelector(".ed").innerHTML;
            if(x2 == y1){
                Nodes[0].querySelector(".bg").innerHTML = x1;
                Nodes[0].querySelector(".size").innerHTML -= -(x2-x1);
                flag = 1
            }
            // 中间情况
            else if(y2 == x1 && x2 == z1){//[y1本来闲置区y2][x1释放区x2][z1本来闲置区z2]
                Nodes[i].querySelector(".ed").innerHTML = z2;
                Nodes[i].querySelector(".size").innerHTML -= -((x2-x1) + (z2-z1));
                idleTable.deleteRow(i+2);
                flag = 1;
                break;
            }
            else if(y2 == x1){
                Nodes[i].querySelector(".ed").innerHTML = x2;
                Nodes[i].querySelector(".size").innerHTML -= -(x2-x1);
                flag = 1;
                break;
            }
            else if(x2 == z1){
                Nodes[i+1].querySelector(".bg").innerHTML = x1;
                Nodes[i+1].querySelector(".size").innerHTML -= -(x2-x1);
                flag = 1;
                break;
            }
            // 末尾
            if(i == Nodes.length-2 && z2 == x1){
                Nodes[i+1].querySelector(".ed").innerHTML = x2;
                Nodes[i+1].querySelector(".size").innerHTML -= -(x2-x1);
                flag = 1;
                break;
            }
        }
    }
    if(!flag){//需要新建一个行
        let index = 0;
        for(; index < Nodes.length; index++){
            if(Nodes[index].querySelector(".bg").innerHTML > x1){
                addNodeToIdle(id, x1,x2,x2-x1,index+1);
                break;
            }
        }
    }

}
