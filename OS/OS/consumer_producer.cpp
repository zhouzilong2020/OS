//
//  consumer_producer.cpp
//  OS
//
//  Created by  周子龙 on 2020/5/8.
//  Copyright © 2020 周子龙. All rights reserved.
//
#include <iostream>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <stdlib.h>
using namespace std;
#define MAX_BUFFER_SIZE 2
//生产者数目
#define P_NUM 1
//消费者数目
#define C_NUM 2

/*共享区存放的资源*/
struct item{
    item(int c){
        content = c;
    }
    item(){}
    int content;
};

/*共享区*/
struct Buffer{
    Buffer(){
        in = out = 0;
    }
    //添加资源到共享区
    void addItem(const item &i){
        queue[in] = i;
        in = (in+1)%MAX_BUFFER_SIZE;
    }
    //从共享区获取资源
    void getItem(item &i){
        i = queue[out];
        out = (out+1)%MAX_BUFFER_SIZE;
    }
    //打印共享区状态
    void printBuffer(){
        printf("buffer status:\n");
        printf("current in-->%d  out-->%d\n", in, out);
        int num_lines = MAX_BUFFER_SIZE/10;//每行打印十个共享区
        int mod = MAX_BUFFER_SIZE%10;
        for(int i = 0; i < num_lines; i++){
            for(int j = i*10; j < i*10+10; j++)  printf("No.%d\t", j);
            printf("\n");
            for(int j = i*10; j < i*10+10; j++)  printf("%-8d", queue[j].content);
            printf("\n");
        }
        if(mod){//多出来的共享区，继续打印完
            for(int j = num_lines*10; j < num_lines*10+mod; j++)  printf("No.%d\t", j);
            printf("\n");
            for(int j = num_lines*10; j < num_lines*10+mod; j++)  printf("%-8d", queue[j].content);
            printf("\n");
        }
        
    }
    int in;                     //循环队列的进入指针
    int out;                    //循环对列的出队指针
    item queue[MAX_BUFFER_SIZE];//循环对列
};

void *consumer(void *arg);  //消费者进程函数
void *producer(void *arg);  //生产者进程函数
int a = sem_unlink("full"); //取消系统之前的的信号量关联，为下面自定义信号量准备
int b = sem_unlink("empty");
int c = sem_unlink("print");
//信号量full：判断共享区有几个存放了数据
sem_t* full = sem_open("full", O_CREAT|O_EXCL, 0644, 0);
//信号量empyt：判断共享区有几个空的区域
sem_t* empty = sem_open("empty", O_CREAT|O_EXCL, 0644, MAX_BUFFER_SIZE);
//互斥信号量：work_mutex
pthread_mutex_t work_mutex;
//共享区;
Buffer buffer;

//资源计数器，每次生成资源后加一，并作为下一次生产的资源
int i = 1;


/*消费者线程*/
void *consumer(void *arg){
    while(1){
        sem_wait(full);
        pthread_mutex_lock(&work_mutex);
        
        /*读取数据*/
        item tem;
        buffer.getItem(tem);
        
        /*打印共享区状态*/
        printf("consumed item, value:%d\n", tem.content);
        buffer.printBuffer();
        printf("\n");
        
        pthread_mutex_unlock(&work_mutex);
        sem_post(empty);
        sleep(2);//缓冲，便于显示
    }
    return NULL;
}


/*生产者线程*/
void *producer(void *arg){
    while(1){
        sem_wait(empty);
        pthread_mutex_lock(&work_mutex);
        
        /*生产数据*/
        item new_item(i);
        i++;
        /*存放到共享区*/
        buffer.addItem(new_item);
        /*打印共享区状态*/
        printf("produced item, value:%d\n", new_item.content);
        buffer.printBuffer();
        printf("\n");
        
        pthread_mutex_unlock(&work_mutex);
        sem_post(full);
        sleep(2);//缓冲，便于显示
    }
    return NULL;
}

int main(){
    printf("shread areas:%d, consumers:%d, producer:%d\n", MAX_BUFFER_SIZE, C_NUM, P_NUM);
    pthread_t P[P_NUM];
    pthread_t C[C_NUM];
    /*创建消费者进程*/
    for(int i = 0; i < C_NUM; i++){
        pthread_create(C+i, NULL, consumer, NULL);
        sleep(1);//缓冲，方便观察
    }
    /*创建生产者进程进程*/
    for(int i = 0; i < P_NUM; i++){
        pthread_create(P+i, NULL, producer, NULL);
        sleep(1);//缓冲，方便观察
    }
    
    /*等待各个进程运行结束，在本程序中不会结束*/
    for(int i = 0; i < P_NUM; i++)
        pthread_join(C[i], NULL);
    for(int i = 0; i < C_NUM; i++)
        pthread_join(P[i], NULL);
    
    /*删除创建的信号量*/
    sem_unlink("full");
    sem_unlink("empty");
    sem_unlink("my_mutex");
    return 0;
}
