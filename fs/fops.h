#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>

typedef struct file {
    char nome[256];
    char contenuto[256];
} file_t;

const char* BASE_DIR = "/home/bantino/Progetti/hardhat-esempio"; 

file_t get_file(unsigned int file_id) {

    file_t file;
    strcpy(file.nome, "_");
    strcpy(file.contenuto, "_");

    char buffer[512];
    char command[512]; 

    sprintf(command, "cd %s && npx hardhat get %u", BASE_DIR, file_id);

    FILE* pipe = popen(command, "r");

    if (pipe == NULL) {
        perror("Errore nell'aprire la pipe");
        return file;
    }

    int bytes_read = fread(buffer, 1, sizeof(buffer) - 1, pipe);
    buffer[bytes_read] = '\0';
    char *saveptr;
    strcpy(file.nome, strtok_r(buffer, ",", &saveptr));
    strcpy(file.contenuto, strtok_r(NULL, ",", &saveptr));
    pclose(pipe);
    return file;
}

unsigned int get_file_num() {
    char buffer[256];
    unsigned long filenum;

    char command[512];
    sprintf(command, "cd %s && npx hardhat filenum", BASE_DIR);

    FILE* pipe = popen(command, "r");
    if (pipe == NULL) {
        perror("Errore nell'aprire la pipe");
        return 0;
    }

    int bytes_read = fread(buffer, 1, sizeof(buffer) - 1, pipe);
    buffer[bytes_read] = '\0';
    
    filenum = strtoul(buffer, NULL, 10);
    return filenum;
}


int is_file_valid(const char* name) {
    unsigned int filenum = get_file_num();
    file_t curr_file;

    for (unsigned int i = 0; i < filenum; i++) {
        curr_file = get_file(i);
        if (strcmp(curr_file.nome, name) == 0) {
            return i;
        }
    }
    return -1;
}

