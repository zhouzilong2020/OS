import tkinter as tk  # 使用Tkinter前需要先导入
import functools as ft
import tkinter.messagebox as mb
from shedulor import *
import time

class GUI:
    def __init__(self):
        # 建立窗口
        self.window = tk.Tk()
        self.window.title('Elevator Simulator by Zilong Zhou 1851201')
        # self.window.geometry('800x600')  # 这里的乘是小x
        # 存放电梯内部显示的相关句柄
        self.insideButton = {}
        # 最放外部的按键
        self.outsideButton = []
        # 输出调度信息的面板
        self.output = tk.Text()
        self.output.pack(side = 'bottom', expand='no',fill= 'y')
        self.output.insert(1.0,"elevator schedule detile will be shown here")
        tk.Label(text='Schedule Detile:').pack(side = 'bottom', expand='no',fill= 'both')
        for i in range(5):
            self.buildInsideButton(i)
        self.buildOusideButton()

        self.scheduler = Scheduler(output = self.output,insideButton = self.insideButton, outsideButton = self.outsideButton)
        self.scheduler.start()
        # 显示窗口
        self.window.mainloop()
    
    def openDoor(self, id):
        self.insideButton[f'{id}']["button"][-2]['state'] = 'disable'
        self.insideButton[f'{id}']["button"][-2]['state'] = 'normal'


    def insideButtonPush(self, mes):
        id, level = mes
        button = self.insideButton[f"{id}"]["button"][level]
        button["state"]="disabled"
        # 调度
        self.output.insert(1.0, f"elevator{id} is push {level+1} from inside\n")
        time.sleep(0.2)
        self.scheduler.insideButton(id, level+1)

    def outsideButtonPush(self, mes):
        level, dir = mes
        if dir == 1:
            message = f"{level+1}△ is push from outside\n"
        else: 
            message = f"{level+1}▽ is push from outside\n"
        self.output.insert(1.0, message)
        time.sleep(0.2)
        if dir == 1:
            self.outsideButton[level]["up"]["state"] = "disable"
        else:
            self.outsideButton[level]["down"]["state"] = "disable"
        self.scheduler.schedule(level+1, dir)


    # 建立楼层上的显示
    def buildOusideButton(self):
        cnt = 0
        f = tk.Frame()
        button_ele = [ i for i in range(20)]
        for i in button_ele:
            # 楼层标示
            a = tk.Label(f, text=f"{i+1}",width=2, height=2)
            # 上行按键
            up = tk.Button(f, text=f'△', width=2, height=1,bg='silver') 
            up["command"] = ft.partial(self.outsideButtonPush, mes = [i, 1])
            # 下行按键
            down = tk.Button(f, text=f'▽', width=2, height=1,bg='silver') 
            down["command"] = ft.partial(self.outsideButtonPush, mes = [i, -1])
            # 保留对按键的修改句柄
            self.outsideButton.append({"up":up, "down":down})
            # 排布按键
            a.grid(column = 4 if cnt%2 == 0 else 0, row = 10-int(cnt/2))
            up.grid(column = 5 if cnt%2 == 0 else 1, row = 10-int(cnt/2))
            down.grid(column = 6 if cnt%2 == 0 else 2, row = 10-int(cnt/2))
            # 累计排布按键计数
            cnt +=1
        f.pack(side='left', fill='y', expand='no', padx = 2, pady = 2)

    # 建立第i个电梯的内部按钮
    def buildInsideButton(self, i):
        f = tk.Frame(width = 100, height = 100)
        levels = [ [i, j] for j in range(20)]
        # 电梯编号
        tk.Label(f, text=f"Elevator{i}").grid(column = 0, row = 0)
        # 电梯状态
        status = tk.Label(f, text="⎯")
        status.grid(column = 0, row = 1)
        # 电梯的当前楼层
        level = tk.Label(f, text="1")
        level.grid(column = 0, row = 2)
        # 保留对电梯状态修改的handler
        self.insideButton[f"{i}"] = {"status" : status, "level" : level}
        # 保留电梯内部按钮的handler
        self.insideButton[f"{i}"]["button"] = []
        cnt = 0
        for i in levels:
            b = tk.Button(f, text=f'{i[1]+1}', width=2, height=2, bg="silver") 
            # 按钮的回调函数
            b["command"] = ft.partial(self.insideButtonPush, mes = i)
            self.insideButton[f"{i[0]}"]["button"].append(b)
            b.grid(column = 2 if cnt%2 ==0 else 1, row = 11-int(cnt/2))
            cnt +=1
        
        # 电梯内部开门按钮
        openDoor = tk.Button(f, text=f'⩤⩥',width=2, height=2)
        openDoor.grid(column = 1, row = 1)
        self.insideButton[f"{i[0]}"]["button"].append(openDoor)  #button[-2]为开门按钮
        # 电梯内部关门按钮
        closeDoor = tk.Button(f, text=f'⩥⩤',width=2, height=2)
        closeDoor.grid(column = 2, row = 1)
        self.insideButton[f"{i[0]}"]["button"].append(closeDoor)  #button[-1]为关门按钮
        # 报警按钮
        tk.Button(f, text=f'SOS',width=4, height=2, command = lambda : mb.showwarning('SOS', f'someone in elevator{i[0]} needs help!')).grid(column = 1, row = 0, columnspan = 2)
        f.pack(side='left', fill='y', expand='no', padx = 2, pady = 2)
        
gui = GUI()

