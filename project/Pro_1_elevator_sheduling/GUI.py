import tkinter as tk  # 使用Tkinter前需要先导入
import functools as ft
from shedulor import *

class GUI:
    def __init__(self):
        # 建立窗口
        self.window = tk.Tk()
        self.window.title('Elevator Simulator Designed by Zilong Zhou')
        self.window.geometry('800x600')  # 这里的乘是小x
        # 存放电梯内部显示的相关句柄
        self.insideButton = {}
        # 最放外部的按键
        self.outsideButton = []
        for i in range(5):
            self.buildInsideButton(i)
        self.buildOusideButton()

        self.scheduler = Scheduler(insideButton = self.insideButton, outsideButton = self.outsideButton)
        self.scheduler.start()
        # 显示窗口
        self.window.mainloop()

    def insideButtonPush(self, mes):
        id, level = mes
        button = self.insideButton[f"{id}"]["button"][level]
        button["bg"]="green"
        button["state"]="disabled"
        # 调度
        self.scheduler.insideButton(id, level+1)
        print(mes)

    def outsideButtonPush(self, mes):
        level, dir = mes
        print(mes)
        if dir == 1:
            self.outsideButton[level]["up"]["state"] = "disable"
            self.outsideButton[level]["up"]["bg"] = "red"
        else:
            self.outsideButton[level]["down"]["state"] = "disable"
            self.outsideButton[level]["down"]["bg"] = "red"
        self.scheduler.schedule(level+1, dir)


    # 建立楼层上的显示
    def buildOusideButton(self):
        cnt = 0
        f = tk.Frame()
        button_ele = [ i for i in range(20)]
        for i in button_ele:
            a = tk.Label(f, text=f"{i+1}",width=2, height=2)
            up = tk.Button(f, text=f'△', width=2, height=1,bg='silver') 
            up["command"] = ft.partial(self.outsideButtonPush, mes = [i, 1])

            down = tk.Button(f, text=f'▽', width=2, height=1,bg='silver') 
            down["command"] = ft.partial(self.outsideButtonPush, mes = [i, -1])

            self.outsideButton.append({"up":up, "down":down})
            
            cnt +=1
            if cnt <= 10:
                a.grid(column = 0, row = cnt+1)
                up.grid(column = 1, row=cnt+1)
                down.grid(column = 2, row=cnt+1)
            else:
                a.grid(column = 4, row = cnt-9)
                up.grid(column = 5, row=cnt-9)
                down.grid(column = 6, row=cnt-9)
        f.pack(side='left', fill='x', expand='yes')

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
            cnt +=1
            if cnt <= 10:       # 排列成两行
                b.grid(column = 1, row=cnt+1)
            else:
                b.grid(column = 2, row=cnt-9)
        f.pack(side='left', fill='x', expand='yes', padx = 5, pady = 5)
        



gui = GUI()

