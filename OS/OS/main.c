//
//  main.c
//  OS
//
//  Created by  周子龙 on 2020/4/2.
//  Copyright © 2020 周子龙. All rights reserved.
//

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>

#define MAX_LINE 80

void setup(char inputBuffer[], char *args[], int *background){
//    while( scanf("%s", inputBuffer+1))
    printf("%s", inputBuffer);
    inputBuffer[0] = strlen(inputBuffer+1);
    int cnt, cnt_arg;
    cnt_arg = 0;
    for(int i = 1; i < inputBuffer[0]; i++){
        if (inputBuffer[i] == ' '){
            char* arg = (char *)malloc(sizeof(char) * cnt);
            strcpy(arg, inputBuffer+i);
            cnt = 0;
            cnt_arg++;
        }
        cnt++;
    }
    if (args[cnt_arg-1][0] == '&'){
        *background = 1;
        free(args[cnt_arg-1]);
        args[cnt_arg-1] = NULL;
    }
    
}

int fun() {
    char inputBuffer[MAX_LINE];
    int background;         /* bg==1 if a command is followed by & */
    char *args[MAX_LINE/2+1];
    
    while(1){
        background = 0;printf("COMMAND-->");
        setup(inputBuffer, args, &background);
    }

}
