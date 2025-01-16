#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct file {
    char contenuto[256];
} file_t;

const char* BASE_DIR = "/home/bantino/Progetti/hardhat-esempio"; //TODO

file_t get_file(const char* file_name) {

    file_t file;
    strcpy(file.contenuto, ".");

    char buffer[512];
    char command[512]; 

    sprintf(command, "cd %s && npx hardhat get %s", BASE_DIR, file_name);

    FILE* pipe = popen(command, "r");

    if (pipe == NULL) {
        perror("Errore nell'aprire la pipe");
        return file;
    }

    int bytes_read = fread(buffer, 1, sizeof(buffer) - 1, pipe); //TODO, LEGGERE DIM byte scritti nella pipe
    buffer[bytes_read] = '\0';

    strcpy(file.contenuto, buffer);
    pclose(pipe);
    return file;
}


bool is_file_valid(const char* name) { 
    
    char buffer[512]; 
    char command[256]; 
    sprintf(command, "cd %s && npx hardhat getnames", BASE_DIR);

    FILE* pipe = popen(command, "r");
    if (pipe == NULL) {
        perror("Errore nell'aprire la pipe");
        return 0;
    }

    int bytes_read = fread(buffer, 1, sizeof(buffer) - 1, pipe); //come sopra
    buffer[bytes_read] = '\0';

    printf("DEBUG INFO: '%s\n'",buffer);

    if(strcmp(buffer,"true") == 0)
        return true;
    else
        return false;

}

