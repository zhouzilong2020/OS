from tkinter import *

def moverectangle(event):  # 绑定方向键
    while True:
        
        canvas.move("r1", 0, -1)
    if event.keysym == "Up":
        canvas.move(1, 0, -1)  # 移动的是 ID为1的事物【move（2,0,-5）则移动ID为2的事物】，使得横坐标加0，纵坐标减5
    elif event.keysym == "Down":
        canvas.move(1, 0, 1)
    elif event.keysym == "Left":
        canvas.move(1, -1, 0)
    elif event.keysym == "Right":
        canvas.move(1, 1, 0)

tk = Tk()
w = 400
h = 800
w_rec = 40
space = 10
h_rec = 80
canvas = Canvas(tk, width = w, height = h, bd = 5, confine=True, relief = "groove") #设置画布
canvas.pack() #显示画布
i = 1
a = [w_rec, 20+w_rec*(i+1),h-h_rec, 20+w_rec*i]
for i in range(5):
    r = canvas.create_rectangle(100+i*(w_rec+space), h - h_rec, 100+i*(w_rec+space)+w_rec, h, fill="green", tag=f"r{i}") # 事件ID为1

line = canvas.create_line(123, 123, 243,234)
a = canvas.create_text(100,10, text="123")
def moveTo(level):
    pass

canvas.bind_all("<KeyPress-Up>",moverectangle) #绑定方向键与函数
canvas.bind_all("<KeyPress-Down>",moverectangle)
canvas.bind_all("<KeyPress-Left>",moverectangle)
canvas.bind_all("<KeyPress-Right>",moverectangle)
mainloop()