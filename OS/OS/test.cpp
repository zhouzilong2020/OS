//
//  test.cpp
//  OS
//
//  Created by  周子龙 on 2020/5/8.
//  Copyright © 2020 周子龙. All rights reserved.
//

#include <semaphore.h>
#include <thread>
#include <iostream>

int main_a(int argc, char** argv) {
    // initialize semaphore
    sem_unlink("sem_num");
    sem_t* m_sem = sem_open("sem_num", O_CREAT|O_EXCL, S_IRWXU, 0);
    
    int num = 0;
    
    std::thread write_th([&]() -> void {
        for(size_t i = 0; i < 100000; ++i) {
            num += 1;
        }
        std::cout << "from write th, num is: " << num << std::endl;
        sem_post(m_sem);
    });
    
    sem_wait(m_sem);
    std::cout << "from read th, num is: " << num << std::endl;
    
    sem_close(m_sem);
    
    write_th.join();
    
    return 0;
}
