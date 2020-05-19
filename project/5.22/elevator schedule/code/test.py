import tkinter as tk  # 使用Tkinter前需要先导入
import functools as ft
import tkinter.messagebox as mb
from shedulor import *
5
window = tk.Tk()
window.title('Elevator Simulator by Zilong Zhou 1851201')
window.geometry('1024x768')  # 这里的乘是小x

t = tk.Text(window)
t.focus()
for i in range(1000):
    t.insert(1.0, f"{i}\n")
t.pack()


window.mainloop()