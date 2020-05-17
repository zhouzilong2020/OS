import tkinter as tk


def btn1_change_btn1(event):
    '''方式一：通过事件控制自己'''
    if event.widget['state'] == 'normal':
        event.widget['state'] = 'disabled'
    elif event.widget['state'] == 'disabled':
        #event.widget['state'] = 'normal'
        pass

def btn2_change_btn1():
    '''方式二：直接点名，控制别的按钮'''
    if btn1['state'] == 'normal':
        btn1['state'] = 'disabled'
    elif btn1['state'] == 'disabled':
        btn1['state'] = 'normal'

root = tk.Tk()

btn1 = tk.Button(root, text='REOOT', fg="blue", state=tk.DISABLED, width=12, height=1)
btn1.pack()
btn2 = tk.Button(root, text='TEST', fg="blue", state='normal', width=12, height=1, command=btn2_change_btn1)
btn2.pack()

btn1.bind('<Button-1>', btn1_change_btn1)

root.mainloop()