import threading
import time
import queue

class Elevator(threading.Thread):
    def __init__(self, elevatorID, insideButton, mailbox, maxLevel = 20, curLevel = 1, runningTime = 1):
        threading.Thread.__init__(self)
        self.elevatorID = elevatorID   
        self.runningTime = runningTime  #运行速度
        self.curLevel = curLevel        #当前楼层
        self.curTarget = curLevel       #表示当前电梯的目标楼层, 记录了同方向上的最高（低）的楼层
        self.maxLevel = maxLevel        #电梯能够到达的最高楼层
        self.curDirection = 0           #电梯的当前运行方向，1代表上行，-1代表下行，0代表当前闲置
        self.insideButton = insideButton  #电梯内部的按键情况是一个GUI的控制句柄
        self.stop = 0                   #电梯是否接受开关门
        self.insideButton["button"][-1]['command'] = self.closeDoorButtonPush
        self.insideButton["button"][-2]['command'] = self.openDoorButtonPush
        
        #线程间数据交流
        self.mailbox = mailbox
        self.upStops = []             #电梯收到的上行停靠请求
        self.downStops = []           #电梯收到的下行停靠请求
        self.full = threading.Semaphore(0)  #资源信号量，判断当前电梯是否有任务进行中，如果没有则等待
        self.open = threading.Semaphore(0)   #互斥信号量，开门信息
        
    def run(self):
        while 1:
            self.full.acquire()
            self.moveToTarget()
            self.newTarget()
    
    def newTarget(self):
        if len(self.upStops) != 0:
            self.curDirection = 1
            self.curTarget = self.upStops[-1]
        elif len(self.downStops) != 0:
            self.curDirection = -1
            self.curTarget = self.downStops[0]

    def openDoor(self):
        # 到站，获取信号量
        self.full.acquire()
        # 门已打开
        self.open.release()
        self.stop = 1
        # 传递给主进程，用以更改外部按钮状态
        if self.curLevel == self.curTarget:
            self.mailbox.put([self.curLevel, 0])
        else:
            self.mailbox.put([self.curLevel, self.curDirection])
        # 更新内部， 开门显示
        self.insideButton["level"]["text"] = f"{self.curLevel}"
        self.insideButton["status"]["text"] = "«»"
        time.sleep(0.3)
        self.insideButton["status"]["text"] = "« »"
        time.sleep(0.3)
        self.insideButton["status"]["text"] = "«  »"
        time.sleep(1)
            
    def closeDoor(self):
        # 门关上
        self.open.acquire()
        self.stop = 0
        # 关门显示
        self.insideButton["status"]["text"] = "»  «"
        time.sleep(0.3)
        self.insideButton["status"]["text"] = "» «"
        time.sleep(0.3)
        self.insideButton["status"]["text"] = "»«"
        time.sleep(0.3)
        self.insideButton["button"][self.curLevel-1]["state"] = "normal"

    def renewScreen(self):
        if self.curDirection == -1:
            self.insideButton["status"]["text"] = "⇣"
        elif self.curDirection == 1:
            self.insideButton["status"]["text"] = "⇡"
        else:
            self.insideButton["status"]["text"] = "⎯"
        self.insideButton["level"]["text"] = f"{self.curLevel}"

    # 移动到电梯当前的最高、低楼层
    def moveToTarget(self):
        self.full.release()
        if self.curTarget == self.curLevel:
            self.openDoor()
            self.closeDoor()
            self.downStops.remove(self.curLevel)
        # 当没有达到目标楼层的时候，则一直移动
        while(self.curLevel != self.curTarget):
            self.renewScreen()
            time.sleep(self.runningTime)
            self.curLevel += self.curDirection
            #print(f"elevator{self.elevatorID} from {self.curLevel-self.curDirection} to {self.curLevel}")
            # 上行方向
            if self.curDirection == 1:
                # 如果停靠楼层有当前楼层，则开门
                if self.curLevel in self.upStops:
                    self.openDoor()
                    self.closeDoor()
                    self.upStops.remove(self.curLevel)
            # 下行方向
            else:
                # 如果停靠楼层有当前楼层，则开门
                if self.curLevel in self.downStops:
                    self.openDoor()
                    self.closeDoor()
                    self.downStops.remove(self.curLevel)
        self.curDirection = 0
        self.renewScreen()
            
    # 为电梯规划新的停靠楼层
    def newStop(self, level):
        # 当前为空闲则规划方向
        if self.curDirection == 0:
            self.curDirection = 1 if level - self.curLevel > 0 else -1
        # 有待规划的楼层处于上行方向
        if (level - self.curLevel) >0 :
            self.upStops.append(level)
            self.upStops.sort()
            # 规划新的最高楼层
            if self.upStops[-1] > self.curTarget and self.curDirection > 0:
                self.curTarget = self.upStops[-1]
        # 有待规划的楼层处于下行方向
        else:
            self.downStops.append(level)
            self.downStops.sort()
            # 规划新的最低楼层
            if self.downStops[0] < self.curTarget and self.curDirection < 0:
                self.curTarget = self.downStops[0]
        self.full.release()

    # 只有电梯处于空闲，或者门已经打开才能按下按钮
    def openDoorButtonPush(self):
        # 如果当前电梯内空闲，说明当前楼层就为目标楼层，直接释放一个任务信号量就可以完成开关门的逻辑
        if self.curDirection == 0:
            self.newStop(self.curLevel)
        elif self.stop == 1:
            self.insideButton["button"][-2]['state'] = 'disable'
            self.open.acquire()

    def closeDoorButtonPush(self):
        if self.stop == 1:
            self.open.release()
            self.insideButton["button"][-2]['state'] = 'normal'
        
    def __str__(self):
        return f'{self.name} at {self.curLevel}'