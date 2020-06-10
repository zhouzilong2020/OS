// 动态分区分配模拟

// 链表节点
function ListNode(item){
    this.element = item;
    this.next = null;
}

// 链表类
function LinkedList(){
    this.head = new ListNode()

    if(typeof LinkedList._initialized == "undefined") {
        // 插入
        LinkedList.prototype.insert = function(item) {
            let newNode = new ListNode(item);
            newNode.next = this.head.next;
            this.head.next = newNode;
        }

        // 删除
        LinkedList.prototype.remove = function(nodeElement){
            let p = this.head;
            while(p.next != null){
                if(p.next.element == nodeElement){
                    let tem = p.next;
                    p.next = tem.next;
                    delete tem;
                    return true;
                }
                p = p.next;
            }
            return false;
        }

        // 展示当前链表项
        LinkedList.prototype.display = function(){
            let p = this.head;
            while(p.next != null){
                console.log(p.next.element)
                p = p.next;
            }
        }

    };
}

//  内存管理器
function MemoryManager(maxSize){
    this.maxSize = maxSize;
    this.busyTable = new LinkedList()
    this.idleTable = new LinkedList()
    //TODO waiting list!!!!
    // 初始化空闲表
    this.idleTable.insert( {"bg": 0, "ed": this.maxSize, "size": this.maxSize} )
    
    if (typeof MemoryManager._initialized == "undefined") {
        // 分配内存
        MemoryManager.prototype.allocate = function(size, PID){
            let p = this.idleTable.head;
            while(p.next != null){
                if(p.next.element["size"] >= size){ //找到了第一个合适分配的内存
                    // 更新已使用内存表项
                    let item = {"bg": p.next.element["bg"], "ed": p.next.element["bg"]+size, "PID" : PID, "size":size};
                    this.busyTable.insert(item)

                    // 更新页面
                    let newRow = document.getElementById("busyTable").insertRow(-1);
                    newRow.insertCell(0).innerHTML = item["PID"];
                    newRow.insertCell(1).innerHTML = item["bg"];
                    newRow.insertCell(2).innerHTML = item["ed"];
                    newRow.insertCell(3).innerHTML = item["size"];
                    newRow.insertCell(4).innerHTML =  "<td><button onclick=\"del(this)\">结束本进程</button></td>";

                    if(p.next.element["size"] == size){ //剩余区域等于申请区域，则需要从表单中删除
                        let tem = p.next;
                        p.next = tem.next;
                        delete tem;
                    }
                    else{   //剩余区域大于申请区域，只需要修改表项即可
                        p.next.element["size"] -= size;
                        p.next.element["bg"] += size;
                        var to = {"bg" : p.next.element['bg'], "ed":  p.next.element['ed'], "size": p.next.element['size']}
                        renew(item, to)
                    }
                    return true;
                }
                p = p.next;
            }
            return false;
        }

        // 释放内存
        MemoryManager.prototype.free = function(PID){
            let p = this.busyTable.head;
            let bg, ed;
            let flag = 0;
            while(p.next != null){
                if(p.next.element["PID"] == PID){
                    let tem = p.next;
                    p.next = tem.next;
                    // 记录释放内存的信息
                    bg = tem.element["bg"];
                    ed = tem.element["ed"];
                    delete tem;
                    flag = 1;
                    break;
                }
                p = p.next;
            }
            if(flag){ //成功找到了这样的进程，释放内存资源
                p = this.idleTable.head;
                // 检查有无可以合并的区域
                while(p.next != null){
                    if( ed == p.next.element["bg"]){ //新区域的尾可以旧区域头链接
                        
                        var from = {"bg" : p.next.element['bg'], "ed":  p.next.element['ed'], "size": p.next.element['size']}
                        
                        p.next.element['bg'] = bg;
                        p.next.element['size'] += (ed - bg);
                        
                        var to = {"bg" : p.next.element['bg'], "ed":  p.next.element['ed'], "size": p.next.element['size']}
                        renew(from, to);

                        flag = 0;
                        break;
                    }
                    else if( bg == p.next.element["ed"]){ //新区域的头可以旧区域尾链接
                        var from = {"bg" : p.next.element['bg'], "ed":  p.next.element['ed'], "size": p.next.element['size']}
                        
                        p.next.element['ed'] = ed;
                        p.next.element['size'] += (ed - bg);
                        // 还需要检查能否进一步合并，新区域可能起到一个桥梁作用，合并前后两个区域
                        let tem = p.next.next;
                        if(tem != null){
                            if(ed = tem.element["bg"]){ // 前后两个区域可以合并
                                p.next.element['ed'] = tem.element["ed"];
                                p.next.element['size'] += tem.element["size"];
                                p.next.next = tem.next;
                                delete tem;
                            }
                        }
                        var to = {"bg" : p.next.element['bg'], "ed":  p.next.element['ed'], "size": p.next.element['size']}
                        renew(from, to);

                        flag = 0;
                        break; 
                    }
                    p = p.next;
                }
                // 没有找到可以合并的区域
                if(flag){
                    p = this.idleTable.head;
                    while(p.next != null){ // 根据启始地址大小插入
                        if(p.next.element["bg"] > bg){
                            let newNode = new ListNode({"bg":bg, "ed":ed, "size":ed-bg})
                            newNode.next = p.next;
                            p.next = newNode;

                            // 更新页面
                            let newRow = document.getElementById("idleTable").insertRow(-1);
                            newRow.insertCell(0).innerHTML = bg;
                            newRow.insertCell(1).innerHTML = ed;
                            newRow.insertCell(2).innerHTML = ed-bg;
                        
                            break;
                        }
                        p = p.next;
                    }
                }
                return true;
            }
            return false; 
        }

        MemoryManager.prototype.debug = function(){
            this.busyTable.display()
            this.idleTable.display()
        }
    }
}

const MAX_SIZE = 640;
var cnt = 0;
var manager;

document.addEventListener('DOMContentLoaded', function(){
    manager = new MemoryManager(MAX_SIZE);
    init()
//a/sd/asd/asd/as//

})

function init(){          
    var newRow = document.getElementById("idleTable").insertRow(-1);
    newRow.className = "Node"
    newRow.insertCell(0).innerHTML = 0;
    newRow.insertCell(1).innerHTML = MAX_SIZE;
    newRow.insertCell(2).innerHTML = MAX_SIZE;
}

function renew(from, to){
    var tb = document.getElementById("idleTable");
    var rows = tb.rows;
    for(var i = 0; i < rows.length; i++){
        var bg = rows[i].cells[0].innerHTML;
        var ed = rows[i].cells[1].innerHTML;
        var size = rows[i].cells[2].innerHTML;
        if( from["bg"] == bg && from["ed"] == ed && from["size"] == size){
            bg = to["bg"];
            ed = to["ed"];
            size = to["size"];
        }
    }
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

function newJob(){
    let size = document.getElementById("input_size").value;
    if(isValid(size)){
        size = parseInt(size);
        if(!manager.allocate(size, cnt++)){
            window.alert("当前内存碎片过多，请释放一些内存再试一试！");
        }
    }
}

function del(e){
    var tr = e.parentElement.parentElement;
    var index = tr.rowIndex;
    var table = document.getElementById("busyTable");
    let PID = tr.firstElementChild.innerHTML;
    manager.free(PID);
    table.deleteRow(index);
}
