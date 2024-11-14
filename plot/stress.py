import subprocess
import time
import math
import random
from concurrent.futures import ThreadPoolExecutor
import threading
import json

total_response_time = 0
lock = threading.Lock()

def run_upload_task():
    global total_response_time
    start_time = time.time()
    result = subprocess.run(['npx','hardhat', 'uploadRandom' ,'100'], capture_output=True, text=True)
    end_time = time.time()
    response_time = (end_time - start_time) * 1000
    print(f"Tempo di esecuzione: {response_time:.2f} ms")

    with lock:
        total_response_time += response_time

def execute_in_parallel(num_executions, avg_sleep_time):
    threads = []
    with ThreadPoolExecutor(max_workers=num_executions) as executor:
        for i in range(num_executions):  
            threads.append(executor.submit(run_upload_task))
            c = random.random() # da 0 ad 1
            t = -avg_sleep_time * math.log(c)
            time.sleep(t / 1000)
        for thread in threads:
            thread.result() #join su tutti i thread


if __name__ == "__main__":
    data = {"x":[], "y":[]}
    for i in range(1, 20):
        num_executions = 1024
        avg_sleep_time = i*25
        avg_sending_rate = 1/avg_sleep_time
        execute_in_parallel(num_executions, avg_sleep_time)
        avg_response_time = total_response_time / num_executions
        print(f"Rate medio di invio: {avg_sending_rate:.5f} ms")
        print(f"Tempo medio di risposta: {avg_response_time:.5f} ms")
        data["x"].append(avg_sending_rate)
        data["y"].append(avg_response_time)
        total_response_time = 0

    with open("data.json", "w") as json_file:
        json.dump(data, json_file, indent=4)
