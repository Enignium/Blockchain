#define FUSE_USE_VERSION 31

#include <fuse.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include "fops.h"

static void *hello_init(struct fuse_conn_info *conn,
			struct fuse_config *cfg)
{
	(void) conn;
	cfg->kernel_cache = 1;
	printf("[INFO] Filesystem inizializzato\n");
	return NULL;
}

static int hello_getattr(const char *path, struct stat *stbuf,
			 struct fuse_file_info *fi)
{
	(void) fi;
	int res = 0;

	memset(stbuf, 0, sizeof(struct stat));
	printf("[INFO] getattr per il path: %s\n", path);

	if (strcmp(path, "/") == 0) {
		stbuf->st_mode = S_IFDIR | 0755;
		stbuf->st_nlink = 2;
		return res;
	}

	int id = is_file_valid(path+1); //<---- molto inefficente , ogni volta che cerca informazioni su un file scorre tra tutti i file presenti nel contratto 
		if (id == -1) {
			printf("[ERROR] getattr: file non trovato: %s\n", path);
			return -ENOENT;

		}
		else {
			file_t curr_file = get_file(id);
			stbuf->st_mode = S_IFREG | 0755;
			stbuf->st_nlink = 1;
			stbuf->st_size = strlen(curr_file.contenuto);
		}

	return res;
}

static int hello_readdir(const char *path, void *buf, fuse_fill_dir_t filler,
			 off_t offset, struct fuse_file_info *fi,
			 enum fuse_readdir_flags flags)
{
	(void) offset;
	(void) fi;
	(void) flags;

	printf("[INFO] readdir path: %s\n", path);

	if (strcmp(path, "/") != 0) {
		printf("[ERROR] readdir: path non valido: %s\n", path);
		return -ENOENT;
	}

	filler(buf, ".", NULL, 0, 0);
	filler(buf, "..", NULL, 0, 0);

	file_t curr_file;
	unsigned int filenum = get_file_num(); 

	for (int i = 0; i < filenum; i++) { // <---- si potrebbe sostituire con una singola task che ritorna tutti i nomi dei vari file contenuti invece che che chiamare filenum volte la task
		curr_file = get_file(i); 
		filler(buf, curr_file.nome, NULL, 0, 0);
	}

	return 0;
}

static int hello_open(const char *path, struct fuse_file_info *fi)
{
	printf("[INFO] open path: %s\n", path);

	return 0;
}

static int hello_read(const char *path, char *buf, size_t size, off_t offset,
		      struct fuse_file_info *fi)
{
	(void) fi;

	int id;
	size_t len;
	printf("[INFO] read path: %s\n", path);
	id = is_file_valid(path+1);
	

	if(id == -1)
		return -ENOENT;

	file_t curr_file = get_file(id);

	len = strlen(curr_file.contenuto);

	if (offset < len) {
		if (offset + size > len)
			size = len - offset;
		memcpy(buf, curr_file.contenuto + offset, size);
	} else
		size = 0;

	return size;
	
	return 0;
}

static const struct fuse_operations hello_oper = {
	.init           = hello_init,
	.getattr	= hello_getattr,
	.readdir	= hello_readdir,
	.open		= hello_open,
	.read		= hello_read,
};

int main(int argc, char *argv[])
{
	int ret;
	printf("[INFO] Inizializzazione fuse\n");

	ret = fuse_main(argc, argv, &hello_oper, NULL);
	return ret;
}
