import tkinter as tk  # 使用Tkinter前需要先导入
from tkmacosx import Button
import functools as ft
from shedulor import *

# 建立窗口
window = tk.Tk()
window.title('Elevator Simulator Designed by Zilong Zhou')
window.geometry('800x600')  # 这里的乘是小x   

def function(button, i):
    button["bg"]="green"
    button['state']="disabled"
    # 分配
    print(i)

# 第5步，创建一个按钮并放置，点击按钮调用print_selection函数
f1 = tk.Frame(width = 100, height = 100)
button_ele1 = [ [0, i+1] for i in range(20)]
cnt = 0
tk.Label(f1, text="Elevator1").grid(column = 0, row = 0)
tk.Label(f1, text="direction").grid(column = 0, row = 1)
tk.Label(f1, text="floor").grid(column = 0, row = 2)
for i in button_ele1:
    b = tk.Button(f1, text=f'{i[1]}', width=2, height=2,bg='blue') 
    b["command"] = ft.partial(function, i = i, button = b)
    cnt +=1
    if cnt <= 10:
        b.grid(column = 1, row=cnt+1)
    else:
        b.grid(column = 2, row=cnt-9)
f1.pack(side='left', fill='x', expand='yes', padx = 10, pady = 10)



cnt = 0
f2 = tk.Frame()
button_ele2 = [ i+1 for i in range(20)]
for i in button_ele2:
    a = tk.Label(f2, text=f"{i}",width=2, height=2)
    up = tk.Button(f2, text=f'上', width=2, height=1,bg='blue') 
    up["command"] = ft.partial(function, i = [i, 1], button = up)

    down = tk.Button(f2, text=f'下', width=2, height=1,bg='blue') 
    down["command"] = ft.partial(function, i = [i, -1], button = down)

    cnt +=1
    if cnt <= 10:
        a.grid(column = 0, row = cnt+1)
        up.grid(column = 1, row=cnt+1)
        down.grid(column = 2, row=cnt+1)
    else:
        a.grid(column = 4, row = cnt-9)
        up.grid(column = 5, row=cnt-9)
        down.grid(column = 6, row=cnt-9)
f2.pack(side='left', fill='x', expand='yes')
 
# 第8步，主窗口循环显示
window.mainloop()