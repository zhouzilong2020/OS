import tkinter as tk  # 使用Tkinter前需要先导入
 





class app:
    def __init__(self):
        super().__init__()
        self.shedulor = Shedulor()

        # 建立窗口
        self.window = tk.Tk()
        self.window.title('Elevator Simulator Designed by Zilong Zhou')
        self.window.geometry('800x600')  # 这里的乘是小x   

    def function(i):
        print(f"{i}")


# 第1步，实例化object，建立窗口window
window = tk.Tk()
 
# 第2步，给窗口的可视化起名字
window.title('My Window')
 
# 第3步，设定窗口的大小(长 * 宽)
window.geometry('800x600')  # 这里的乘是小x
 
# # 第4步，在图形界面上创建一个标签label用以显示并放置
# var1 = tk.StringVar()  # 创建变量，用var1用来接收鼠标点击具体选项的内容
# l = tk.Label(window, bg='green', fg='yellow',font=('Arial', 12), width=10, textvariable=var1)
# l.pack()
 
# # 第6步，创建一个方法用于按钮的点击事件
# def print_selection():
#     value = b1.getvar()   # 获取当前选中的文本
#     var1.set(value)  # 为label设置值
 


def function(i):
    print(f"{i}")

# 第5步，创建一个按钮并放置，点击按钮调用print_selection函数
f1 = tk.Frame()
for i in range(20):
    # Button(fm1, text='Top').pack(side=TOP, anchor=W, fill=X, expand=YES)
    b = tk.Button(f1, text=f'{i+1}', width=2, height=1, command= lambda:function(i = f'{i+1}')).grid()
    # b.pack()
f1.pack(side='left', fill='both', expand='yes')

f2 = tk.Frame()
for i in range(20):
    # Button(fm1, text='Top').pack(side=TOP, anchor=W, fill=X, expand=YES)
    
    b = tk.Button(f2, text=f'{i+1}', width=2, height=1).grid()
    # b.pack()
f2.pack(side='left', fill='both', expand='yes')
 



# 第7步，创建Listbox并为其添加内容
var2 = tk.StringVar()
var2.set((1,2,3,4)) # 为变量var2设置值
# 创建Listbox
lb = tk.Listbox(window, listvariable=var2)  #将var2的值赋给Listbox
# 创建一个list并将值循环添加到Listbox控件中
list_items = [11,22,33,44]
for item in list_items:
    lb.insert('end', item)  # 从最后一个位置开始加入值
lb.insert(1, 'first')       # 在第一个位置加入'first'字符
lb.insert(2, 'second')      # 在第二个位置加入'second'字符
lb.delete(2)                # 删除第二个位置的字符
lb.pack()
 
# 第8步，主窗口循环显示
window.mainloop()