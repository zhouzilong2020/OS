//
//  Matrix Multiplication.cpp
//  OS
//
//  Created by  周子龙 on 2020/4/19.
//  Copyright © 2020 周子龙. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>
#include <time.h>
#define M 3
#define K 2
#define N 3

struct v {
    int i;
    int j;
};

int A[M][K] = { {1,4}, {2,5}, {3,6} };
int B[K][N] = { {8,7,6}, {5,4,3} };
int C[M][N];

void *runner(void *data){
    struct v* pos = (struct v*)data;
    int tem = 0;
    for(int i = 0; i < K; i++)
        tem += A[pos->i][i]*B[i][pos->j];
    C[pos->i][pos->j] = tem;
    pthread_exit(0);
}

void martixMul(){
    pthread_t tid[M*N];
    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED); // 这个属性说明了线程是如何结束的
    // PTHREAD_CREATE_JOINABLE 同步结束    需要pthread_join  否则会等待超时退出
    // PTHREAD_CREATE_DETACHED 异步结束    pthread_join没有作用  父线程不会等待，推出就退出了
    int cnt = 0;
    for(int i = 0; i < M; i++)
        for(int j = 0; j < N; j++){
            struct v* data = new struct v;
            data->i = i;
            data->j = j;
            pthread_create(tid+cnt, &attr, runner, data);
            cnt++;
        }
//    for(int i = 0; i < M*N; i++)
//        pthread_join(tid[i], NULL);
    
}


// 比较使用多线程计算矩阵和不使用多线程计算矩阵的时间
int fun(){
    clock_t a,b;
    a = clock();
    for(int i = 0; i < 1000; i++)
        martixMul();
    a = clock()-a;
    
    b = clock();
    for(int i = 0; i < 1000; i++){
        int tem = 0;
        for(int i = 0; i < M; i++)
            for(int j = 0; j < N; j++){
                for(int k = 0; k < K; k++)
                    tem += A[i][k]*B[k][j];
                C[i][j] = tem;
            }
    }
    b = clock()-b;
    
    printf("multithread: %lu\nsigle thread: %lu\n", a, b);
    return 0;
}

//multithread: 238718  创建线程消耗了大量的时间
//sigle thread: 435    直接计算来的更加直接，节约了很多
