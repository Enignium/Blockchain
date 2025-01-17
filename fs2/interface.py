import os
from web3 import Web3
from fuse import FUSE, Operations
import json


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
        


    def getattr(self, path):
        """ Recupera i metadati di un file (come le dimensioni). """
        if path == '/':
            return {
                'st_mode': 0o755 | 0o040000,  # Directory
                'st_nlink': 2,
            }
        else:
            
            file_name = path[1:]
            exists = self.contract.functions.isFileAlreadyIn(file_name).call()
            if not exists:
                raise FileNotFoundError

            file_content = self.contract.functions.getFile(file_name).call()
            return {
                'st_mode': 0o444,  # File read-only
                'st_size': len(file_content),
                'st_nlink': 1,
            }

    def readdir(self, path, fh):

        if path != '/':
            raise FileNotFoundError

        file_names = self.contract.functions.getFileNames().call()
        return ['.', '..'] + file_names

    def read(self, path, size, offset, fh):

        file_name = path[1:]

        file_content = self.contract.functions.getFile(file_name).call()

        return file_content[offset:offset+size]

if __name__ == '__main__':
    
    fuse = FUSE(FileStorageFUSE(), './mnt', foreground=True)