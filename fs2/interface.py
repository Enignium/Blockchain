import os
from web3 import Web3
from fuse import FUSE, FuseOSError, Operations, LoggingMixIn
import json
from errno import ENOENT
from stat import S_IFDIR, S_IFLNK, S_IFREG
from time import time



def get_contract():

    w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

    contract_address = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    contract_address = Web3.to_checksum_address(contract_address)
    with open('../artifacts/contracts/FileStorage.sol/FileStorage.json') as f:
        contract_data = json.load(f)
        abi = contract_data['abi']

    contract = w3.eth.contract(address=contract_address, abi=abi)

    user_address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' ##per ora non fa niente
    user_address = Web3.to_checksum_address(user_address)

                        ##file_names = contract.functions.getFileNames().call()

    return contract



class FileStorageFUSE(Operations):

    def __init__(self):
        self.contract = get_contract()
        


    def getattr(self, path, fh=None):
        print("Getattr" + path)
        if path == '/':
            return {
                'st_mode': 0o755 | S_IFDIR,  # Directory
                'st_nlink': 2,
            }
        else:
            
            file_name = path[1:]
            exists = self.contract.functions.isFileAlreadyIn(file_name).call()
            if not exists:
                print(path + "NON TROVATO")
                raise FuseOSError(ENOENT)

            file_content = self.contract.functions.getFile(file_name).call()
            return {
                'st_mode': 0o444 | S_IFREG,  # File read-only
                'st_size': len(file_content),
                'st_nlink': 1,
            }

    def open(self, path, flags):
        print(f"Open chiamata per {path}")
        ##file_name = path[1:]
        ##exists = self.contract.functions.isFileAlreadyIn(file_name).call() --In teoria controlla getAttr prima
        ##if not exists:
            ##print(f"{path} NON TROVATO")
            ##raise FuseOSError(ENOENT)
        return 0


    def readdir(self, path, fh):

        print("readdir" + path)
        if path != '/':
            print(path + "NON TROVATO")
            raise FuseOSError(ENOENT)
        
        file_names = self.contract.functions.getFileNames().call()
        return ['.', '..'] + file_names

    def read(self, path, size, offset, fh):

        print("READ" + path)

        file_name = path[1:]

        file_content = self.contract.functions.getFile(file_name).call()

        return file_content[offset:offset+size]

if __name__ == '__main__':
    
    fuse = FUSE(FileStorageFUSE(), './mnt', foreground=True)