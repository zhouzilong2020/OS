import threading
import time
import queue
from elevator import Elevator

exitFlag = 0

class Scheduler():
    def __init__(self, insideButton, outsideButton, elevatorNum = 5, maxLevel = 20):
        self.elevators = []         #存放各个电梯
        self.Lock = threading.Lock()
        self.maxLevel = maxLevel
       
        for i in range(elevatorNum):
            # 实例化电梯
            self.elevators.append(Elevator(i, insideButton = insideButton[f"{i}"], outsideButton = outsideButton,maxLevel = maxLevel))

    def run(self):
        threads = []
        for elevator in self.elevators:
            elevator.start()
        

    # 在某一部电梯内部按下了一个按钮
    def insideButton(self, eleID, level):
        self.elevators[eleID].newStop(level)

    # 为外部按键按下的第level层的dir方向进行规划
    def schedule(self, level, dir):
        elevator = self.getValidElevator(level, dir)
        elevator.newStop(level)

    # 基于look调度算法 获取最优电梯
    def getValidElevator(self, level, dir):
        min = self.maxLevel+2
        validElevator = None
        for elevator in self.elevators:

            elevator.workLock.acquire() #  互斥访问锁
            
            if elevator.curDirection == 0:
                tem = abs((level - elevator.curLevel))
            else:
                # 找到与当前请求的楼层最近的同一运行方向电梯
                tem = (level - elevator.curLevel)*elevator.curDirection*dir
            elevator.workLock.release() # 互斥访问锁
            if tem >= 0 and tem < min:
                validElevator = elevator
                min = tem
        return validElevator

def main():
    # S = Scheduler()
    # S.run()
    pass

if __name__ == '__main__':
    main()
