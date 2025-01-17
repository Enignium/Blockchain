
CC = gcc
CFLAGS = -Wall
LIBS = `pkg-config fuse3 --cflags --libs`
SRC = interface.c fops.h
EXEC = fsi

all: $(EXEC)

$(EXEC): $(SRC)
	$(CC) $(CFLAGS) $(SRC) $(LIBS) -o $(EXEC)

clean:
	rm -f $(EXEC)
