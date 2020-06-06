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
                    this.busyTable.insert({"bg": p.next.element["bg"], "ed": p.next.element["bg"]+size, "PID" : PID})
                    if(p.next.element["size"] == size){ //剩余区域等于申请区域，则需要从表单中删除
                        let tem = p.next;
                        p.next = tem.next;
                        delete tem;
                    }
                    else{   //剩余区域大于申请区域，只需要修改表项即可
                        p.next.element["size"] -= size;
                        p.next.element["bg"] += size;
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
                        p.next.element['bg'] = bg;
                        p.next.element['size'] += (ed - bg);
                        flag = 0;
                        break;
                    }
                    else if( bg == p.next.element["ed"]){ //新区域的头可以旧区域尾链接
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
var a  = new LinkedList()
var manager = new MemoryManager(640)
1+1;