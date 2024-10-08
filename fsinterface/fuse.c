#define FUSE_USE_VERSION 31

#include <fuse3/fuse.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

static const char *filesystem_str = "My Ethereum-backed Filesystem\n";

static int eth_getattr(const char *path, struct stat *stbuf, struct fuse_file_info *fi)
{
    (void) fi;
    memset(stbuf, 0, sizeof(struct stat));

    if (strcmp(path, "/") == 0) {
        stbuf->st_mode = S_IFDIR | 0755;
        stbuf->st_nlink = 2;
    } else if (strcmp(path, "/hello.txt") == 0) {
        stbuf->st_mode = S_IFREG | 0444;
        stbuf->st_nlink = 1;
        stbuf->st_size = strlen(filesystem_str);
    } else {
        return -ENOENT;
    }
    return 0;
}

static int eth_readdir(const char *path, void *buf, fuse_fill_dir_t filler, off_t offset, struct fuse_file_info *fi, enum fuse_readdir_flags flags)
{
    (void) offset;
    (void) fi;
    (void) flags;

    if (strcmp(path, "/") != 0)
        return -ENOENT;

    filler(buf, ".", NULL, 0, 0);
    filler(buf, "..", NULL, 0, 0);

    // Chiama Hardhat per ottenere tutti i file
    FILE *fp;
    char result[1024];
    fp = popen("npx hardhat run /home/bantino/Progetti/HardHat-Esempi/scripts/eth.js --get_all_files", "r");
    if (fp == NULL) {
        return -EIO;
    }

    while (fgets(result, sizeof(result), fp) != NULL) {
        // Aggiunge il nome del file alla lista nel filesystem FUSE
        filler(buf, result, NULL, 0, 0);
    }
    pclose(fp);

    return 0;
}

static int eth_open(const char *path, struct fuse_file_info *fi)
{
    if (strcmp(path, "/hello.txt") != 0)
        return -ENOENT;

    if ((fi->flags & O_ACCMODE) != O_RDONLY)
        return -EACCES;

    return 0;
}

static int eth_read(const char *path, char *buf, size_t size, off_t offset, struct fuse_file_info *fi)
{
    size_t len;
    (void) fi;

    if (strcmp(path, "/hello.txt") != 0)
        return -ENOENT;

    len = strlen(filesystem_str);
    if (offset < len) {
        if (offset + size > len)
            size = len - offset;
        memcpy(buf, filesystem_str + offset, size);
    } else
        size = 0;

    return size;
}

// Funzione per scrivere (uploadare) un file
static int eth_write(const char *path, const char *buf, size_t size, off_t offset, struct fuse_file_info *fi)
{
    // Chiama Hardhat per uploadare il file
    char command[1024];
    snprintf(command, sizeof(command), "npx hardhat run /home/bantino/Progetti/HardHat-Esempi/scripts/eth.js --upload \"%s\" \"%s\"", path + 1, buf);

    int ret = system(command);
    if (ret != 0) {
        return -EIO;
    }

    return size;
}

static const struct fuse_operations eth_oper = {
    .getattr    = eth_getattr,
    .readdir    = eth_readdir,
    .open       = eth_open,
    .read       = eth_read,
    .write      = eth_write,
};

int main(int argc, char *argv[])
{
    system("pwd");
    return fuse_main(argc, argv, &eth_oper, NULL);
}
